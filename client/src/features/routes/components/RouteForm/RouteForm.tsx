import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import Card from '../../../../ui/Card/Card';
import Input from '../../../../ui/Input/Input';
import Button from '../../../../ui/Button/Button';
import type { RouteType, RouteStatus } from '../../services/routesApi';
import 'mapbox-gl/dist/mapbox-gl.css';
import { encodePolyline } from '../../hooks/useRoutes';
import styles from './RouteForm.module.css';

// Public access token for Mapbox GL
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '';

interface RouteFormProps {
  code: string;
  setCode: (val: string) => void;
  name: string;
  setName: (val: string) => void;
  shortName: string;
  setShortName: (val: string) => void;
  type: RouteType;
  setType: (val: RouteType) => void;
  status: RouteStatus;
  setStatus: (val: RouteStatus) => void;
  color: string;
  setColor: (val: string) => void;
  icon: string;
  setIcon: (val: string) => void;
  totalDistanceKm: number;
  setTotalDistanceKm: (val: number) => void;
  estimatedDurationMin: number;
  setEstimatedDurationMin: (val: number) => void;
  polyline: string;
  setPolyline: (val: string) => void;
  coordinates: { lat: number; lng: number }[];
  setCoordinates: React.Dispatch<React.SetStateAction<{ lat: number; lng: number }[]>>;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  isLoading: boolean;
  isEdit: boolean;
}

