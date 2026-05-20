import { useState, useEffect, useCallback } from 'react';
import { vehiclesApi } from '../services/vehiclesApi';
import type { Vehicle } from '../services/vehiclesApi';

export const useVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [plateNumber, setPlateNumber] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [capacity, setCapacity] = useState<number>(0);
  const [status, setStatus] = useState<Vehicle['status']>('OFFLINE');

  const fetchVehicles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await vehiclesApi.listVehicles();
      setVehicles(data);
    } catch (err: any) {
      setError(err.message || 'Error al obtener vehículos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetForm = useCallback(() => {
    setPlateNumber('');
    setDeviceId('');
    setCapacity(0);
    setStatus('OFFLINE');
    setEditingVehicle(null);
  }, []);

  const openCreateForm = useCallback(() => {
    resetForm();
    setIsFormOpen(true);
  }, [resetForm]);

  const openEditForm = useCallback((vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setPlateNumber(vehicle.plateNumber);
    setDeviceId(vehicle.deviceId);
    setCapacity(vehicle.capacity);
    setStatus(vehicle.status);
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
    
    const payload: Partial<Vehicle> = {
      plateNumber,
      deviceId,
      capacity: Number(capacity),
      status,
    };

    try {
      if (editingVehicle) {
        await vehiclesApi.editVehicle(editingVehicle.id, payload);
      } else {
        await vehiclesApi.createVehicle(payload);
      }
      await fetchVehicles();
      closeForm();
    } catch (err: any) {
      setError(err.message || 'Error al guardar el vehículo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Está seguro de eliminar este vehículo?')) {
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await vehiclesApi.deleteVehicle(id);
      await fetchVehicles();
    } catch (err: any) {
      setError(err.message || 'Error al eliminar el vehículo');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  return {
    vehicles,
    isLoading,
    error,
    isFormOpen,
    editingVehicle,
    plateNumber,
    setPlateNumber,
    deviceId,
    setDeviceId,
    capacity,
    setCapacity,
    status,
    setStatus,
    openCreateForm,
    openEditForm,
    closeForm,
    handleSubmit,
    handleDelete,
    fetchVehicles,
  };
};

export default useVehicles;
