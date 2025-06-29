import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CommanderComponent } from './pages/commander/commander.component';
import { authGuard } from './guards/Auth/auth.guard';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  // {
  //   path: 'commander',
  //   component: CommanderComponent,
  //   canActivate: [authGuard],
  // },
  {
    path: 'commander/:token',
    component: CommanderComponent,
    canActivate: [authGuard],
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
