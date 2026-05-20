import React from 'react';
import useRegister from '../../hooks/useRegister';
import { Card } from '../../../../ui/Card/Card';
import { Input } from '../../../../ui/Input/Input';
import { Button } from '../../../../ui/Button/Button';
import { Link } from 'mouter-router';
import styles from './RegisterForm.module.css';

export const RegisterForm: React.FC = () => {
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    type,
    setType,
    error,
    isLoading,
    handleRegister,
  } = useRegister();

  const userTypeOptions = [
    { value: 'APP', label: 'Pasajero / Usuario General' },
    { value: 'CONDUCTOR', label: 'Conductor' },
  ];

  return (
    <Card className={styles.registerCard}>
      <h2 className={styles.title}>Crear Cuenta</h2>
      <p className={styles.subtitle}>Regístrate para comenzar a usar BusBee</p>

      {error && <div className={styles.errorMessage}>{error}</div>}

      <form onSubmit={handleRegister} className={styles.form}>
        <Input
          label="Nombre Completo"
          type="text"
          placeholder="Nombre Apellido"
          value={name}
          onChange={(e) => setName((e.target as HTMLInputElement).value)}
          required
        />

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

        <Input
          label="Tipo de Usuario"
          type="select"
          options={userTypeOptions}
          value={type}
          onChange={(e) => setType((e.target as HTMLSelectElement).value as 'APP' | 'CONDUCTOR')}
        />

        <Button type="submit" disabled={isLoading} className={styles.submitBtn}>
          {isLoading ? 'Registrando...' : 'Registrarse'}
        </Button>
      </form>

      <div className={styles.footer}>
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className={styles.link}>
          Inicia sesión aquí
        </Link>
      </div>
    </Card>
  );
};

export default RegisterForm;
