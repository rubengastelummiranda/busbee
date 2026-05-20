import React, { useState, useEffect } from 'react';
import Card from '../../ui/Card/Card';
import Button from '../../ui/Button/Button';
import Sidebar from '../../ui/Sidebar/Sidebar';
import { navigate, Link } from 'mouter-router';
import { vehiclesApi } from '../../features/vehicles/services/vehiclesApi';
import type { Vehicle } from '../../features/vehicles/services/vehiclesApi';
import { travelsApi } from '../../features/travels/services/travelsApi';
import type { Travel } from '../../features/travels/services/travelsApi';
import styles from './DriverDashboardPage.module.css';

export const DriverDashboardPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [travels, setTravels] = useState<Travel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [vehiclesData, travelsData] = await Promise.all([
          vehiclesApi.listVehicles().catch(() => []),
          travelsApi.listTravels().catch(() => []),
        ]);
        setVehicles(vehiclesData);
        setTravels(travelsData);
      } catch (err) {
        console.error('Error loading dashboard data', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const totalVehicles = vehicles.length;
  const totalTravels = travels.length;
  const activeTravels = travels.filter((t) => t.status === 'ongoing').length;
  const scheduledTravels = travels.filter((t) => t.status === 'scheduled').length;

  const formatTime = (isoString: string) => {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  // Get next 3 upcoming travels
  const upcomingTravels = travels
    .filter((t) => t.status === 'scheduled')
    .slice(0, 3);

  return (
    <div className={styles.pageLayout}>
      <Sidebar />
      <main className={styles.mainContent}>
        {/* Welcome Area */}
        <div className={styles.welcomeBanner}>
          <div className={styles.welcomeInfo}>
            <span className={styles.brandBadge}>🐝 BusBee Console</span>
            <h1 className={styles.welcomeTitle}>¡Hola, Conductor!</h1>
            <p className={styles.welcomeSubtitle}>
              Monitorea el estado de la flota y programa viajes en tiempo real de manera ágil.
            </p>
          </div>
          <span className={styles.beeIllustration}>🐝</span>
        </div>

        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          <Card className={styles.statCard}>
            <div className={styles.statIconContainer} style={{ background: 'rgba(255, 185, 0, 0.12)' }}>
              <span className={styles.statIcon}>🚌</span>
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>Flota Registrada</span>
              <span className={styles.statValue}>{isLoading ? '...' : totalVehicles}</span>
            </div>
          </Card>

          <Card className={styles.statCard}>
            <div className={styles.statIconContainer} style={{ background: 'rgba(34, 197, 94, 0.12)' }}>
              <span className={styles.statIcon}>🛣️</span>
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>Viajes Totales</span>
              <span className={styles.statValue}>{isLoading ? '...' : totalTravels}</span>
            </div>
          </Card>

          <Card className={styles.statCard}>
            <div className={styles.statIconContainer} style={{ background: 'rgba(59, 130, 246, 0.12)' }}>
              <span className={styles.statIcon}>⚡</span>
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>Viajes en Curso</span>
              <span className={styles.statValue}>{isLoading ? '...' : activeTravels}</span>
            </div>
          </Card>

          <Card className={styles.statCard}>
            <div className={styles.statIconContainer} style={{ background: 'rgba(168, 85, 247, 0.12)' }}>
              <span className={styles.statIcon}>📅</span>
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>Programados</span>
              <span className={styles.statValue}>{isLoading ? '...' : scheduledTravels}</span>
            </div>
          </Card>
        </div>

        {/* Dashboard Sections */}
        <div className={styles.dashboardSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Próximas Salidas</h2>
            <Link to="/driving/travels" className={styles.sectionLink}>
              Ver toda la bitácora ➜
            </Link>
          </div>

          {isLoading ? (
            <div className={styles.sectionLoading}>
              <div className={styles.spinner}></div>
            </div>
          ) : upcomingTravels.length === 0 ? (
            <Card className={styles.emptyAlert}>
              <span className={styles.emptyAlertIcon}>📭</span>
              <div>
                <h4>No hay salidas programadas próximamente</h4>
                <p>Crea nuevos recorridos para tus autobuses en la bitácora de viajes.</p>
              </div>
              <Button onClick={() => navigate('/driving/travels')} className={styles.emptyAlertBtn}>
                Programar ahora
              </Button>
            </Card>
          ) : (
            <div className={styles.upcomingList}>
              {upcomingTravels.map((travel) => (
                <Card key={travel.id} className={styles.upcomingCard}>
                  <div className={styles.upcomingTime}>
                    <span className={styles.timeLabel}>Salida</span>
                    <span className={styles.timeValue}>{formatTime(travel.departureDate)}</span>
                  </div>
                  <div className={styles.upcomingPath}>
                    <span className={styles.pathPoint}>{travel.origin}</span>
                    <span className={styles.pathArrow}>➔</span>
                    <span className={styles.pathPoint}>{travel.destination}</span>
                  </div>
                  <span className={styles.upcomingBadge}>
                    👥 {travel.passengerCount} pas.
                  </span>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className={styles.dashboardSection}>
          <h2 className={styles.sectionTitle}>Acceso Rápido</h2>
          <div className={styles.actionCards}>
            <Card className={styles.actionCard} onClick={() => navigate('/driving/vehicles')}>
              <span className={styles.actionCardIcon}>🚌</span>
              <h3>Flota de Autobuses</h3>
              <p>Registra, visualiza y gestiona todos los autobuses disponibles.</p>
              <span className={styles.actionCardBtn}>Ir a Flota ➜</span>
            </Card>

            <Card className={styles.actionCard} onClick={() => navigate('/driving/travels')}>
              <span className={styles.actionCardIcon}>🛣️</span>
              <h3>Bitácora de Viajes</h3>
              <p>Planifica recorridos, asigna conductores e inicia o completa viajes.</p>
              <span className={styles.actionCardBtn}>Ir a Viajes ➜</span>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DriverDashboardPage;
