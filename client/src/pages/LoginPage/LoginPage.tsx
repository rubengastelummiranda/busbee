import LoginForm from '../../features/auth/components/LoginForm/LoginForm';
import { Link } from 'mouter-router';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.glowBg}></div>
      
      <div className={styles.navHeader}>
        <Link to="/" className={styles.backLink}>
          ← Volver al inicio
        </Link>
      </div>

      <div className={styles.content}>
        <LoginForm />
      </div>
    </div>
  );
};

