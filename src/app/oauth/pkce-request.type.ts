import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { SHA256 } from 'crypto-js';
import * as Base64 from 'crypto-js/enc-base64';
import {encode as toUrlSafeBase64} from 'url-safe-base64';

import { OAuthOptions } from './oauth-options.type';
import { OAuthRequest } from './oauth-request.type';
import { OAuthResponse } from './oauth-response.type';
import { ProviderConfiguration } from './provider-configuration.type';
import { parseQueryParameters } from './parse-query-parameters';

/**
 *  Models Authorization code with PKCE -request.
 */
export class PKCERequest extends OAuthRequest
{
    constructor(
        provider: ProviderConfiguration
      , options: OAuthOptions
      , private readonly http: HttpClient
      , private readonly codeVerifier: string
    ) {
        super(provider, options);
    }

    public toUrl(): string
    {
        const options = this.options;
        const encode = encodeURIComponent;
        let url: string;

        url = this.provider.authorization_endpoint;
        url += '?response_type=' + encode(options.response_type);
        url += (options.client_id ? '&client_id=' + encode(options.client_id) : '');
        url += (options.redirect_uri ? '&redirect_uri=' + encode(options.redirect_uri) : '');
        url += (options.nonce ? '&nonce=' + encode(options.nonce) : '');
        url += (options.scope ? '&scope=' + encode(options.scope) : '');
        url += (options.state ? '&state=' + encode(options.state) : '');

        // Build the code_challenge
        const challenge = toUrlSafeBase64(SHA256(this.codeVerifier).toString(Base64).replace('=', ''));

        url += ('&code_challenge=' + challenge);
        url += ('&code_challenge_method=S256');

        return url;
    }

    /**
     * Handles the authentication response.
     *
     * After successful authentication, the backend makes HTTP-redirect to callback-uri. The response in Authorization Code -flow
     * is in query parameter, containing the authorization code which is to be exchanged to access token with separate call.
     *
     * This method extracts the code from the response and exchanges the code to token using HTTP POST, returning an Observable,
     * which emits single value when the exchange is complete.
     *
     */
    public handleAuthenticationResponse(authenticationResponse: string): Observable<OAuthResponse>
    {
        const response = parseQueryParameters(authenticationResponse.substr(1));
        const requestBody = new HttpParams()
          .set('client_id', this.options.client_id)
          .set('code', response.code)
          .set('code_verifier', this.codeVerifier)
          .set('grant_type', 'authorization_code')
          .set('redirect_uri', this.options.redirect_uri);

        return this.http.post<OAuthResponse>('http://localhost:8080/user/oauth20/token', requestBody, {
            headers: new HttpHeaders().append('Content-Type', 'application/x-www-form-urlencoded')
        });
    }
}
