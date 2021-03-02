import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import {
  canActivate,
  hasCustomClaim,
  emailVerified,
} from '@angular/fire/auth-guard';
import {
  redirectLoggedInToHome,
  redirectUnverifiedToPending,
  redirectVeifiedToHome,
  redirectUnauthorized,
} from '@papx/auth';

import { IntroductionGuard } from './intro/intro.guard';

const verified = () => emailVerified;

const routes2: Routes = [
  {
    path: '',
    ...canActivate(redirectUnauthorized),
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('./home/home.module').then((m) => m.HomePageModule),
      },
      {
        path: 'intro',
        loadChildren: () =>
          import('./intro/intro.module').then((m) => m.IntroPageModule),
        canActivate: [IntroductionGuard],
      },
      {
        path: 'ventas',
        loadChildren: () =>
          import('./ventas/ventas-tab/ventas-tab.module').then(
            (m) => m.VentasTabPageModule
          ),
        // ...canActivate(verified),
      },
      {
        path: 'clientes',
        loadChildren: () =>
          import('./clientes/feature-shell.module').then(
            (m) => m.ClientesFeatureShellModule
          ),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
];

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'intro',
    loadChildren: () =>
      import('./intro/intro.module').then((m) => m.IntroPageModule),
    canActivate: [IntroductionGuard],
  },
  {
    path: 'cart',
    loadChildren: () =>
      import('./cart/cart.module').then((m) => m.CartPageModule),
  },
  {
    path: '',
    redirectTo: 'intro',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes2, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
