import { OAuthOptions } from './oauth-options.type';
import { PKCERequest } from './pkce-request.type';
import { ProviderConfiguration } from './provider-configuration.type';


describe('PKCERequest', () =>
{
  const DEFAULT_PROVIDER: ProviderConfiguration = {
      authorization_endpoint: 'https://id.example.com/authorize'
  };
  const SIMPLE_OPTIONS: OAuthOptions = {
      response_type:              'id_token token'
  };


  it('#toUrl should return proper url with all values in place', () =>
  {
    const request = new PKCERequest(
        DEFAULT_PROVIDER
      , {
            response_type:              'id_token token'
          , client_id:                  'abc 123'
          , redirect_uri:               'https://client.example.com/login/callback'
          , nonce:                      'qwe rty'
          , scope:                      'openid profile'
          , state:                      '/root/'
        }
      , null
      , 'abc'
    );

    expect(request.toUrl()).toBe(''
      + 'https://id.example.com/authorize'
      + '?response_type=id_token%20token'
      + '&client_id=abc%20123'
      + '&redirect_uri=https%3A%2F%2Fclient.example.com%2Flogin%2Fcallback'
      + '&nonce=qwe%20rty'
      + '&scope=openid%20profile'
      + '&state=%2Froot%2F'
      + '&code_challenge=ungWv48Bz-pBQUDeXa4iI7ADYaOWF3qctBD_YfIAFa0'
      + '&code_challenge_method=S256'
    );
  });

  it('#toUrl should return proper url when some options are missing', () =>
  {
      expect(new PKCERequest(DEFAULT_PROVIDER, SIMPLE_OPTIONS, null, 'abc').toUrl()).toBe(''
      + 'https://id.example.com/authorize'
      + '?response_type=id_token%20token'
      + '&code_challenge=ungWv48Bz-pBQUDeXa4iI7ADYaOWF3qctBD_YfIAFa0'
      + '&code_challenge_method=S256'
    );
  });

  it('#getOptions should return the options', () =>
  {
      expect(new PKCERequest(DEFAULT_PROVIDER, SIMPLE_OPTIONS, null, null).getOptions()).toBe(SIMPLE_OPTIONS);
  });

  it('#getProvider should return the provider', () =>
  {
      expect(new PKCERequest(DEFAULT_PROVIDER, SIMPLE_OPTIONS, null, null).getProvider()).toBe(DEFAULT_PROVIDER);
  });

});

