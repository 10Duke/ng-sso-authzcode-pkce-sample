import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { LocalStorageService } from 'ngx-webstorage';
import { SHA256 } from 'crypto-js';
import * as Base64 from 'crypto-js/enc-base64';
import {encode as toUrlSafeBase64} from 'url-safe-base64';

import { RandomStringGenerator } from './random-string-generator.type';
import { DEFAULT_CODEVERIFIER_GENERATOR } from './default-codeverifier-generator.type';
import { DEFAULT_NONCE_GENERATOR } from './default-nonce-generator.type';
import { DEFAULT_OAUTH_OPTIONS } from './oauth-options.token';
import { DEFAULT_OAUTH_PROVIDER } from './oauth-provider.token';
import { OAuthOptions } from './oauth-options.type';
import { OAuthResponse} from './oauth-response.type';
import { PKCERequest } from './pkce-request.type';
import { ProviderConfiguration } from './provider-configuration.type';


/**
 * @description
 *
 * A service to manage OAuth2-flow.
 *
 * OAuthService is configured with default `ProviderMetadata` and `OAuthOptions`.
 *
 */
@Injectable()
export class OAuthService
{
    /**
     * Constructs new instance.
     *
     */
    constructor(
        private readonly http: HttpClient
      , private readonly bank: LocalStorageService
      , @Inject(DOCUMENT) private readonly document: Document
      , @Inject(DEFAULT_CODEVERIFIER_GENERATOR) private readonly codeVerifier: RandomStringGenerator
      , @Inject(DEFAULT_NONCE_GENERATOR) private readonly nonce: RandomStringGenerator
      , @Inject(DEFAULT_OAUTH_PROVIDER) private readonly defaultProvider: ProviderConfiguration
      , @Inject(DEFAULT_OAUTH_OPTIONS) private readonly defaultOptions: OAuthOptions
    ) {}

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
    public startFlow(): void
    {
        const request: PKCERequest = {
            provider: this.defaultProvider
          , options: this.defaultOptions
          , codeVerifier: this.codeVerifier.generate()
        };

        this.bank.store('oauth.request', request);

        this.document.location.href = this.toUrl(request);
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
    public handleAuthenticationResponse(response: Record<string, any>): Observable<OAuthResponse>
    {
        const request: PKCERequest = this.bank.retrieve('oauth.request');

        if (! request) {
            throw Error('No request found from local storage.');
        }

        this.bank.clear('oauth.request');

        const requestBody = new HttpParams()
          .set('client_id', request.options.client_id)
          .set('code', response.code)
          .set('code_verifier', request.codeVerifier)
          .set('grant_type', 'authorization_code')
          .set('redirect_uri', request.options.redirect_uri);

        return this.http.post<OAuthResponse>(request.provider.token_endpoint, requestBody, {
            headers: new HttpHeaders().append('Content-Type', 'application/x-www-form-urlencoded')
        });
    }

    /**
     * Converts the request to URL for initiating the OAuth-flow.
     *
     */
    protected toUrl(request: PKCERequest): string
    {
        const encode = encodeURIComponent;
        let url: string;

        url = request.provider.authorization_endpoint;
        url += '?response_type=' + encode(request.options.response_type);
        url += (request.options.client_id ? '&client_id=' + encode(request.options.client_id) : '');
        url += (request.options.redirect_uri ? '&redirect_uri=' + encode(request.options.redirect_uri) : '');
        url += (request.options.nonce ? '&nonce=' + encode(request.options.nonce) : '');
        url += (request.options.scope ? '&scope=' + encode(request.options.scope) : '');
        url += (request.options.state ? '&state=' + encode(request.options.state) : '');

        // Build the code_challenge
        const challenge = toUrlSafeBase64(SHA256(request.codeVerifier).toString(Base64).replace('=', ''));

        url += ('&code_challenge=' + challenge);
        url += ('&code_challenge_method=S256');

        return url;
    }
}
