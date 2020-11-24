import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { OAuthService } from '../oauth/oauth.service';

/**
 * This component handles the OAuth2 "callback", i.e. is the redirect_uri to which the backend redirects
 * the browser after successful authentication.
 *
 * The same endpoint is called after error, but errors are not yet handled in this sample.
 *
 * Note that this is a "routing"-component, i.e. it does not have selector and is used via router-config.
 *
 */
@Component({
    template: `
<div *ngIf="token; else elseBlock">
  <xd-userinfo [token]="token"></xd-userinfo>
</div>
<ng-template #elseBlock>
  <h1>Authentication success</h1>
  Exchanging code to token, please wait...
</ng-template>
`
})
export class OAuthSuccessComponent implements OnDestroy
{
    private readonly queryParams: Subscription;

    public token: string;

    public constructor(
        private readonly route: ActivatedRoute
      , private readonly router: Router
      , private readonly oauth: OAuthService
    ) {
        this.queryParams = route.queryParams.subscribe(params => this.onAuthenticationSuccess(params));
    }

    /**
     * This method is called when the query-parameters are changed, and
     * uses OAuthService to exchange the code to a token.
     * 
     * @param params query parameters from router
     */
    protected onAuthenticationSuccess(params: Params): void
    {
        try {
            this.oauth.handleAuthenticationResponse(params.code, params.state).subscribe(response => {
                this.token = response.getAccessToken();
            });
        } catch (anException) {
            console.error(anException);
            console.info('Navigating to /welcome');

            this.router.navigate(['/welcome']);
        }
    }

    public ngOnDestroy(): void
    {
        this.queryParams.unsubscribe();
    }
}
