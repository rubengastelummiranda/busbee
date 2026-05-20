import { Router, Route } from 'mouter-router';
import LandingPage from './pages/LandingPage/LandingPage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import AppDashboardPage from './pages/AppDashboardPage/AppDashboardPage';
import DriverDashboardPage from './pages/DriverDashboardPage/DriverDashboardPage';
import VehiclesPage from './pages/VehiclesPage/VehiclesPage';
import TravelsPage from './pages/TravelsPage/TravelsPage';

export default function App() {
  return (
    <Router>
      <Route path="/" component={LandingPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/app" component={AppDashboardPage} />
      <Route path="/driving" component={DriverDashboardPage} />
      <Route path="/driving/vehicles" component={VehiclesPage} />
      <Route path="/driving/travels" component={TravelsPage} />
    </Router>
  );
}
