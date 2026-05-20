import React from 'react';
import Card from '../../../../ui/Card/Card';
import Button from '../../../../ui/Button/Button';
import type { Vehicle } from '../../services/vehiclesApi';
import styles from './VehicleList.module.css';

interface VehicleListProps {
  vehicles: Vehicle[];
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (id: string) => void;
  onAddClick: () => void;
}

export const VehicleList: React.FC<VehicleListProps> = ({
  vehicles,
  onEdit,
  onDelete,
  onAddClick,
}) => {
  const getStatusBadgeClass = (status: Vehicle['status']) => {
    switch (status) {
      case 'ONLINE':
        return styles.online;
      case 'IDLE':
        return styles.idle;
      case 'OFFLINE':
      default:
        return styles.offline;
    }
  };

  const getStatusLabel = (status: Vehicle['status']) => {
    switch (status) {
      case 'ONLINE':
        return 'En Línea';
      case 'IDLE':
        return 'Inactivo';
      case 'OFFLINE':
      default:
        return 'Fuera de Línea';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <span className={styles.icon}>🚌</span>
          <div>
            <h1 className={styles.title}>Flota de Vehículos</h1>
            <p className={styles.subtitle}>Gestiona los autobuses y dispositivos GPS registrados</p>
          </div>
        </div>
        <Button onClick={onAddClick} className={styles.addBtn}>
          <span className={styles.addBtnIcon}>🐝</span> Registrar Autobús
        </Button>
      </div>

      {vehicles.length === 0 ? (
        <Card className={styles.emptyCard}>
          <span className={styles.emptyIcon}>📭</span>
          <h3>No hay vehículos registrados</h3>
          <p>Comienza agregando tu primer autobús a la flota de BusBee.</p>
          <Button onClick={onAddClick} className={styles.emptyAddBtn}>
            Añadir Autobús
          </Button>
        </Card>
      ) : (
        <div className={styles.grid}>
          {vehicles.map((vehicle) => (
            <Card key={vehicle.id} className={styles.vehicleCard}>
              <div className={styles.cardHeader}>
                <div className={styles.plateContainer}>
                  <span className={styles.plateIcon}>🎫</span>
                  <span className={styles.plateNumber}>{vehicle.plateNumber}</span>
                </div>
                <span className={`${styles.statusBadge} ${getStatusBadgeClass(vehicle.status)}`}>
                  {getStatusLabel(vehicle.status)}
                </span>
              </div>

              <div className={styles.details}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Dispositivo GPS:</span>
                  <span className={styles.detailValue}>{vehicle.deviceId}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Capacidad:</span>
                  <span className={styles.detailValue}>{vehicle.capacity} pasajeros</span>
                </div>
              </div>

              <div className={styles.cardActions}>
                <button className={styles.editBtn} onClick={() => onEdit(vehicle)} title="Editar vehículo">
                  ✏️ Editar
                </button>
                <button className={styles.deleteBtn} onClick={() => onDelete(vehicle.id)} title="Eliminar vehículo">
                  🗑️ Eliminar
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default VehicleList;
