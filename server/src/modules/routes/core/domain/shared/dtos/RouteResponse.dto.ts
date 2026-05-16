export interface RouteResponse {
  id: string;
  name: string;
  stops: {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
  }[];
}
