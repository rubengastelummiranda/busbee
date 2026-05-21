import React, { useState, useEffect } from 'react';
import { Card } from '../../ui/Card/Card';
import { Button } from '../../ui/Button/Button';
import { navigate } from 'mouter-router';
import { routesApi } from '../../features/routes/services/routesApi';
import type { Route } from '../../features/routes/services/routesApi';
import PassengerRouteMap from '../../features/routes/components/PassengerRouteMap/PassengerRouteMap';
import styles from './AppDashboardPage.module.css';

export const AppDashboardPage: React.FC = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchAllRoutes = async () => {
      try {
        const data = await routesApi.listRoutes();
        // Filter only active routes for passengers
        const activeRoutes = data.filter((r) => r.status === 'ACTIVE');
        setRoutes(activeRoutes);
        if (activeRoutes.length > 0) {
          setSelectedRoute(activeRoutes[0]); // Select first route by default
        }
      } catch (err: any) {
        setError(err.message || 'Error al conectar con el servidor.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllRoutes();
  }, []);

  const handleLogout = () => {
    navigate('/');
  };

  const filteredRoutes = routes.filter((route) => {
    const query = searchQuery.toLowerCase();
    return (
      route.name.toLowerCase().includes(query) ||
      route.code.toLowerCase().includes(query) ||
      (route.shortName && route.shortName.toLowerCase().includes(query))
    );
  });

  const getRouteTypeEmoji = (type: Route['type']) => {
    switch (type) {
      case 'CIRCULAR':
        return '🔄';
      case 'LINEAR':
        return '➡️';
      case 'EXPRESO':
      default:
        return '⚡';
    }
  };

  return (
    <div className={styles.appLayout}>
      {/* Menu Hamburguesa para Móvil */}
      <button
        className={`${styles.menuToggle} ${isSidebarOpen ? styles.menuToggleOpen : ''}`}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Toggle navigation menu"
      >
        <span className={styles.hamburgerLine}></span>
        <span className={styles.hamburgerLine}></span>
        <span className={styles.hamburgerLine}></span>
      </button>

      {/* Backdrop Layer */}
      {isSidebarOpen && (
        <div className={styles.backdrop} onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar Panel */}
      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.brandHeader}>
          <div className={styles.logoGroup}>
            <span className={styles.logoIcon}>🐝</span>
            <div>
              <h1 className={styles.logoText}>BusBee</h1>
              <p className={styles.logoTagline}>Consola de Pasajero</p>
            </div>
          </div>
        </div>

        <div className={styles.searchSection}>
          <div className={styles.searchInputWrapper}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Buscar ruta..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        {error && (
          <div className={styles.errorAlert}>
            <span>⚠️</span> {error}
          </div>
        )}

        <div className={styles.routesListWrapper}>
          {isLoading ? (
            <div className={styles.loadingSpinnerContainer}>
              <div className={styles.spinner}></div>
              <p>Obteniendo itinerarios...</p>
            </div>
          ) : filteredRoutes.length === 0 ? (
            <div className={styles.noRoutesMessage}>
              <span className={styles.noRoutesIcon}>🗺️</span>
              <p>No hay rutas activas disponibles en este momento.</p>
            </div>
          ) : (
            <div className={styles.routesList}>
              {filteredRoutes.map((route) => {
                const isSelected = selectedRoute?.id === route.id;
                return (
                  <div
                    key={route.id}
                    className={`${styles.routeListItem} ${isSelected ? styles.selectedItem : ''}`}
                    onClick={() => {
                      setSelectedRoute(route);
                      setIsSidebarOpen(false); // Close sidebar drawer on mobile
                    }}
                    style={{ borderLeftColor: route.color || '#58CC02' }}
                  >
                    <div className={styles.routeItemHeader}>
                      <span className={styles.routeItemIcon}>{route.icon || '📍'}</span>
                      <div className={styles.routeItemInfo}>
                        <div className={styles.codeRow}>
                          <span
                            className={styles.routeItemCode}
                            style={{ color: route.color || '#58CC02' }}
                          >
                            {route.code}
                          </span>
                          <span className={styles.routeItemType}>
                            {getRouteTypeEmoji(route.type)} {route.type}
                          </span>
                        </div>
                        <h4 className={styles.routeItemName}>{route.name}</h4>
                      </div>
                    </div>

                    <div className={styles.routeItemMeta}>
                      <span>🛣️ {route.totalDistanceKm} km</span>
                      <span>⏱️ {route.estimatedDurationMin} min</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className={styles.footerSection}>
          <div className={styles.academicBox}>
            <p className={styles.academicTitle}>Proyecto Inovatec 2026</p>
            <p className={styles.academicDetail}>Instituto Tecnológico de Huatabampo</p>
          </div>
          <Button onClick={handleLogout} variant="secondary" className={styles.logoutBtn}>
            🚪 Cerrar Sesión
          </Button>
        </div>
      </aside>

      {/* Map Details Panel */}
      <main className={styles.mainContent}>
        {selectedRoute ? (
          <div className={styles.detailsSplit}>
            <div className={styles.mapArea}>
              <PassengerRouteMap route={selectedRoute} />
            </div>

            <div className={styles.metaArea}>
              <Card className={styles.metaCard}>
                <div className={styles.metaHeader}>
                  <span className={styles.metaIcon}>{selectedRoute.icon || '📍'}</span>
                  <div>
                    <span className={styles.metaBadge} style={{ backgroundColor: selectedRoute.color }}>
                      {selectedRoute.code}
                    </span>
                    <h2 className={styles.metaTitle}>{selectedRoute.name}</h2>
                    {selectedRoute.shortName && (
                      <p className={styles.metaSubtitle}>{selectedRoute.shortName}</p>
                    )}
                  </div>
                </div>

                <div className={styles.metricsGrid}>
                  <div className={styles.metricItem}>
                    <span className={styles.metricLabel}>Distancia de Ruta</span>
                    <span className={styles.metricValue}>🛣️ {selectedRoute.totalDistanceKm} Km</span>
                  </div>

                  <div className={styles.metricItem}>
                    <span className={styles.metricLabel}>Duración de Viaje</span>
                    <span className={styles.metricValue}>⏱️ {selectedRoute.estimatedDurationMin} Min</span>
                  </div>

                  <div className={styles.metricItem}>
                    <span className={styles.metricLabel}>Tipo de Servicio</span>
                    <span className={styles.metricValue}>
                      {getRouteTypeEmoji(selectedRoute.type)} {selectedRoute.type}
                    </span>
                  </div>
                </div>

                <div className={styles.routeInstructions}>
                  <h3>Información al Pasajero</h3>
                  <p>
                    Esta ruta se encuentra <strong>ACTIVA</strong> y operando en horarios regulares.
                    Puedes ver el trayecto trazado en el mapa interactivo. Los conductores asignados
                    siguen exactamente los segmentos marcados en color para optimizar el tiempo de viaje.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <Card className={styles.emptyCard}>
              <span className={styles.emptyIcon}>🚌</span>
              <h2>Consola de Rutas BusBee</h2>
              <p>Selecciona una de las rutas disponibles en la lista lateral para visualizar el trazado en tiempo real sobre el mapa interactivo.</p>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default AppDashboardPage;
