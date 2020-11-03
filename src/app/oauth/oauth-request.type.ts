import { Observable } from 'rxjs/Observable';

import { SHA256 } from 'crypto-js';
import * as Base64 from 'crypto-js/enc-base64';
import {encode as toUrlSafeBase64} from 'url-safe-base64';

import { OAuthOptions } from './oauth-options.type';
import { OAuthResponse } from './oauth-response.type';
import { ProviderConfiguration } from './provider-configuration.type';

/**
 * @description
 *
 * An OAuth2 - request. This is a container of ProviderMetadata and OAuthOptions
 * with a method to turn this to an URL.
 *
 */
export abstract class OAuthRequest
{
    constructor(
        protected readonly provider: ProviderConfiguration
      , protected readonly options: OAuthOptions
    ) {}

    /**
     * Returns the provider.
     */
    public getProvider(): ProviderConfiguration
    {
        return this.provider;
    }

    /**
     * Returns the options.
     */
    public getOptions(): OAuthOptions
    {
        return this.options;
    }

    /**
     * Generates OAuth2 request URL from provider and options.
     */
    public abstract toUrl(): string;

    public abstract handleAuthenticationResponse(authenticationResponse: string): Observable<OAuthResponse>;
}
