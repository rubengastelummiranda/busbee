import { useState } from 'react';
import { authApi } from '../services/authApi';
import { navigate } from 'mouter-router';

export const useRegister = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [type, setType] = useState<'APP' | 'CONDUCTOR'>('APP');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password) {
      setError('Por favor completa todos los campos.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authApi.register(name, email, password, type);
      if (response.success) {
        // Redirigir a login tras registro exitoso
        navigate('/login');
      } else {
        setError('Ocurrió un error inesperado.');
      }
    } catch (err: any) {
      setError(err.message || 'Error al registrarse.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
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
  };
};

export default useRegister;
