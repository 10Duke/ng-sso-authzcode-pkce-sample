/**
 * @description
 *
 * OAuth provider configuration.
 *
 */
export interface ProviderConfiguration
{
    authorization_endpoint?: string;
    jwks_endpoint: string;
    logout_endpoint: string;
    token_endpoint?: string;
    userinfo_endpoint?: string;
}