export const RouteForm: React.FC<RouteFormProps> = ({
  code,
  setCode,
  name,
  setName,
  shortName,
  setShortName,
  type,
  setType,
  status,
  setStatus,
  color,
  setColor,
  icon,
  setIcon,
  totalDistanceKm,
  setTotalDistanceKm,
  estimatedDurationMin,
  setEstimatedDurationMin,
  polyline,
  setPolyline,
  coordinates,
  setCoordinates,
  onSubmit,
  onClose,
  isLoading,
  isEdit,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const typeOptions = [
    { value: 'LINEAR', label: 'Linear (Lineal) ➡️' },
    { value: 'CIRCULAR', label: 'Circular (Retorno) 🔄' },
    { value: 'EXPRESO', label: 'Expreso (Rápido) ⚡' },
  ];

  const statusOptions = [
    { value: 'DRAFT', label: '🔵 Borrador (DRAFT)' },
    { value: 'ACTIVE', label: '🟢 Activa (ACTIVE)' },
    { value: 'SUSPENDED', label: '🔴 Suspendida (SUSPENDED)' },
  ];

  const colorPresets = [
    '#58CC02', // Duo Green
    '#1CB0F6', // Sky Blue
    '#FFC700', // Sunshine Yellow
    '#A570FF', // Grape Soda
    '#CC348D', // Bubblegum Pink
    '#4B4B4B', // Charcoal
    '#FF4B4B', // Coral Red
    '#FF7A00', // Orange
  ];

  const iconPresets = ['📍', '🗺️', '🚌', '🛣️', '⚡', '🔄', '⭐', '🐝'];

  // Initialize Mapbox GL map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Center on CDMX by default, or the first coordinate if editing
    const centerLng = coordinates.length > 0 ? coordinates[0].lng : -99.1332;
    const centerLat = coordinates.length > 0 ? coordinates[0].lat : 19.4326;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [centerLng, centerLat],
      zoom: coordinates.length > 0 ? 13 : 11,
    });

    mapRef.current = map;

    // Listen to clicks to push coordinate path points
    map.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      setCoordinates((prev) => [...prev, { lat, lng }]);
    });

    map.on('load', () => {
      // Add path geojson source
      map.addSource('route-path', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: coordinates.map((c) => [c.lng, c.lat]),
          },
        },
      });

      // Add polyline draw layer
      map.addLayer({
        id: 'route-path-line',
        type: 'line',
        source: 'route-path',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': color || '#58CC02',
          'line-width': 5,
        },
      });
    });

    return () => {
      map.remove();
    };
  }, []);

  // Update map layer and trace actual driving route when coordinates change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Redraw markers representing sequence pins (clicked by user)
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    coordinates.forEach((coord, idx) => {
      const markerEl = document.createElement('div');
      markerEl.style.width = '16px';
      markerEl.style.height = '16px';
      markerEl.style.borderRadius = '50%';
      markerEl.style.border = '2px solid white';
      markerEl.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
      markerEl.style.display = 'flex';
      markerEl.style.alignItems = 'center';
      markerEl.style.justifyContent = 'center';
      markerEl.style.cursor = 'pointer';

      // Start, End, and middle styling
      if (idx === 0) {
        markerEl.style.backgroundColor = '#58CC02'; // Green start
      } else if (idx === coordinates.length - 1) {
        markerEl.style.backgroundColor = '#FF4B4B'; // Red end
      } else {
        markerEl.style.backgroundColor = '#1CB0F6'; // Sky blue mid
      }

      const marker = new mapboxgl.Marker({ element: markerEl })
        .setLngLat([coord.lng, coord.lat])
        .addTo(map);

      markersRef.current.push(marker);
    });

    const fetchStreetSnappedRoute = async () => {
      if (coordinates.length < 2) {
        // Clear route line
        const source = map.getSource('route-path') as mapboxgl.GeoJSONSource;
        if (source) {
          source.setData({
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: [],
            },
          });
        }
        if (coordinates.length === 0) {
          setPolyline('');
          setTotalDistanceKm(0);
          setEstimatedDurationMin(0);
        }
        return;
      }

      try {
        const coordsString = coordinates.map((c) => `${c.lng},${c.lat}`).join(';');
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordsString}?geometries=geojson&overview=full&access_token=${mapboxgl.accessToken}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];

          // 1. Update Map line geometry with the snapped road segments
          const source = map.getSource('route-path') as mapboxgl.GeoJSONSource;
          if (source) {
            source.setData({
              type: 'Feature',
              properties: {},
              geometry: route.geometry,
            });
          }

          // 2. Encode the detailed path coordinates for database persistence
          const detailedCoords = route.geometry.coordinates.map((c: [number, number]) => ({
            lat: c[1],
            lng: c[0],
          }));
          const encoded = encodePolyline(detailedCoords);
          setPolyline(encoded);

          // 3. Update total distance and duration with real driving metrics
          setTotalDistanceKm(Number((route.distance / 1000).toFixed(2)));
          setEstimatedDurationMin(Math.round(route.duration / 60));
        }
      } catch (err) {
        console.error('Error fetching Mapbox directions:', err);
      }
    };

    fetchStreetSnappedRoute();

    // Auto-fit to bounds of path points
    if (coordinates.length > 1) {
      const lats = coordinates.map((c) => c.lat);
      const lngs = coordinates.map((c) => c.lng);
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      const minLng = Math.min(...lngs);
      const maxLng = Math.max(...lngs);

      if (minLat !== maxLat || minLng !== maxLng) {
        map.fitBounds(
          [
            [minLng, minLat],
            [maxLng, maxLat],
          ],
          { padding: 50, maxZoom: 14, duration: 1000 },
        );
      }
    }
  }, [coordinates]);

  // Update line color when selected branding color changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (map.getLayer('route-path-line')) {
      map.setPaintProperty('route-path-line', 'line-color', color);
    }
  }, [color]);

  const handleClearPoints = () => {
    setCoordinates([]);
    setPolyline('');
    setTotalDistanceKm(0);
    setEstimatedDurationMin(0);
  };

  const handleUndoPoint = () => {
    setCoordinates((prev) => prev.slice(0, -1));
  };

  return (
    <div className={styles.modalOverlay}>
      <Card className={styles.formCard}>
        <div className={styles.header}>
          <h2 className={styles.title}>{isEdit ? 'Editar Ruta' : 'Registrar Nueva Ruta'}</h2>
          <button className={styles.closeBtn} onClick={onClose} type="button">
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className={styles.form}>
          <div className={styles.formRow}>
            <Input
              label="Código de la Ruta"
              type="text"
              placeholder="RT-01"
              value={code}
              onChange={(e) => setCode((e.target as HTMLInputElement).value.toUpperCase())}
              required
              maxLength={15}
            />

            <Input
              label="Nombre Corto (Opcional)"
              type="text"
              placeholder="Ruta Central"
              value={shortName}
              onChange={(e) => setShortName((e.target as HTMLInputElement).value)}
              maxLength={30}
            />
          </div>

          <Input
            label="Nombre Completo"
            type="text"
            placeholder="Ruta Principal Norte - Sur"
            value={name}
            onChange={(e) => setName((e.target as HTMLInputElement).value)}
            required
            maxLength={100}
          />

          <div className={styles.formRow}>
            <Input
              label="Tipo de Ruta"
              type="select"
              value={type}
              onChange={(e) => setType((e.target as HTMLSelectElement).value as RouteType)}
              options={typeOptions}
            />

            <Input
              label="Estado de la Ruta"
              type="select"
              value={status}
              onChange={(e) => setStatus((e.target as HTMLSelectElement).value as RouteStatus)}
              options={statusOptions}
            />
          </div>

          {/* Color Picker & Presets */}
          <div className={styles.colorPickerSection}>
            <label className={styles.colorLabel}>Branding de Ruta (Color)</label>
            <div className={styles.colorRow}>
              <div className={styles.presetsGrid}>
                {colorPresets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    className={`${styles.presetBtn} ${
                      color.toUpperCase() === preset.toUpperCase() ? styles.selectedPreset : ''
                    }`}
                    style={{ backgroundColor: preset }}
                    onClick={() => setColor(preset)}
                    title={preset}
                  />
                ))}
              </div>
              <div className={styles.customColorContainer}>
                <input
                  type="color"
                  className={styles.colorInput}
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
                <input
                  type="text"
                  className={styles.colorTextInput}
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  maxLength={7}
                  placeholder="#58CC02"
                />
              </div>
            </div>
          </div>

          {/* Icon Presets selection */}
          <div className={styles.iconSelection}>
            <label className={styles.iconLabel}>Icono de la Ruta</label>
            <div className={styles.iconPresets}>
              {iconPresets.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  className={`${styles.iconPresetBtn} ${icon === emoji ? styles.selectedIcon : ''}`}
                  onClick={() => setIcon(emoji)}
                >
                  {emoji}
                </button>
              ))}
              <input
                type="text"
                className={styles.customIconInput}
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                maxLength={4}
                placeholder="📍"
                title="Personalizar Emoji"
              />
            </div>
          </div>

          {/* Interactive Mapbox Map Section */}
          <div className={styles.mapWrapper}>
            <label className={styles.colorLabel}>
              🗺️ Trazado del Recorrido (Haz clic en el mapa para marcar los puntos)
            </label>
            <div ref={mapContainerRef} className={styles.mapContainer} />
            <div className={styles.mapControls}>
              {coordinates.length > 0 && (
                <>
                  <button type="button" className={styles.mapBtn} onClick={handleUndoPoint}>
                    ↩️ Deshacer último punto
                  </button>
                  <button type="button" className={styles.mapBtn} onClick={handleClearPoints}>
                    🗑️ Limpiar todo
                  </button>
                </>
              )}
            </div>
          </div>

          <div className={styles.formRow}>
            <Input
              label="Distancia Calculada (km)"
              type="text"
              placeholder="0.0"
              value={totalDistanceKm || ''}
              onChange={(e) => setTotalDistanceKm(Number((e.target as HTMLInputElement).value))}
              required
              readOnly
            />

            <Input
              label="Duración Estimada (min)"
              type="text"
              placeholder="0"
              value={estimatedDurationMin || ''}
              onChange={(e) => setEstimatedDurationMin(Number((e.target as HTMLInputElement).value))}
              required
            />
          </div>

          <div className={styles.iconSelection}>
            <label className={styles.iconLabel}>Polilínea de Recorrido (Autogenerada)</label>
            <input
              type="text"
              className={styles.customIconInput}
              style={{ width: '100%', fontSize: '13px', textAlign: 'left', fontFamily: 'monospace' }}
              placeholder="Autogenerado al marcar puntos..."
              value={polyline}
              readOnly
              required
            />
          </div>

          <div className={styles.actions}>
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className={styles.cancelBtn}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || coordinates.length === 0} className={styles.submitBtn}>
              {isLoading ? 'Guardando...' : 'Aceptar'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default RouteForm;
