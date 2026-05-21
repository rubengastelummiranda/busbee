import React from 'react';
import { Card } from '../../ui/Card/Card';
import { Button } from '../../ui/Button/Button';
import { navigate } from 'mouter-router';
import styles from './AppDashboardPage.module.css';

export const AppDashboardPage: React.FC = () => {
  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className={styles.container}>
      <Card className={styles.dashboardCard}>
        <span className={styles.icon}>📱</span>
        <h1 className={styles.title}>Pasajero Dashboard</h1>
        <p className={styles.subtitle}>¡Bienvenido a la aplicación BusBee!</p>
        <p className={styles.text}>
          Aquí podrás monitorear rutas, ver paradas de autobús e interactuar con el sistema de tránsito en tiempo real. Esta sección será implementada próximamente.
        </p>
        <Button onClick={handleLogout} variant="secondary" className={styles.logoutBtn}>
          Cerrar Sesión
        </Button>
        <div className={styles.academicNotice}>
          <hr className={styles.divider} />
          <p className={styles.academicTitle}>
            Proyecto para <strong>Inovatec 2026</strong> - Instituto Tecnológico de Huatabampo
          </p>
          <p className={styles.academicSub}>
            Taller de Investigación II | Docente: Guadalupe M. Barreras Alvarez
          </p>
        </div>
      </Card>
    </div>
  );
};

export default AppDashboardPage;
