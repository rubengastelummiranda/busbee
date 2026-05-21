const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export type RouteType = 'CIRCULAR' | 'LINEAR' | 'EXPRESO';
export type RouteStatus = 'ACTIVE' | 'SUSPENDED' | 'DRAFT';

export interface Route {
  id: string;
  code: string;
  name: string;
  shortName?: string;
  type: RouteType;
  status: RouteStatus;
  color: string;
  icon?: string;
  totalDistanceKm: number;
  estimatedDurationMin: number;
  polyline: string;
  coordinates?: { lat: number; lng: number }[];
}

export const routesApi = {
  async listRoutes(): Promise<Route[]> {
    const response = await fetch(`${API_BASE_URL}/route/findall`);
    if (!response.ok) {
      throw new Error('Error al obtener las rutas');
    }
    return response.json();
  },

  async createRoute(data: Partial<Route>): Promise<Route> {
    const response = await fetch(`${API_BASE_URL}/route/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Error al crear la ruta');
    }
    return result;
  },

  async editRoute(id: string, data: Partial<Route>): Promise<Route> {
    const response = await fetch(`${API_BASE_URL}/route/update/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Error al actualizar la ruta');
    }
    return result;
  },

  async deleteRoute(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/route/delete/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const result = await response.json().catch(() => ({ message: 'Error al eliminar la ruta' }));
      throw new Error(result.message || 'Error al eliminar la ruta');
    }
  },
};
