import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { PlaceholderComponent } from './pages/placeholder.component';

export const routes: Routes = [
  { path: '', component: LandingComponent, title: 'MTS | Mobility & Transportation Services' },
  { path: 'login', component: PlaceholderComponent, data: { label: 'Login' }, title: 'Login | MTS' },
  { path: 'register', component: PlaceholderComponent, data: { label: 'Register' }, title: 'Register | MTS' },
  { path: 'vehicles', component: PlaceholderComponent, data: { label: 'Vehicles' }, title: 'Vehicles | MTS' },
  { path: 'vehicles/:id', component: PlaceholderComponent, data: { label: 'Vehicle Details' }, title: 'Vehicle Details | MTS' },
  { path: 'booking', component: PlaceholderComponent, data: { label: 'Booking' }, title: 'Book a Car | MTS' },
  { path: 'contact', component: PlaceholderComponent, data: { label: 'Contact' }, title: 'Contact | MTS' },
  { path: '**', redirectTo: '' },
];
