// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  //apiServer: 'https://api.siiva.com/',
  //edgeServer: '192.168.1.156',
  //cloudServer: 'http://localhost:3000/'
  cloudServer: 'https://bt.siiva.com/',
  //cloudServer:'https://bt-dev-1.siiva.com/',
  cloudServer1:'https://bt-dev-1.siiva.com/',
  apiServer: 'https://bt.siiva.com/',
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
