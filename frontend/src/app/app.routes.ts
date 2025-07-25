import { Routes } from '@angular/router';
import { roleGuard } from './core/guards/role.guard';
import { Landing } from './features/landing/landing';
import { AuthFormComponent } from './features/auth-form/auth-form';
import { DASHBOARD_ROUTES } from './features/dashboard/dashboard-module';

export const routes: Routes = [
  {
    path: '',
    component: Landing,
    pathMatch: 'full'
  },
  {
    path: 'admin',
    canActivate: [roleGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () => import('./features/admin/admin-layout').then(m => m.AdminLayout),
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/admin/admin-dashboard').then(m => m.AdminDashboard) },
      { path: 'users', loadComponent: () => import('./features/admin/admin-manage-users').then(m => m.AdminManageUsers) },
      { path: 'parcels', loadComponent: () => import('./features/admin/admin-manage-parcels').then(m => m.AdminManageParcels) },
      { path: 'parcels/create', loadComponent: () => import('./features/admin/create-parcel').then(m => m.CreateParcelComponent) },
      { path: 'reports', loadComponent: () => import('./features/admin/admin-reports').then(m => m.AdminReportsComponent) }
    ]
  },
  {
    path: 'courier',
    canActivate: [roleGuard],
    data: { roles: ['COURIER_AGENT'] },
    loadComponent: () => import('./features/courier/courier-layout').then(m => m.CourierLayout),
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/courier/courier-dashboard').then(m => m.CourierDashboard) },
      { path: 'parcels', loadComponent: () => import('./features/courier/courier-parcels').then(m => m.CourierParcels) },
      { path: 'parcels/create', loadComponent: () => import('./features/courier/courier-create-parcel').then(m => m.CourierCreateParcel) },
      { path: 'parcels/:id', loadComponent: () => import('./features/courier/courier-parcel-details').then(m => m.CourierParcelDetails) }
    ]
  },
  {
    path: 'parcels',
    loadChildren: () => import('./features/parcels/parcels-module').then(m => m.ParcelsModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'auth',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: AuthFormComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];
