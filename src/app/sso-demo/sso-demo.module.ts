import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { OAuthSuccessComponent } from './oauth-success.component';
import { SSODemoRoutesModule } from './sso-demo.routes';
import { UserInfoComponent } from './userinfo.component';
import { WelcomeComponent } from './welcome.component';

@NgModule({ declarations: [
        OAuthSuccessComponent,
        WelcomeComponent,
        UserInfoComponent
    ],
    exports: [], imports: [BrowserModule,
        SSODemoRoutesModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class SSODemoModule { }
