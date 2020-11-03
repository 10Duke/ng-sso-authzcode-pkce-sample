import { Inject, Injectable, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Random } from '../random/random.type';

import { RandomStringGenerator } from './random-string-generator.type';
import { DEFAULT_CODEVERIFIER_GENERATOR } from './default-codeverifier-generator.type';
import { DEFAULT_NONCE_GENERATOR } from './default-nonce-generator.type';
import { DEFAULT_OAUTH_OPTIONS } from './oauth-options.token';
import { DEFAULT_OAUTH_PROVIDER } from './oauth-provider.token';
import { OAuthOptions } from './oauth-options.type';
import { OAuthRequest } from './oauth-request.type';
import { OAuthResponse } from './oauth-response.type';
import { PKCERequest } from './pkce-request.type';
import { ProviderConfiguration } from './provider-configuration.type';

/**
 * @description
 *
 * A service to create OAuth2 requests.
 *
 * OAuthService can be configured with default `ProviderMetadata` and `OAuthOptions`.
 * These defaults can be overridden in the `buildRequest()`-method on per-call basis.
 *
 * Note that this service does not initiate any requests.
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
      , @Inject(DEFAULT_CODEVERIFIER_GENERATOR) private readonly codeVerifier: RandomStringGenerator
      , @Inject(DEFAULT_NONCE_GENERATOR) private readonly nonce: RandomStringGenerator
      , @Inject(DEFAULT_OAUTH_PROVIDER) private readonly defaultProvider: ProviderConfiguration
      , @Inject(DEFAULT_OAUTH_OPTIONS) private readonly defaultOptions: OAuthOptions
    ) {}

    /**
     * Builds the request.
     *
     * The resulting `OAuthRequest` object can be used to generate URL to initiate the OAuth-flow.
     *
     */
    public buildRequest(
        overrideOptions?: OAuthOptions
      , overrideProvider?: ProviderConfiguration
    ): OAuthRequest
    {
        const options = Object.assign({}, this.defaultOptions, overrideOptions);

        if (! options.nonce) {
            options.nonce = this.nonce.generate();
        }

        return new PKCERequest(
            Object.assign({}, this.defaultProvider, overrideProvider)
          , options
          , this.http
          , this.codeVerifier.generate()
        );
    }

}
