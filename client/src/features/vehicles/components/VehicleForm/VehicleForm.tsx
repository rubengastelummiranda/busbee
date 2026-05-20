import React from 'react';
import Card from '../../../../ui/Card/Card';
import Input from '../../../../ui/Input/Input';
import Button from '../../../../ui/Button/Button';
import styles from './VehicleForm.module.css';

interface VehicleFormProps {
  plateNumber: string;
  setPlateNumber: (val: string) => void;
  deviceId: string;
  setDeviceId: (val: string) => void;
  capacity: number;
  setCapacity: (val: number) => void;
  status: 'ONLINE' | 'OFFLINE' | 'IDLE';
  setStatus: (val: 'ONLINE' | 'OFFLINE' | 'IDLE') => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  isLoading: boolean;
  isEdit: boolean;
}

export const VehicleForm: React.FC<VehicleFormProps> = ({
  plateNumber,
  setPlateNumber,
  deviceId,
  setDeviceId,
  capacity,
  setCapacity,
  status,
  setStatus,
  onSubmit,
  onClose,
  isLoading,
  isEdit,
}) => {
  const statusOptions = [
    { value: 'OFFLINE', label: '🔴 Fuera de línea (OFFLINE)' },
    { value: 'ONLINE', label: '🟢 En línea (ONLINE)' },
    { value: 'IDLE', label: '🟡 Inactivo (IDLE)' },
  ];

  return (
    <div className={styles.modalOverlay}>
      <Card className={styles.formCard}>
        <div className={styles.header}>
          <h2 className={styles.title}>{isEdit ? 'Editar Vehículo' : 'Registrar Vehículo'}</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
        
        <form onSubmit={onSubmit} className={styles.form}>
          <Input
            label="Número de Placa"
            type="text"
            placeholder="ABC-1234"
            value={plateNumber}
            onChange={(e) => setPlateNumber((e.target as HTMLInputElement).value.toUpperCase())}
            required
            maxLength={10}
          />

          <Input
            label="ID del Dispositivo GPS"
            type="text"
            placeholder="gps-device-123"
            value={deviceId}
            onChange={(e) => setDeviceId((e.target as HTMLInputElement).value)}
            required
          />

          <Input
            label="Capacidad de Pasajeros"
            type="text"
            pattern="[0-9]*"
            placeholder="40"
            value={capacity || ''}
            onChange={(e) => setCapacity(Number((e.target as HTMLInputElement).value))}
            required
          />

          <Input
            label="Estado Inicial"
            type="select"
            value={status}
            onChange={(e) => setStatus((e.target as HTMLSelectElement).value as any)}
            options={statusOptions}
          />

          <div className={styles.actions}>
            <Button type="button" variant="secondary" onClick={onClose} className={styles.cancelBtn}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className={styles.submitBtn}>
              {isLoading ? 'Guardando...' : 'Aceptar'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default VehicleForm;
