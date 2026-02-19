import { Routes } from '@angular/router';
import { TablePage } from './pages/table-page/table-page';

export const routes: Routes = [
  { path: '', component: TablePage },
  { path: '**', redirectTo: '' },
];
