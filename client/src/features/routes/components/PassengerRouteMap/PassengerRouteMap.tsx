import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { decodePolyline } from '../../hooks/useRoutes';
import type { Route } from '../../services/routesApi';
import type { ActiveBus } from '../../../location/services/locationService';
import styles from './PassengerRouteMap.module.css';

// Public access token for Mapbox GL
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '';

interface PassengerRouteMapProps {
  route: Route;
  activeBuses?: ActiveBus[];
}

export const PassengerRouteMap: React.FC<PassengerRouteMapProps> = ({ route, activeBuses = [] }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const busMarkersRef = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const [mapLoaded, setMapLoaded] = useState(false);

  // Decode coordinates, using route.coordinates first, then route.polyline as fallback
  const coordinates = React.useMemo(() => {
    if (route.coordinates && Array.isArray(route.coordinates) && route.coordinates.length > 0) {
      return route.coordinates.map((c: any) => {
        if (Array.isArray(c)) {
          const lng = typeof c[0] === 'number' ? c[0] : 0;
          const lat = typeof c[1] === 'number' ? c[1] : 0;
          return { lat, lng };
        }
        if (c && typeof c === 'object') {
          const lat = typeof c.lat === 'number' ? c.lat : (typeof c.latitude === 'number' ? c.latitude : 0);
          const lng = typeof c.lng === 'number' ? c.lng : (typeof c.longitude === 'number' ? c.longitude : (typeof c.lon === 'number' ? c.lon : 0));
          return { lat, lng };
        }
        return { lat: 0, lng: 0 };
      }).filter(c => c.lat !== 0 || c.lng !== 0);
    }
    return route.polyline ? decodePolyline(route.polyline) : [];
  }, [route.coordinates, route.polyline]);

  const currentRouteBuses = React.useMemo(() => {
    return activeBuses.filter((bus) => bus.routeId === route.id);
  }, [activeBuses, route.id]);

  // Manage active bus markers on the map
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    const activeVehicleIds = new Set(currentRouteBuses.map((b) => b.vehicleId));

    // Remove markers for buses that are no longer active on this route
    busMarkersRef.current.forEach((marker, vehicleId) => {
      if (!activeVehicleIds.has(vehicleId)) {
        marker.remove();
        busMarkersRef.current.delete(vehicleId);
      }
    });

    // Create or update markers for active buses
    currentRouteBuses.forEach((bus) => {
      const existingMarker = busMarkersRef.current.get(bus.vehicleId);

      if (existingMarker) {
        // Update marker position
        existingMarker.setLngLat([bus.lng, bus.lat]);
        // Update popup content with new details
        const popup = existingMarker.getPopup();
        if (popup) {
          popup.setHTML(`<div class="${styles.busPopupContent}">
            <strong>Autobús Activo 🚌</strong>
            <p>Unidad: ${bus.vehicleId}</p>
            <p style="font-size: 10px; margin-top: 4px; opacity: 0.7;">Último reporte: ${new Date(bus.updatedAt).toLocaleTimeString()}</p>
          </div>`);
        }
      } else {
        // Create new marker DOM element
        const markerEl = document.createElement('div');
        markerEl.className = styles.busMarker;

        const pulseDot = document.createElement('div');
        pulseDot.className = styles.busPulseDot;
        markerEl.appendChild(pulseDot);

        const busIcon = document.createElement('span');
        busIcon.className = styles.busIcon;
        busIcon.innerText = '🚌';
        markerEl.appendChild(busIcon);

        const popup = new mapboxgl.Popup({ offset: 25, closeButton: false })
          .setHTML(`<div class="${styles.busPopupContent}">
            <strong>Autobús Activo 🚌</strong>
            <p>Unidad: ${bus.vehicleId}</p>
            <p style="font-size: 10px; margin-top: 4px; opacity: 0.7;">Último reporte: ${new Date(bus.updatedAt).toLocaleTimeString()}</p>
          </div>`);

        const newMarker = new mapboxgl.Marker({ element: markerEl })
          .setLngLat([bus.lng, bus.lat])
          .setPopup(popup)
          .addTo(map);

        busMarkersRef.current.set(bus.vehicleId, newMarker);
      }
    });
  }, [currentRouteBuses, mapLoaded]);

  // Clean up all bus markers on unmount
  useEffect(() => {
    return () => {
      busMarkersRef.current.forEach((marker) => marker.remove());
      busMarkersRef.current.clear();
    };
  }, []);

  // Initialize Mapbox GL map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Use first coordinate as center or fallback to CDMX
    const centerLng = coordinates.length > 0 ? coordinates[0].lng : -99.1332;
    const centerLat = coordinates.length > 0 ? coordinates[0].lat : 19.4326;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11', // Sleek premium dark map styling
      center: [centerLng, centerLat],
      zoom: 13,
    });

    mapRef.current = map;

    map.on('load', () => {
      setMapLoaded(true);

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

      // Add polyline layer
      map.addLayer({
        id: 'route-path-line',
        type: 'line',
        source: 'route-path',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': route.color || '#58CC02',
          'line-width': 6,
          'line-opacity': 0.85,
        },
      });

      // Add a subtle outer glow/casing layer to make the path pop
      map.addLayer({
        id: 'route-path-casing',
        type: 'line',
        source: 'route-path',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#FFFFFF',
          'line-width': 10,
          'line-opacity': 0.15,
        },
      }, 'route-path-line'); // Place it under the main line

      // Zoom to fit bounds of the route coordinates
      if (coordinates.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        coordinates.forEach((c) => bounds.extend([c.lng, c.lat]));
        map.fitBounds(bounds, { padding: 50, duration: 1200 });
      }
    });

    return () => {
      map.remove();
    };
  }, []);

  // Update map path and markers when the route changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear old markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Redraw markers representing start (Origin) and end (Destination)
    if (coordinates.length > 0) {
      coordinates.forEach((coord, idx) => {
        // Draw only start, end, and major stops (for now first and last)
        if (idx !== 0 && idx !== coordinates.length - 1) return;

        const isStart = idx === 0;

        const markerEl = document.createElement('div');
        markerEl.className = styles.customMarker;
        markerEl.style.backgroundColor = isStart ? '#58CC02' : '#FF4B4B';
        
        const innerDot = document.createElement('div');
        innerDot.className = styles.markerInner;
        innerDot.innerText = isStart ? 'A' : 'B';
        markerEl.appendChild(innerDot);

        // Tooltip popup
        const popup = new mapboxgl.Popup({ offset: 25, closeButton: false })
          .setHTML(`<div class="${styles.popupContent}">
            <strong>${isStart ? 'Origen' : 'Destino'}</strong>
            <p>${route.name}</p>
          </div>`);

        const marker = new mapboxgl.Marker({ element: markerEl })
          .setLngLat([coord.lng, coord.lat])
          .setPopup(popup)
          .addTo(map);

        markersRef.current.push(marker);
      });
    }

    // Update GeoJSON source data and line color if map is already loaded
    if (mapLoaded) {
      const source = map.getSource('route-path') as mapboxgl.GeoJSONSource;
      if (source) {
        source.setData({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: coordinates.map((c) => [c.lng, c.lat]),
          },
        });
      }

      // Update line color
      if (map.getLayer('route-path-line')) {
        map.setPaintProperty('route-path-line', 'line-color', route.color || '#58CC02');
      }

      // Fit bounds
      if (coordinates.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        coordinates.forEach((c) => bounds.extend([c.lng, c.lat]));
        map.fitBounds(bounds, { padding: 60, duration: 1000 });
      }
    }
  }, [route, mapLoaded, coordinates]);

  return (
    <div className={styles.mapWrapper}>
      <div ref={mapContainerRef} className={styles.mapContainer} />
      <div className={styles.routeHeaderOverlay}>
        <span className={styles.badge} style={{ borderColor: route.color }}>
          {route.code}
        </span>
        <div className={styles.routeDetailsText}>
          <h4>{route.name}</h4>
          <p>{route.shortName ? `${route.shortName} • ` : ''}{route.type}</p>
        </div>
      </div>
    </div>
  );
};

export default PassengerRouteMap;