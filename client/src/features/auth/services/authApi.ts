const API_BASE_URL =  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  type: 'APP' | 'CONDUCTOR';
}

export interface ApiAuthResponse {
  message: string;
  success: boolean;
  user?: ApiUser;
}

export const authApi = {
  async login(email: string, password: string): Promise<ApiAuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    return data;
  },

  async register(name: string, email: string, password: string, type: 'APP' | 'CONDUCTOR'): Promise<ApiAuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password, type }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    return data;
  },
};
