const API_BASE_URL = 'http://localhost:3000';

export type TravelStatus = 'scheduled' | 'ongoing' | 'completed' | 'cancelled';

export interface Travel {
  id: string;
  origin: string;
  destination: string;
  departureDate: string; // ISO String
  arrivalDate: string;   // ISO String
  passengerCount: number;
  vehicleId?: string;
  status: TravelStatus;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const travelsApi = {
  async listTravels(): Promise<Travel[]> {
    const response = await fetch(`${API_BASE_URL}/travel/findall`);
    if (!response.ok) {
      throw new Error('Failed to fetch travels');
    }
    return response.json();
  },

  async createTravel(data: Partial<Travel>): Promise<Travel> {
    const response = await fetch(`${API_BASE_URL}/travel/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Failed to create travel');
    }
    return result;
  },

  async editTravel(id: string, data: Partial<Travel>): Promise<Travel> {
    const response = await fetch(`${API_BASE_URL}/travel/update/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Failed to update travel');
    }
    return result;
  },

  async deleteTravel(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/travel/delete/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const result = await response.json().catch(() => ({ message: 'Failed to delete travel' }));
      throw new Error(result.message || 'Failed to delete travel');
    }
  },
};
