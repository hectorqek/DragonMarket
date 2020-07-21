// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  adalConfig: {
    tenant: 'f75993d5-7568-4d7d-9418-2dd2ebe111cc',
    clientId: '8ea76a91-991f-4a78-a128-87ce238b7407',
    redirectUri: 'http://localhost:4200/',
    postLogoutRedirectUri: 'http://localhost:4200/',
  },
};
