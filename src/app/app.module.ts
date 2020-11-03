import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { SSODemoModule } from './sso-demo/sso-demo.module';

import { AppComponent } from './app.component';

import { WINDOW } from './window/window.service';
import { IFrameResizer } from './iframeresizer/IFrameResizer';
import { DEFAULT_CODEVERIFIER_GENERATOR, DefaultCodeVerifierGenerator } from './oauth/default-codeverifier-generator.type';
import { DEFAULT_NONCE_GENERATOR, DefaultNonceGenerator } from './oauth/default-nonce-generator.type';
import { OAuthOptions } from './oauth/oauth-options.type';
import { OAuthService } from './oauth/oauth.service';
import { DEFAULT_OAUTH_OPTIONS } from './oauth/oauth-options.token';
import { DEFAULT_OAUTH_PROVIDER } from './oauth/oauth-provider.token';
import { ProviderConfiguration } from './oauth/provider-configuration.type';

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
  , redirect_uri:   'http://localhost:4200/login/callback.html'
  , scope:          'openid profile email'
};


@NgModule({
    declarations: [
        AppComponent
    ]
  , imports: [
        BrowserModule
      , SSODemoModule
    ]
  , providers: [
        IFrameResizer
      , OAuthService
      , {provide: DEFAULT_CODEVERIFIER_GENERATOR, useValue: new DefaultCodeVerifierGenerator(Math.random)}
      , {provide: DEFAULT_NONCE_GENERATOR, useValue: new DefaultNonceGenerator(Math.random)}
      , {provide: DEFAULT_OAUTH_OPTIONS, useValue: defaultOptions}
      , {provide: DEFAULT_OAUTH_PROVIDER, useValue: defaultProvider}
      , {provide: WINDOW, useValue: window}
    ]
  , bootstrap: [AppComponent]
})
export class AppModule { }
