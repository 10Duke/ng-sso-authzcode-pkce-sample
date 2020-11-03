import { InjectionToken } from '@angular/core';
import { OAuthOptions } from './oauth-options.type';

export const DEFAULT_OAUTH_OPTIONS = new InjectionToken<OAuthOptions>('default OAuth2 options');
