import { Component, } from '@angular/core';

import { OAuthRequest } from '../oauth/oauth-request.type';
import { OAuthResponse} from '../oauth/oauth-response.type';
import { OAuthService } from '../oauth/oauth.service';

/**
 * Simple component to orchestrate the OAuth 2 authorization code flow with PKCE
 * and using the access token after login.
 *
 */
@Component({
    selector: 'xd-sso-demo'
  , template: `
<button *ngIf="!loginVisible" (click)="showLogin()">Login</button>
<xd-oauth-iframe
  *ngIf="loginVisible"
  classes="sso"
  [request]="request"
  (authenticationSuccess)="onLoginSuccess($event)"
></xd-oauth-iframe>
<div *ngIf="token">
  <h1>Login successful</h1>
  <xd-userinfo *ngIf="token" [token]="token"></xd-userinfo>
</div>
`
})
export class SSODemoComponent
{
    public requestUrl: string;
    public loginVisible = false;
    public request: OAuthRequest = null;
    public userInfo: any;
    public error: any;
    public token: string;

    constructor(private readonly oauth: OAuthService) {}

    public onLoginSuccess(response: OAuthResponse): void
    {
      this.loginVisible = false;

      // Shows the user-info component (which loads the userinfo using the access token)
      this.token = response.access_token;
    }

    public showLogin(): void
    {
      // Clear the token (hides user-info)
      this.token = null;

      this.loginVisible = true;

      // Generate new OAuth-request
      // The xd-oauth-iframe - component detects the request change and starts the OAuth-flow
      this.request = this.oauth.buildRequest();
    }

}
