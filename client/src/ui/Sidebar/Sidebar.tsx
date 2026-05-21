import React, { useState } from 'react';
import { Link, navigate, getCurrentPath } from 'mouter-router';
import styles from './Sidebar.module.css';

export const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const currentPath = getCurrentPath();

  const handleLogout = () => {
    navigate('/');
  };

  const navItems = [
    { path: '/driving', label: 'Inicio', icon: '🏠' },
    { path: '/driving/vehicles', label: 'Vehículos', icon: '🚌' },
    { path: '/driving/routes', label: 'Rutas', icon: '🗺️' },
    { path: '/driving/travels', label: 'Viajes', icon: '🛣️' },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <div className={styles.mobileBar}>
        <button className={styles.menuToggle} onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? '✕' : '☰'}
        </button>
        <div className={styles.mobileLogo}>
          <span>🐝</span> BusBee
        </div>
      </div>

      {/* Backdrop overlay for mobile drawer */}
      {isOpen && (
        <div className={styles.overlay} onClick={() => setIsOpen(false)}></div>
      )}

      {/* Aside Sidebar */}
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.logoArea}>
          <span className={styles.logoIcon}>🐝</span>
          <span className={styles.logoText}>BusBee</span>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                onClick={() => setIsOpen(false)}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span className={styles.navLabel}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.footer}>
          <div className={styles.academicNotice}>
            <span className={styles.academicIcon}>🎓</span>
            <p className={styles.academicTitle}>Proyecto Inovatec 2026</p>
            <p className={styles.academicText}>Inst. Tecnológico de Huatabampo</p>
            <p className={styles.academicClass}>Taller de Investigación II</p>
            <p className={styles.academicDocente}>Docente: Guadalupe M. Barreras Alvarez</p>
          </div>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <span className={styles.logoutIcon}>🚪</span>
            <span className={styles.logoutLabel}>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
