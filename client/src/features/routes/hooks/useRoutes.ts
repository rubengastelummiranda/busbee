import React, { useState, useEffect, useCallback } from 'react';
import { routesApi } from '../services/routesApi';
import type { Route, RouteType, RouteStatus } from '../services/routesApi';

// Helper to encode coordinates to Google Polyline format
export const encodePolyline = (coords: { lat: number; lng: number }[]) => {
  let result = '';
  let prevLat = 0;
  let prevLng = 0;

  const encodeNumber = (num: number) => {
    let val = num < 0 ? ~(num << 1) : num << 1;
    let out = '';
    while (val >= 0x20) {
      out += String.fromCharCode((0x20 | (val & 0x1f)) + 63);
      val >>= 5;
    }
    out += String.fromCharCode(val + 63);
    return out;
  };

  for (const point of coords) {
    const lat = Math.round(point.lat * 1e5);
    const lng = Math.round(point.lng * 1e5);

    result += encodeNumber(lat - prevLat);
    result += encodeNumber(lng - prevLng);

    prevLat = lat;
    prevLng = lng;
  }
  return result;
};

// Helper to decode Google Polyline format into coordinates
export const decodePolyline = (encoded: string): { lat: number; lng: number }[] => {
  const points: { lat: number; lng: number }[] = [];
  let index = 0;
  const len = encoded.length;
  let lat = 0;
  let lng = 0;

  while (index < len) {
    let b;
    let shift = 0;
    let result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    points.push({
      lat: lat / 1e5,
      lng: lng / 1e5,
    });
  }

  return points;
};

export const useRoutes = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [type, setType] = useState<RouteType>('LINEAR');
  const [status, setStatus] = useState<RouteStatus>('DRAFT');
  const [color, setColor] = useState('#58CC02'); // Default Duo Green
  const [icon, setIcon] = useState('📍');
  const [totalDistanceKm, setTotalDistanceKm] = useState<number>(0);
  const [estimatedDurationMin, setEstimatedDurationMin] = useState<number>(0);
  const [polyline, setPolyline] = useState('');
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }[]>([]);

  const fetchRoutes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await routesApi.listRoutes();
      setRoutes(data);
    } catch (err: any) {
      setError(err.message || 'Error al obtener rutas');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetForm = useCallback(() => {
    setCode('');
    setName('');
    setShortName('');
    setType('LINEAR');
    setStatus('DRAFT');
    setColor('#58CC02');
    setIcon('📍');
    setTotalDistanceKm(0);
    setEstimatedDurationMin(0);
    setPolyline('');
    setCoordinates([]);
    setEditingRoute(null);
  }, []);

  const openCreateForm = useCallback(() => {
    resetForm();
    setIsFormOpen(true);
  }, [resetForm]);

  const openEditForm = useCallback((route: Route) => {
    setEditingRoute(route);
    setCode(route.code);
    setName(route.name);
    setShortName(route.shortName || '');
    setType(route.type);
    setStatus(route.status);
    setColor(route.color);
    setIcon(route.icon || '📍');
    setTotalDistanceKm(route.totalDistanceKm);
    setEstimatedDurationMin(route.estimatedDurationMin);
    setPolyline(route.polyline);
    
    // Restore coordinates from polyline if not present directly
    const coords = route.coordinates && route.coordinates.length > 0 
      ? route.coordinates 
      : (route.polyline ? decodePolyline(route.polyline) : []);
    setCoordinates(coords);
    
    setIsFormOpen(true);
  }, []);

  const closeForm = useCallback(() => {
    setIsFormOpen(false);
    resetForm();
  }, [resetForm]);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validate color code
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexRegex.test(color)) {
      setError('Formato de color hexadecimal inválido (ej: #58CC02)');
      setIsLoading(false);
      return;
    }

    const payload: Partial<Route> = {
      code: code.trim().toUpperCase(),
      name: name.trim(),
      shortName: shortName.trim() || undefined,
      type,
      status,
      color: color.toUpperCase(),
      icon: icon.trim() || undefined,
      totalDistanceKm: Number(totalDistanceKm),
      estimatedDurationMin: Number(estimatedDurationMin),
      polyline: polyline.trim(),
      coordinates,
    };

    try {
      if (editingRoute) {
        await routesApi.editRoute(editingRoute.id, payload);
      } else {
        await routesApi.createRoute(payload);
      }
      await fetchRoutes();
      closeForm();
    } catch (err: any) {
      setError(err.message || 'Error al guardar la ruta');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Está seguro de eliminar esta ruta?')) {
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await routesApi.deleteRoute(id);
      await fetchRoutes();
    } catch (err: any) {
      setError(err.message || 'Error al eliminar la ruta');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, [fetchRoutes]);

  return {
    routes,
    isLoading,
    error,
    isFormOpen,
    editingRoute,
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
    openCreateForm,
    openEditForm,
    closeForm,
    handleSubmit,
    handleDelete,
    fetchRoutes,
  };
};

export default useRoutes;
