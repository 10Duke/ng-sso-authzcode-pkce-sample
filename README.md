# OAuth2 authorization code flow with PKCE Single-Sign-On demo

This demo application demonstrates how to perform OAuth2 authorization code flow with PKCE SSO and then
request `/userinfo` with the access token.

## Running the demo

1. Clone the repo.
2. Install ng-cli: `npm install -g @angular/cli`
3. Build: `npm install`
4. Run: `npm start`
5. Navigate to `http://localhost:4200/`

## Configuration

The application is configured in `app.module.ts`: You need to modify the
configuration e.g. if you are running against different IdP.

## Notes

The OAuth-authentication happens in the same browser tab. When the authentication-flow starts,the browser
navigates to the IdP and this means that the single-page application disappears: After clicking "login"-
button all state is lost. This sample uses local storage to store the request-state, which is required in
the flow. Likewise, *any state, which has to survive the authentication, must be stored e.g. in local storage
and retrieved back when the authentication is complete*.

When the authentication is complete, the IdP issues HTTP-redirect to `redirect_uri`. This redirect navigates
the browser back to the application, which is re-loaded and re-started. The application uses Angular Router,
which is configured so that the `redirect_uri` activates `OAuthSuccessComponent`, which handles the OAuth
"callback".

The demo is tested with Chrome and Firefox. Older browsers (e.g. IE 9-11) need at least polyfills enabled.
