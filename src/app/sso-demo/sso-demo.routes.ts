import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OAuthSuccessComponent } from './oauth-success.component';
import { WelcomeComponent } from './welcome.component';

export const REDIRECT_PATH = 'login/callback';

const routes: Routes = [
    {path: 'welcome', component: WelcomeComponent }
  , {path: REDIRECT_PATH, component: OAuthSuccessComponent }
];

/**
 * Defines routes for the sample application.
 *
 * Note the REDIRECT_PATH: This must match the path of redirect-URI configured in the IdP.
 *
 */
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class SSODemoRoutesModule { }
