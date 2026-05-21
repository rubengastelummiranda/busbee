                                                                        
    import { Router } from 'mouter-router';                                  
    import LandingPage from './pages/LandingPage/LandingPage';               
    import LoginPage from './pages/LoginPage/LoginPage';                     
    import RegisterPage from './pages/RegisterPage/RegisterPage';            
    import AppDashboardPage from './pages/AppDashboardPage/AppDashboardPage';
    import DriverDashboardPage from './pages/DriverDashboardPage/DriverDashboardPage';                           
    import VehiclesPage from './pages/VehiclesPage/VehiclesPage';            
    import TravelsPage from './pages/TravelsPage/TravelsPage';               
    import RoutesPage from './pages/RoutesPage/RoutesPage';
                                                                             
    const routes = [                                                         
      { path: '/', component: LandingPage },                                 
      { path: '/login', component: LoginPage },                              
      { path: '/register', component: RegisterPage },                        
      { path: '/app', component: AppDashboardPage },                         
      { path: '/driving', component: DriverDashboardPage },
      { path: '/driving/vehicles', component: VehiclesPage },
      { path: '/driving/routes', component: RoutesPage },
      { path: '/driving/travels', component: TravelsPage },
    ];
  
    export default function App() {
      return <Router routes={routes} />;
    }
