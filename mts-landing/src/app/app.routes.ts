import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { VehiclesComponent } from './pages/vehicles/vehicles.component';
import { VehicleDetailComponent } from './pages/vehicle-detail/vehicle-detail.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AboutComponent } from './pages/about/about.component';
import { ServicesComponent } from './pages/services/services.component';
import { ContactComponent } from './pages/contact/contact.component';
import { PlaceholderComponent } from './pages/placeholder.component';
import { BookingComponent } from './pages/booking/booking.component';
import { authGuard } from './guards/auth.guard';
import { AdminVehiclesComponent } from './pages/admin-vehicles/admin-vehicles.component';
import { AdminOverviewComponent } from './pages/admin-overview/admin-overview.component';
import { adminGuard } from './guards/auth.guard.spec';
import { AdminLayoutComponent } from './pages/admin-layout/admin-layout.component';

export const routes: Routes = [
  { path: '', component: LandingComponent, title: 'MTS | Mobility & Transportation Services' },
  { path: 'login', component: LoginComponent, title: 'Login | MTS' },
  { path: 'register', component: RegisterComponent, title: 'Register | MTS' },
  { path: 'vehicles', component: VehiclesComponent, title: 'Vehicles | MTS' },
  { path: 'vehicles/:id', component: VehicleDetailComponent, title: 'Vehicle Details | MTS' },
  { path: 'about', component: AboutComponent, title: 'About | MTS' },
  { path: 'services', component: ServicesComponent, title: 'Services | MTS' },
  { path: 'contact', component: ContactComponent, title: 'Contact | MTS' },
  { path: 'booking', component: BookingComponent, canActivate: [authGuard], title: 'Book a Car | MTS' },
  {
  path: 'admin',
  component: AdminLayoutComponent,
  canActivate: [adminGuard],
  children: [
    { path: '', redirectTo: 'overview', pathMatch: 'full' },
    { path: 'overview', component: AdminOverviewComponent, title: 'Overview | MTS Admin' },
    { path: 'vehicles', component: AdminVehiclesComponent, title: 'Vehicles | MTS Admin' },
  ],
},
  { path: '**', redirectTo: '' },
  
];