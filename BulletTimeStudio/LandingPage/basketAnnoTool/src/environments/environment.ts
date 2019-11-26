// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiServer: 'http://localhost:3000/',
  mediaServer: 'http://localhost:3100/',
  // apiServer: 'https://iva.siiva.com/',
  // mediaServer: 'http://210.22.77.170:3100/', // 上海辦公室
  // mediaServer: 'https://media-worker.siiva.com/', // ali worker 公网地址
  isDebugMode: true,
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
