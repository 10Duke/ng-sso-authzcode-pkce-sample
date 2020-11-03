import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { OAuthIFrameModule } from '../oauth-iframe/oauth-iframe.module';

import { SSODemoComponent } from './sso-demo.component';
import { UserInfoComponent } from './userinfo.component';

@NgModule({
    declarations: [
        SSODemoComponent
      , UserInfoComponent
    ]
  , imports: [
        BrowserModule
      , HttpClientModule
      , OAuthIFrameModule
    ]
  , exports: [
        SSODemoComponent
    ]
})
export class SSODemoModule { }
