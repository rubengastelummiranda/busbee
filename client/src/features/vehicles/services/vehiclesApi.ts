const API_BASE_URL = 'http://localhost:3000';

export interface Vehicle {
  id: string;
  plateNumber: string;
  deviceId: string;
  capacity: number;
  currentRouteId?: string;
  status: 'ONLINE' | 'OFFLINE' | 'IDLE';
}

export const vehiclesApi = {
  async listVehicles(): Promise<Vehicle[]> {
    const response = await fetch(`${API_BASE_URL}/vehicles/findall`);
    if (!response.ok) {
      throw new Error('Failed to fetch vehicles');
    }
    return response.json();
  },

  async createVehicle(data: Partial<Vehicle>): Promise<Vehicle> {
    const response = await fetch(`${API_BASE_URL}/vehicles/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Failed to create vehicle');
    }
    return result;
  },

  async editVehicle(id: string, data: Partial<Vehicle>): Promise<Vehicle> {
    const response = await fetch(`${API_BASE_URL}/vehicles/edit/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Failed to update vehicle');
    }
    return result;
  },

  async deleteVehicle(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/vehicles/delete/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const result = await response.json().catch(() => ({ message: 'Failed to delete vehicle' }));
      throw new Error(result.message || 'Failed to delete vehicle');
    }
  },
};
