import { Routes } from '@angular/router';
import { List } from './list';
import { ParcelDetails } from './details';

export const PARCELS_ROUTES: Routes = [
  { path: '', component: List },
  { path: ':id', component: ParcelDetails }
]; 