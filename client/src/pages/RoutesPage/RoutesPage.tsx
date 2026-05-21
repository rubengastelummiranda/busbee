import React from 'react';
import Sidebar from '../../ui/Sidebar/Sidebar';
import RouteList from '../../features/routes/components/RouteList/RouteList';
import RouteForm from '../../features/routes/components/RouteForm/RouteForm';
import useRoutes from '../../features/routes/hooks/useRoutes';
import styles from './RoutesPage.module.css';

export const RoutesPage: React.FC = () => {
  const {
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
  } = useRoutes();

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

        {isLoading && !isFormOpen && routes.length === 0 ? (
          <div className={styles.loadingSpinnerContainer}>
            <div className={styles.spinner}></div>
            <p>Cargando rutas...</p>
          </div>
        ) : (
          <RouteList
            routes={routes}
            onEdit={openEditForm}
            onDelete={handleDelete}
            onAddClick={openCreateForm}
          />
        )}

        {isFormOpen && (
          <RouteForm
            code={code}
            setCode={setCode}
            name={name}
            setName={setName}
            shortName={shortName}
            setShortName={setShortName}
            type={type}
            setType={setType}
            status={status}
            setStatus={setStatus}
            color={color}
            setColor={setColor}
            icon={icon}
            setIcon={setIcon}
            totalDistanceKm={totalDistanceKm}
            setTotalDistanceKm={setTotalDistanceKm}
            estimatedDurationMin={estimatedDurationMin}
            setEstimatedDurationMin={setEstimatedDurationMin}
            polyline={polyline}
            setPolyline={setPolyline}
            coordinates={coordinates}
            setCoordinates={setCoordinates}
            onSubmit={handleSubmit}
            onClose={closeForm}
            isLoading={isLoading}
            isEdit={!!editingRoute}
          />
        )}
      </main>
    </div>
  );
};

export default RoutesPage;
