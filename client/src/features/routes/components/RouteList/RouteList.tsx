import React, { useState } from 'react';
import Card from '../../../../ui/Card/Card';
import Button from '../../../../ui/Button/Button';
import type { Route } from '../../services/routesApi';
import styles from './RouteList.module.css';

interface RouteListProps {
  routes: Route[];
  onEdit: (route: Route) => void;
  onDelete: (id: string) => void;
  onAddClick: () => void;
}

export const RouteList: React.FC<RouteListProps> = ({
  routes,
  onEdit,
  onDelete,
  onAddClick,
}) => {
  const [search, setSearch] = useState('');

  const getStatusBadgeClass = (status: Route['status']) => {
    switch (status) {
      case 'ACTIVE':
        return styles.active;
      case 'SUSPENDED':
        return styles.suspended;
      case 'DRAFT':
      default:
        return styles.draft;
    }
  };

  const getStatusLabel = (status: Route['status']) => {
    switch (status) {
      case 'ACTIVE':
        return 'Activa';
      case 'SUSPENDED':
        return 'Suspendida';
      case 'DRAFT':
      default:
        return 'Borrador';
    }
  };

  const getTypeLabel = (type: Route['type']) => {
    switch (type) {
      case 'CIRCULAR':
        return 'Circular 🔄';
      case 'LINEAR':
        return 'Lineal ➡️';
      case 'EXPRESO':
      default:
        return 'Expreso ⚡';
    }
  };

  const filteredRoutes = routes.filter((route) => {
    const term = search.toLowerCase();
    return (
      route.name.toLowerCase().includes(term) ||
      route.code.toLowerCase().includes(term) ||
      (route.shortName && route.shortName.toLowerCase().includes(term))
    );
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <span className={styles.icon}>🗺️</span>
          <div>
            <h1 className={styles.title}>Rutas de Transporte</h1>
            <p className={styles.subtitle}>Gestiona los trayectos, distancias y recorridos de BusBee</p>
          </div>
        </div>
        <Button onClick={onAddClick} className={styles.addBtn}>
          <span className={styles.addBtnIcon}>🐝</span> Registrar Ruta
        </Button>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchBar}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Buscar por código o nombre de ruta..."
            className={styles.searchInput}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filteredRoutes.length === 0 ? (
        <Card className={styles.emptyCard}>
          <span className={styles.emptyIcon}>📭</span>
          <h3>No se encontraron rutas</h3>
          <p>
            {routes.length === 0
              ? 'Comienza registrando tu primera ruta para definir el itinerario de los autobuses.'
              : 'Prueba buscando con otros términos o crea una nueva ruta.'}
          </p>
          {routes.length === 0 && (
            <Button onClick={onAddClick} className={styles.emptyAddBtn}>
              Añadir Ruta
            </Button>
          )}
        </Card>
      ) : (
        <div className={styles.grid}>
          {filteredRoutes.map((route) => (
            <Card key={route.id} className={styles.routeCard}>
              {/* Colored top bar reflecting route's custom color property */}
              <div
                className={styles.colorBar}
                style={{ backgroundColor: route.color || '#58CC02' }}
              />

              <div className={styles.cardHeader}>
                <div className={styles.routeTitleGroup}>
                  <span className={styles.routeIcon}>{route.icon || '📍'}</span>
                  <div className={styles.routeInfo}>
                    <h2 className={styles.routeCode}>{route.code}</h2>
                    <span className={styles.routeName}>
                      {route.name} {route.shortName ? `(${route.shortName})` : ''}
                    </span>
                  </div>
                </div>
                <div className={styles.badgesGroup}>
                  <span className={`${styles.statusBadge} ${getStatusBadgeClass(route.status)}`}>
                    {getStatusLabel(route.status)}
                  </span>
                  <span className={styles.typeBadge}>{getTypeLabel(route.type)}</span>
                </div>
              </div>

              <div className={styles.details}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>
                    <span>🛣️</span> Distancia Total:
                  </span>
                  <span className={styles.detailValue}>{route.totalDistanceKm} km</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>
                    <span>⏱️</span> Duración Estimada:
                  </span>
                  <span className={styles.detailValue}>{route.estimatedDurationMin} min</span>
                </div>
                {route.polyline && (
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>
                      <span>🗺️</span> Trazado GPS:
                    </span>
                    <span className={styles.detailValue} title={route.polyline}>
                      {route.polyline.length > 20
                        ? `${route.polyline.substring(0, 18)}...`
                        : route.polyline}
                    </span>
                  </div>
                )}
              </div>

              <div className={styles.cardActions}>
                <button
                  className={styles.editBtn}
                  onClick={() => onEdit(route)}
                  title="Editar ruta"
                >
                  ✏️ Editar
                </button>
                <button
                  className={styles.deleteBtn}
                  onClick={() => onDelete(route.id)}
                  title="Eliminar ruta"
                >
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

export default RouteList;
