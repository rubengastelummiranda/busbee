import React from 'react';
import Sidebar from '../../ui/Sidebar/Sidebar';
import TravelList from '../../features/travels/components/TravelList/TravelList';
import TravelForm from '../../features/travels/components/TravelForm/TravelForm';
import useTravels from '../../features/travels/hooks/useTravels';
import styles from './TravelsPage.module.css';

export const TravelsPage: React.FC = () => {
  const {
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
  } = useTravels();

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

        {isLoading && !isFormOpen && travels.length === 0 ? (
          <div className={styles.loadingSpinnerContainer}>
            <div className={styles.spinner}></div>
            <p>Cargando viajes...</p>
          </div>
        ) : (
          <TravelList
            travels={travels}
            vehicles={vehicles}
            onEdit={openEditForm}
            onDelete={handleDelete}
            onAddClick={openCreateForm}
          />
        )}

        {isFormOpen && (
          <TravelForm
            origin={origin}
            setOrigin={setOrigin}
            destination={destination}
            setDestination={setDestination}
            departureDate={departureDate}
            setDepartureDate={setDepartureDate}
            arrivalDate={arrivalDate}
            setArrivalDate={setArrivalDate}
            passengerCount={passengerCount}
            setPassengerCount={setPassengerCount}
            vehicleId={vehicleId}
            setVehicleId={setVehicleId}
            status={status}
            setStatus={setStatus}
            notes={notes}
            setNotes={setNotes}
            vehicles={vehicles}
            onSubmit={handleSubmit}
            onClose={closeForm}
            isLoading={isLoading}
            isEdit={!!editingTravel}
          />
        )}
      </main>
    </div>
  );
};

export default TravelsPage;
