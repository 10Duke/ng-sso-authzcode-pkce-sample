import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { OAuthSuccessComponent } from './oauth-success.component';
import { SSODemoRoutesModule } from './sso-demo.routes';
import { UserInfoComponent } from './userinfo.component';
import { WelcomeComponent } from './welcome.component';

@NgModule({
    declarations: [
        OAuthSuccessComponent,
        WelcomeComponent,
        UserInfoComponent
    ]
  , imports: [
        BrowserModule
      , HttpClientModule
      , SSODemoRoutesModule
    ]
  , exports: [
    ]
})
export class SSODemoModule { }
