import React from 'react';
import Sidebar from '../../ui/Sidebar/Sidebar';
import VehicleList from '../../features/vehicles/components/VehicleList/VehicleList';
import VehicleForm from '../../features/vehicles/components/VehicleForm/VehicleForm';
import useVehicles from '../../features/vehicles/hooks/useVehicles';
import styles from './VehiclesPage.module.css';

export const VehiclesPage: React.FC = () => {
  const {
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
  } = useVehicles();

  return (
    <div className={styles.pageLayout}>
      <Sidebar />
      <main className={styles.mainContent}>
        {error && (
          <div className={styles.errorBanner}>
            <span className={styles.errorIcon}>⚠️</span>
            <span className={styles.errorMessage}>{error}</span>
          </div>
        )}

        {isLoading && !isFormOpen && vehicles.length === 0 ? (
          <div className={styles.loadingSpinnerContainer}>
            <div className={styles.spinner}></div>
            <p>Cargando vehículos...</p>
          </div>
        ) : (
          <VehicleList
            vehicles={vehicles}
            onEdit={openEditForm}
            onDelete={handleDelete}
            onAddClick={openCreateForm}
          />
        )}

        {isFormOpen && (
          <VehicleForm
            plateNumber={plateNumber}
            setPlateNumber={setPlateNumber}
            deviceId={deviceId}
            setDeviceId={setDeviceId}
            capacity={capacity}
            setCapacity={setCapacity}
            status={status}
            setStatus={setStatus}
            onSubmit={handleSubmit}
            onClose={closeForm}
            isLoading={isLoading}
            isEdit={!!editingVehicle}
          />
        )}
      </main>
    </div>
  );
};

export default VehiclesPage;
