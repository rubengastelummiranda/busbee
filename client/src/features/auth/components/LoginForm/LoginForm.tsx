import React from 'react';
import useLogin from '../../hooks/useLogin';
import { Card } from '../../../../ui/Card/Card';
import { Input } from '../../../../ui/Input/Input';
import { Button } from '../../../../ui/Button/Button';
import { Link } from 'mouter-router';
import styles from './LoginForm.module.css';

export const LoginForm: React.FC = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    isLoading,
    handleLogin,
  } = useLogin();

  return (
    <Card className={styles.loginCard}>
      <h2 className={styles.title}>Iniciar Sesión</h2>
      <p className={styles.subtitle}>Ingresa tus credenciales para continuar</p>

      {error && <div className={styles.errorMessage}>{error}</div>}

      <form onSubmit={handleLogin} className={styles.form}>
        <Input
          label="Correo Electrónico"
          type="email"
          placeholder="nombre@ejemplo.com"
          value={email}
          onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
          required
        />

        <Input
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword((e.target as HTMLInputElement).value)}
          required
        />

        <Button type="submit" disabled={isLoading} className={styles.submitBtn}>
          {isLoading ? 'Iniciando sesión...' : 'Aceptar'}
        </Button>
      </form>

      <div className={styles.footer}>
        ¿No tienes cuenta?{' '}
        <Link to="/register" className={styles.link}>
          Regístrate aquí
        </Link>
      </div>
    </Card>
  );
};

export default LoginForm;
