import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { NgxWebstorageModule } from 'ngx-webstorage';

import { SSODemoModule } from './sso-demo/sso-demo.module';
import { REDIRECT_PATH } from './sso-demo/sso-demo.routes';

import { AppComponent } from './app.component';

import { DEFAULT_CODEVERIFIER_GENERATOR, DefaultCodeVerifierGenerator } from './oauth/default-codeverifier-generator.type';
import { DEFAULT_NONCE_GENERATOR, DefaultNonceGenerator } from './oauth/default-nonce-generator.type';
import { OAuthOptions } from './oauth/oauth-options.type';
import { OAuthService } from './oauth/oauth.service';
import { DEFAULT_OAUTH_OPTIONS } from './oauth/oauth-options.token';
import { DEFAULT_OAUTH_PROVIDER } from './oauth/oauth-provider.token';
import { ProviderConfiguration } from './oauth/provider-configuration.type';
import { AppRoutesModule } from './app.routes';

// Configure OAuth2 provider metadata
const defaultProvider: ProviderConfiguration = {
    authorization_endpoint:     'http://localhost:8080/user/oauth20/authz'
  , token_endpoint:             'http://localhost:8080/user/oauth20/token'
  , userinfo_endpoint:          'http://localhost:8080/userinfo'
};

// Configure OAuth2 options
const defaultOptions: OAuthOptions = {
    client_id:      'ng-pkce-demo-local'
  , response_type:  'code'
  , redirect_uri:   'http://localhost:4200/' + REDIRECT_PATH
  , scope:          'openid profile email'
};

@NgModule({
    declarations: [
        AppComponent
    ]
  , imports: [
        BrowserModule
      , NgxWebstorageModule.forRoot()
      , SSODemoModule
      , AppRoutesModule
    ]
  , providers: [
        OAuthService
      , {provide: DEFAULT_CODEVERIFIER_GENERATOR, useValue: new DefaultCodeVerifierGenerator(Math.random)}
      , {provide: DEFAULT_NONCE_GENERATOR, useValue: new DefaultNonceGenerator(Math.random)}
      , {provide: DEFAULT_OAUTH_OPTIONS, useValue: defaultOptions}
      , {provide: DEFAULT_OAUTH_PROVIDER, useValue: defaultProvider}
    ]
  , bootstrap: [AppComponent]
})
export class AppModule { }
