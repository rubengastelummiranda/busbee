import React from 'react';
import Card from '../../../../ui/Card/Card';
import Button from '../../../../ui/Button/Button';
import type { Travel, TravelStatus } from '../../services/travelsApi';
import type { Vehicle } from '../../../vehicles/services/vehiclesApi';
import styles from './TravelList.module.css';

interface TravelListProps {
  travels: Travel[];
  vehicles: Vehicle[];
  onEdit: (travel: Travel) => void;
  onDelete: (id: string) => void;
  onAddClick: () => void;
}

export const TravelList: React.FC<TravelListProps> = ({
  travels,
  vehicles,
  onEdit,
  onDelete,
  onAddClick,
}) => {
  const getStatusBadgeClass = (status: TravelStatus) => {
    switch (status) {
      case 'ongoing':
        return styles.ongoing;
      case 'completed':
        return styles.completed;
      case 'cancelled':
        return styles.cancelled;
      case 'scheduled':
      default:
        return styles.scheduled;
    }
  };

  const getStatusLabel = (status: TravelStatus) => {
    switch (status) {
      case 'ongoing':
        return 'En Curso 🛣️';
      case 'completed':
        return 'Completado 🏁';
      case 'cancelled':
        return 'Cancelado ❌';
      case 'scheduled':
      default:
        return 'Programado 📅';
    }
  };

  const formatDatetime = (isoString: string) => {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return date.toLocaleString('es-ES', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <span className={styles.icon}>🛣️</span>
          <div>
            <h1 className={styles.title}>Bitácora de Viajes</h1>
            <p className={styles.subtitle}>Supervisa y programa los viajes del sistema de tránsito</p>
          </div>
        </div>
        <Button onClick={onAddClick} className={styles.addBtn}>
          <span className={styles.addBtnIcon}>🐝</span> Programar Viaje
        </Button>
      </div>

      {travels.length === 0 ? (
        <Card className={styles.emptyCard}>
          <span className={styles.emptyIcon}>📂</span>
          <h3>No hay viajes programados</h3>
          <p>Comienza programando el primer recorrido de autobús para BusBee.</p>
          <Button onClick={onAddClick} className={styles.emptyAddBtn}>
            Programar Viaje
          </Button>
        </Card>
      ) : (
        <div className={styles.grid}>
          {travels.map((travel) => {
            const assignedVehicle = vehicles.find((v) => v.id === travel.vehicleId);

            return (
              <Card key={travel.id} className={styles.travelCard}>
                <div className={styles.cardHeader}>
                  <span className={`${styles.statusBadge} ${getStatusBadgeClass(travel.status)}`}>
                    {getStatusLabel(travel.status)}
                  </span>
                </div>

                <div className={styles.routeContainer}>
                  <div className={styles.routePoint}>
                    <span className={styles.routeDot}>🟢</span>
                    <div className={styles.routeText}>
                      <span className={styles.routeLabel}>Origen</span>
                      <span className={styles.routeName}>{travel.origin}</span>
                    </div>
                  </div>
                  <div className={styles.routeLine}></div>
                  <div className={styles.routePoint}>
                    <span className={styles.routeDot}>🏁</span>
                    <div className={styles.routeText}>
                      <span className={styles.routeLabel}>Destino</span>
                      <span className={styles.routeName}>{travel.destination}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.details}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailIcon}>⏰</span>
                    <div className={styles.detailText}>
                      <span className={styles.detailLabel}>Salida:</span>
                      <span className={styles.detailValue}>{formatDatetime(travel.departureDate)}</span>
                    </div>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailIcon}>🏁</span>
                    <div className={styles.detailText}>
                      <span className={styles.detailLabel}>Llegada:</span>
                      <span className={styles.detailValue}>{formatDatetime(travel.arrivalDate)}</span>
                    </div>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailIcon}>👥</span>
                    <div className={styles.detailText}>
                      <span className={styles.detailLabel}>Pasajeros:</span>
                      <span className={styles.detailValue}>{travel.passengerCount} personas</span>
                    </div>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailIcon}>🚌</span>
                    <div className={styles.detailText}>
                      <span className={styles.detailLabel}>Autobús:</span>
                      <span className={`${styles.detailValue} ${!assignedVehicle ? styles.noVehicle : ''}`}>
                        {assignedVehicle ? assignedVehicle.plateNumber : 'Sin autobús asignado'}
                      </span>
                    </div>
                  </div>
                </div>

                {travel.notes && (
                  <div className={styles.notesContainer}>
                    <span className={styles.notesLabel}>Notas:</span>
                    <p className={styles.notesText}>{travel.notes}</p>
                  </div>
                )}

                <div className={styles.cardActions}>
                  <button className={styles.editBtn} onClick={() => onEdit(travel)} title="Editar viaje">
                    ✏️ Editar
                  </button>
                  <button className={styles.deleteBtn} onClick={() => onDelete(travel.id)} title="Eliminar viaje">
                    🗑️ Eliminar
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TravelList;
