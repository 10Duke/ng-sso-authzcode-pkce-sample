import { Component, ElementRef, EventEmitter, Inject, Input, OnChanges, OnDestroy, OnInit, Optional, Output, SimpleChanges, ViewChild } from '@angular/core';
import { IFrameHandle, IFrameResizer } from '../iframeresizer/IFrameResizer';
import { WINDOW } from '../window/window.service';

import { OAuthRequest } from '../oauth/oauth-request.type';
import { OAuthResponse} from '../oauth/oauth-response.type';

/**
 * @description
 *
 * An iframe to execute OAuth-flow in.
 *
 * The flow is initiated when `request` parameter changes.
 *
 */
@Component({
    selector: 'xd-oauth-iframe'
  , template: `<iframe #oauth [ngClass]="classes"></iframe>`
})
export class OAuthIFrameComponent implements OnChanges, OnDestroy, OnInit
{
    @ViewChild('oauth', { static: true }) public iframeRef: ElementRef;

    /** CSS-classes to set to the `iframe`-element. */
    @Input() public classes: string;

    /** OAuth2-request. Change will intiate the OAuth2-flow. */
    @Input() public request: OAuthRequest;

    /** Event emitted when the flow has been successfully completed. */
    @Output() public authenticationSuccess = new EventEmitter<OAuthResponse>();

    private handle: IFrameHandle;
    private iframe: HTMLIFrameElement;

    /**
     * Constructs new instance.
     *
     * Takes in `window` and an optional `IFrameResizer`.
     * If `IFrameResizer` is not passed, the `iframe` is not automatically resized.
     * For the resizing to work, the IdP must have the other end of `iframe-resizer` in use.
     */
    constructor(
        @Inject(WINDOW) private readonly window: Window
      , @Optional() private readonly iFrameResizer: IFrameResizer
    ) {}


    public ngOnInit(): void
    {
        // Call onReceiveMessage() when iframe sends 'message'-event
        this.window.addEventListener('message', this.onReceiveMessage, false);
        this.iframe = this.iframeRef.nativeElement;

        if (this.iFrameResizer) {
            this.handle = this.iFrameResizer.init(this.iframe);
        }

        this.startFlow();
    }


    public ngOnChanges(changes: SimpleChanges): void
    {
        if (changes.request) {
            if (! changes.request.firstChange) {
                this.startFlow();
            }
        }
    }


    protected startFlow(): void
    {
        console.log('Starting new OAuth request-flow');

        this.iframe.src = this.request.toUrl();
    }

    public ngOnDestroy(): void
    {
        this.window.removeEventListener('message', this.onReceiveMessage);

        if (this.handle) {
            this.handle.close();
        }
    }

    public onReceiveMessage = (event: MessageEventInit) =>
    {
        if (this.window.location.origin === event.origin) {
            if (event.data && 'sso.response' === event.data.type) {
                // NOTE: This sample does not currently handle errors
                console.log('Successful authentication response:' + event.data.response);

                this.request.handleAuthenticationResponse(event.data.response).subscribe(response => this.authenticationSuccess.emit(response));
            }
        }
    }

}
