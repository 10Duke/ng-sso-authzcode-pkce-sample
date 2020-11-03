import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs';

import { ElementRef } from '@angular/core';

import { OAuthIFrameComponent } from './oauth-iframe.component';
import { OAuthOptions } from '../oauth/oauth-options.type';
import { OAuthRequest } from '../oauth/oauth-request.type';
import { OAuthResponse } from '../oauth/oauth-response.type';
import { ProviderConfiguration } from '../oauth/provider-configuration.type';

import { IFrameHandle, IFrameResizer } from '../iframeresizer/IFrameResizer';

describe('OAuthIFrameComponent', () =>
{
  let component: OAuthIFrameComponent;
  let wind0w: Window;
  let ref: ElementRef;
  let iframe: HTMLIFrameElement;
  let handle: IFrameHandle;

  beforeEach(() =>
  {
    const win: any = jasmine.createSpyObj('Window', ['addEventListener', 'removeEventListener']);
    win.location = {origin: 'https://example.com'};
    wind0w = win;

    iframe = {} as HTMLIFrameElement;
    ref = new ElementRef(iframe);
    handle = jasmine.createSpyObj('IFrameHandle', ['close']);
  });

  describe('with IFrameResizer', () =>
  {
    let resizer: any;

    beforeEach(() =>
    {
      resizer = jasmine.createSpyObj('IFrameResizer', ['init']);
      resizer.init.and.returnValue(handle);

      component = initComponent(wind0w, resizer);
    });

    it('should initialize', () =>
    {
        component.ngOnInit();

        expect(wind0w.addEventListener).toHaveBeenCalledTimes(1);
        expect(wind0w.addEventListener).toHaveBeenCalledWith('message', jasmine.any(Function), false);

        expect(iframe.src).toBe('http://localhost/');
        expect(resizer.init).toHaveBeenCalledTimes(1);
        expect(resizer.init).toHaveBeenCalledWith(iframe);
    });

    it('should clean on destroy', () =>
    {
        component.ngOnInit();
        component.ngOnDestroy();

        expect(wind0w.removeEventListener).toHaveBeenCalledTimes(1);
        expect(wind0w.removeEventListener).toHaveBeenCalledWith('message', jasmine.any(Function));

        expect(handle.close).toHaveBeenCalledTimes(1);
    });
  });


  describe('without IFrameResizer', () =>
  {
    beforeEach(() =>
    {
      component = initComponent(wind0w, null);
    });

    it('should initialize', () =>
    {
        component.ngOnInit();

        expect(wind0w.addEventListener).toHaveBeenCalledTimes(1);
        expect(wind0w.addEventListener).toHaveBeenCalledWith('message', jasmine.any(Function), false);

        expect(iframe.src).toBe('http://localhost/');
    });

    it('should clean on destroy', () =>
    {
        component.ngOnInit();
        component.ngOnDestroy();

        expect(wind0w.removeEventListener).toHaveBeenCalledTimes(1);
        expect(wind0w.removeEventListener).toHaveBeenCalledWith('message', jasmine.any(Function));
    });
  });


  describe('onReceiveMessage', () =>
  {
      beforeEach(() =>
      {
          component = initComponent(wind0w, null);
      });

      it('should emit fragment if origin and event type are correct', (done) =>
      {
          component.authenticationSuccess.subscribe(result => {
              expect(result).toEqual({
                  scope: 'fake'
              });
              done();
          });
          component.onReceiveMessage({
              origin: 'https://example.com'
            , data: {
                  type: 'sso.response'
                , fragment: '#test-fragment'
              }
          });
      });

      it('should emit nothing if origin is incorrect', (done) =>
      {
          component.authenticationSuccess.subscribe(result => {
              fail('Should not emit value');
          });
          component.onReceiveMessage({
              origin: 'http://evil-hijacker.com'
            , data: {type: 'sso.success'}
          });
          done();
      });

      it('should emit nothing if event data is missing', (done) =>
      {
          component.authenticationSuccess.subscribe(result => {
              fail('Should not emit value');
          });
          component.onReceiveMessage({
              origin: 'https://example.com'
          });
          done();
      });
      it('should emit false if event data is string', (done) =>
      {
          component.authenticationSuccess.subscribe(result => {
              fail('Should not emit value');
          });
          component.onReceiveMessage({
              origin: 'https://example.com'
            , data: 'some random data here'
          });
          done();
      });
      it('should emit false if event data is object without type', (done) =>
      {
          component.authenticationSuccess.subscribe(result => {
              fail('Should not emit value');
          });
          component.onReceiveMessage({
              origin: 'https://example.com'
            , data: {hello: 'world'}
          });
          done();
      });
      it('should emit false if event data is object with improper type', (done) =>
      {
          component.authenticationSuccess.subscribe(result => {
              fail('Should not emit value');
          });
          component.onReceiveMessage({
              origin: 'https://example.com'
            , data: {type: 'incorrect type'}
          });
          done();
      });
  });

  class Fake extends OAuthRequest
  {
    constructor(
        protected readonly provider: ProviderConfiguration
      , protected readonly options: OAuthOptions
    ) {
        super(provider, options);
    }

    public toUrl(): string { return 'http://localhost/'; }

    public handleAuthenticationResponse(authenticationResponse: string): Observable<OAuthResponse>
    {
        return of({scope: 'fake'});
    }
  }

  function initComponent(win: Window, resizer: any): OAuthIFrameComponent
  {
      const comp = new OAuthIFrameComponent(win, resizer as IFrameResizer);
      comp.iframeRef = ref;
      comp.request = new Fake(null, null);

      return comp;
  }

});

