import React from 'react';
import RegisterForm from '../../features/auth/components/RegisterForm/RegisterForm';
import { Link } from 'mouter-router';
import styles from './RegisterPage.module.css';

export const RegisterPage: React.FC = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.glowBg}></div>
      
      <div className={styles.navHeader}>
        <Link to="/" className={styles.backLink}>
          ← Volver al inicio
        </Link>
      </div>

      <div className={styles.content}>
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
