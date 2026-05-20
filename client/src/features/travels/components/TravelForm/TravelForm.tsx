import React from 'react';
import Card from '../../../../ui/Card/Card';
import Input from '../../../../ui/Input/Input';
import Button from '../../../../ui/Button/Button';
import type { Vehicle } from '../../../vehicles/services/vehiclesApi';
import type { TravelStatus } from '../../services/travelsApi';
import styles from './TravelForm.module.css';

interface TravelFormProps {
  origin: string;
  setOrigin: (val: string) => void;
  destination: string;
  setDestination: (val: string) => void;
  departureDate: string;
  setDepartureDate: (val: string) => void;
  arrivalDate: string;
  setArrivalDate: (val: string) => void;
  passengerCount: number;
  setPassengerCount: (val: number) => void;
  vehicleId: string;
  setVehicleId: (val: string) => void;
  status: TravelStatus;
  setStatus: (val: TravelStatus) => void;
  notes: string;
  setNotes: (val: string) => void;
  vehicles: Vehicle[];
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  isLoading: boolean;
  isEdit: boolean;
}

export const TravelForm: React.FC<TravelFormProps> = ({
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
  vehicles,
  onSubmit,
  onClose,
  isLoading,
  isEdit,
}) => {
  const statusOptions = [
    { value: 'scheduled', label: '📅 Programado' },
    { value: 'ongoing', label: '🛣️ En Curso' },
    { value: 'completed', label: '🏁 Completado' },
    { value: 'cancelled', label: '❌ Cancelado' },
  ];

  const vehicleOptions = [
    { value: '', label: 'Ninguno (Sin autobús asignado)' },
    ...vehicles.map((v) => ({
      value: v.id,
      label: `🚌 ${v.plateNumber} (Capacidad: ${v.capacity})`,
    })),
  ];

  return (
    <div className={styles.modalOverlay}>
      <Card className={styles.formCard}>
        <div className={styles.header}>
          <h2 className={styles.title}>{isEdit ? 'Editar Viaje' : 'Programar Viaje'}</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <form onSubmit={onSubmit} className={styles.form}>
          <div className={styles.row}>
            <Input
              label="Origen"
              type="text"
              placeholder="Ej. Terminal Norte"
              value={origin}
              onChange={(e) => setOrigin((e.target as HTMLInputElement).value)}
              required
            />
            <Input
              label="Destino"
              type="text"
              placeholder="Ej. Terminal Sur"
              value={destination}
              onChange={(e) => setDestination((e.target as HTMLInputElement).value)}
              required
            />
          </div>

          <div className={styles.row}>
            <Input
              label="Fecha y Hora de Salida"
              type="datetime-local"
              value={departureDate}
              onChange={(e) => setDepartureDate((e.target as HTMLInputElement).value)}
              required
            />
            <Input
              label="Fecha y Hora de Llegada"
              type="datetime-local"
              value={arrivalDate}
              onChange={(e) => setArrivalDate((e.target as HTMLInputElement).value)}
              required
            />
          </div>

          <div className={styles.row}>
            <Input
              label="Cantidad de Pasajeros"
              type="text"
              pattern="[0-9]*"
              placeholder="Ej. 15"
              value={passengerCount || ''}
              onChange={(e) => setPassengerCount(Number((e.target as HTMLInputElement).value))}
              required
            />
            <Input
              label="Autobús Asignado"
              type="select"
              value={vehicleId}
              onChange={(e) => setVehicleId((e.target as HTMLSelectElement).value)}
              options={vehicleOptions}
            />
          </div>

          <Input
            label="Estado del Viaje"
            type="select"
            value={status}
            onChange={(e) => setStatus((e.target as HTMLSelectElement).value as TravelStatus)}
            options={statusOptions}
          />

          <div className={styles.textareaContainer}>
            <label className={styles.textareaLabel}>Notas / Comentarios</label>
            <textarea
              className={styles.textarea}
              placeholder="Detalles adicionales sobre el viaje..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

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

export default TravelForm;
