import React from 'react';
import { Link } from 'mouter-router';
import { Card } from '../../ui/Card/Card';
import { Button } from '../../ui/Button/Button';
import styles from './LandingPage.module.css';

export const LandingPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.glowBg}></div>
      
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <span className={styles.logoIcon}>🐝</span>
          <span className={styles.logoText}>BusBee</span>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.heroSection}>
          <h1 className={styles.heroTitle}>
            Tu transporte, <span className={styles.gradientText}>simplificado</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Conectando pasajeros y conductores en tiempo real. Monitorea rutas, planifica paradas y viaja sin contratiempos.
          </p>
        </div>

        <Card className={styles.welcomeCard}>
          <h2 className={styles.cardTitle}>Comienza hoy</h2>
          <p className={styles.cardDesc}>
            Inicia sesión si ya tienes cuenta, o crea una nueva como pasajero o conductor.
          </p>

          <div className={styles.actions}>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Button variant="primary" className={styles.landingBtn}>
                Iniciar Sesión
              </Button>
            </Link>
            
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <Button variant="secondary" className={styles.landingBtn}>
                Crear Cuenta
              </Button>
            </Link>
          </div>
        </Card>

        <section className={styles.features}>
          <div className={styles.featureCard}>
            <span className={styles.featureIcon}>📱</span>
            <h3>Para Pasajeros</h3>
            <p>Monitorea camiones en vivo, calcula tiempos de llegada y visualiza las rutas de transporte.</p>
          </div>
          <div className={styles.featureCard}>
            <span className={styles.featureIcon}>🛣️</span>
            <h3>Para Conductores</h3>
            <p>Comparte tu ubicación GPS en tiempo real y gestiona tus horarios de ruta cómodamente.</p>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p className={styles.academicDisclaimer}>
            Esta aplicación es desarrollada para presentarse en la edición 2026 del <strong>Inovatec</strong> del <strong>Instituto Tecnológico de Huatabampo</strong>, realizada en la materia <em>Taller de Investigación II</em> impartida por la docente <strong>Guadalupe María Barreras Álvarez</strong>.
          </p>
          <p className={styles.copyright}>&copy; {new Date().getFullYear()} BusBee Transit System. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
