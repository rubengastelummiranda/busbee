import { useState, useEffect, useCallback } from 'react';
import { travelsApi } from '../services/travelsApi';
import type { Travel, TravelStatus } from '../services/travelsApi';
import { vehiclesApi } from '../../vehicles/services/vehiclesApi';
import type { Vehicle } from '../../vehicles/services/vehiclesApi';

// Helper to format Date for datetime-local input
const toDatetimeLocal = (isoString?: string): string => {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return '';
  const pad = (num: number) => String(num).padStart(2, '0');
  const YYYY = date.getFullYear();
  const MM = pad(date.getMonth() + 1);
  const DD = pad(date.getDate());
  const hh = pad(date.getHours());
  const mm = pad(date.getMinutes());
  return `${YYYY}-${MM}-${DD}T${hh}:${mm}`;
};

export const useTravels = () => {
  const [travels, setTravels] = useState<Travel[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTravel, setEditingTravel] = useState<Travel | null>(null);
  
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [arrivalDate, setArrivalDate] = useState('');
  const [passengerCount, setPassengerCount] = useState<number>(0);
  const [vehicleId, setVehicleId] = useState<string>('');
  const [status, setStatus] = useState<TravelStatus>('scheduled');
  const [notes, setNotes] = useState('');

  const fetchTravelsAndVehicles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [travelsData, vehiclesData] = await Promise.all([
        travelsApi.listTravels(),
        vehiclesApi.listVehicles().catch(() => [] as Vehicle[]), // fail-safe if vehicles api fails
      ]);
      setTravels(travelsData);
      setVehicles(vehiclesData);
    } catch (err: any) {
      setError(err.message || 'Error al obtener viajes');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetForm = useCallback(() => {
    setOrigin('');
    setDestination('');
    setDepartureDate('');
    setArrivalDate('');
    setPassengerCount(0);
    setVehicleId('');
    setStatus('scheduled');
    setNotes('');
    setEditingTravel(null);
  }, []);

  const openCreateForm = useCallback(() => {
    resetForm();
    setIsFormOpen(true);
  }, [resetForm]);

  const openEditForm = useCallback((travel: Travel) => {
    setEditingTravel(travel);
    setOrigin(travel.origin);
    setDestination(travel.destination);
    setDepartureDate(toDatetimeLocal(travel.departureDate));
    setArrivalDate(toDatetimeLocal(travel.arrivalDate));
    setPassengerCount(travel.passengerCount);
    setVehicleId(travel.vehicleId || '');
    setStatus(travel.status);
    setNotes(travel.notes || '');
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

    const payload: Partial<Travel> = {
      origin,
      destination,
      departureDate: new Date(departureDate).toISOString(),
      arrivalDate: new Date(arrivalDate).toISOString(),
      passengerCount: Number(passengerCount),
      vehicleId: vehicleId === '' ? undefined : vehicleId,
      status,
      notes,
    };

    try {
      if (editingTravel) {
        await travelsApi.editTravel(editingTravel.id, payload);
      } else {
        await travelsApi.createTravel(payload);
      }
      await fetchTravelsAndVehicles();
      closeForm();
    } catch (err: any) {
      setError(err.message || 'Error al guardar el viaje');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Está seguro de eliminar este viaje?')) {
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await travelsApi.deleteTravel(id);
      await fetchTravelsAndVehicles();
    } catch (err: any) {
      setError(err.message || 'Error al eliminar el viaje');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTravelsAndVehicles();
  }, [fetchTravelsAndVehicles]);

  return {
    travels,
    vehicles,
    isLoading,
    error,
    isFormOpen,
    editingTravel,
    origin,
    setOrigin,
    destination,
    setDestination,
    departureDate,
    setDepartureDate,
    arrivalDate,
    setArrivalDate,
    passengerCount,
    setPassengerCount,
    vehicleId,
    setVehicleId,
    status,
    setStatus,
    notes,
    setNotes,
    openCreateForm,
    openEditForm,
    closeForm,
    handleSubmit,
    handleDelete,
    fetchTravelsAndVehicles,
  };
};

export default useTravels;
