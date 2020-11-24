import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { from } from 'rxjs';
import { Observable } from 'rxjs/Observable';

import { LocalStorageService } from 'ngx-webstorage';

import { DEFAULT_OAUTH_OPTIONS } from './oauth-options.token';
import { DEFAULT_OAUTH_PROVIDER } from './oauth-provider.token';
import { OAuthOptions } from './oauth-options.type';
import { ProviderConfiguration } from './provider-configuration.type';

import { Authentication, Authenticator, StartLoginResponse } from '@10duke/web-client-pkce';


/**
 * @description
 *
 * A service to manage OAuth2-flow.
 *
 * OAuthService is configured with default `ProviderMetadata` and `OAuthOptions`.
 * 
 * This implementation acts as facade to 10Duke PKCE-library. For testing you need to
 * mock OAuthService.
 *
 */
@Injectable()
export class OAuthService
{
    // 10Duke PKCE-Authenticator.
    private readonly authenticator: Authenticator;

    /**
     * Constructs new instance.
     *
     */
    constructor(
        private readonly bank: LocalStorageService
      , @Inject(DOCUMENT) private readonly document: Document
      , @Inject(DEFAULT_OAUTH_PROVIDER) private readonly provider: ProviderConfiguration
      , @Inject(DEFAULT_OAUTH_OPTIONS) private readonly options: OAuthOptions
    ) {
        this.authenticator = new Authenticator(
            new URL(provider.authorization_endpoint)
          , new URL(provider.token_endpoint)
          , new URL(provider.logout_endpoint)
          , new URL(provider.jwks_endpoint)
          , options.client_id
          , new URL(options.redirect_uri)
          , options.scope
        );
    }

    /**
     *  Starts the OAuth2 -flow.
     *
     *  This method:
     *  1. Builds OAuth-request
     *  2. Stores the request AND any state we need into local storage, because...
     *  3. ... the request is then used to build URL and navigate to the URL
     *
     *  This causes navigation AWAY from this application, i.e. all state will be lost, which
     *  is why we need to store the state. The minimum state is the OAuth-request itself, because it
     *  contains state we need in the next steps (e.g. the code_verifier).
     *
     *  Once the OAuth-server has authenticated the user, it will issue redirect to "redirect_uri"
     *  defined in the options, which causes this application to be reloaded, and re-initialized. The
     *  router activates route based on the redirect-URI (see AppRoutingModule), which will then handle
     *  the "callback" (see OAuthSuccessComponent).
     */
    public async startFlow(state: string): Promise<void>
    {
        const loginState = await this.authenticator.startLogin(state);

        this.bank.store('oauth.request', loginState);

        this.document.location.href = loginState.url.toString();
    }

    /**
     * Handles the authentication response.
     *
     * After successful authentication, the backend makes HTTP-redirect to callback-uri. The response in
     * Authorization Code -flow is in query parameter, containing the authorization code which is to be
     * exchanged to access token with separate call.
     *
     * This method first looks up the request stored in local storage. Since the OAuth-flow navigates away
     * from the app, the request state has been stored in local storage (see the startFlow()-method).
     *
     * After locating the request, the method extracts the code from the response and exchanges the code to
     * token returning an Observable, which emits single value when the exchange is complete.
     *
     */
    public handleAuthenticationResponse(
        code: string
      , state: string
    ): Observable<Authentication>
    {
        const request: StartLoginResponse = this.bank.retrieve('oauth.request');

        if (! request) {
            throw Error('No request found from local storage.');
        }

        this.bank.clear('oauth.request');

        return from(this.authenticator.completeAuthentication(request, code, state));
    }
}
