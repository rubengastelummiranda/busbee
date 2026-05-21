import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { decodePolyline } from '../../hooks/useRoutes';
import type { Route } from '../../services/routesApi';
import styles from './PassengerRouteMap.module.css';

// Public access token for Mapbox GL
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '';

interface PassengerRouteMapProps {
  route: Route;
}

export const PassengerRouteMap: React.FC<PassengerRouteMapProps> = ({ route }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Decode the polyline to get coordinates array
  const coordinates = React.useMemo(() => {
    return route.polyline ? decodePolyline(route.polyline) : [];
  }, [route.polyline]);

  // Initialize Mapbox GL map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Use first coordinate as center or fallback to CDMX
    const centerLng = coordinates.length > 0 ? coordinates[0].lng : -99.1332;
    const centerLat = coordinates.length > 0 ? coordinates[0].lat : 19.4326;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/navigation-dark-v14', // Sleek premium dark map styling
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