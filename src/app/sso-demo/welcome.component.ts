import { Component } from '@angular/core';

import { OAuthService } from '../oauth/oauth.service';

/**
 * This simple component is used to start the OAuth-flow.
 *
 */
@Component({
    template: `
    Welcome, please login:
<button (click)="oauth.startFlow('demo')">Login</button>
`
})
export class WelcomeComponent
{
    constructor(public readonly oauth: OAuthService) {}
}
