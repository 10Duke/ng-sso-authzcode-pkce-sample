import { OAuthOptions } from './oauth-options.type';
import { ProviderConfiguration } from './provider-configuration.type';

/**
 *  Models "authorization code with PKCE" -request.
 */
export interface PKCERequest
{
    provider: ProviderConfiguration;
    options: OAuthOptions;
    codeVerifier: string;
}
