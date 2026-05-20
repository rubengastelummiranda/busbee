import { useState } from 'react';
import { authApi } from '../services/authApi';
import { navigate } from 'mouter-router';

export const useLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Por favor completa todos los campos.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authApi.login(email, password);
      if (response.success && response.user) {
        // Redirigir según el tipo de usuario
        if (response.user.type === 'CONDUCTOR') {
          navigate('/driving');
        } else {
          navigate('/app');
        }
      } else {
        setError('Ocurrió un error inesperado.');
      }
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    isLoading,
    handleLogin,
  };
};

export default useLogin;
