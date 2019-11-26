// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,     //控制logger的显示与隐藏
  // wechatapiServer:'https://bt.siiva.com/',
  apiServer:'https://iva.siiva.com/',
  downloadServer:'https://api.siiva.com/',
  // currentdownloadServer:'http://47.96.233.153:7777/'   //暂时用这个ip做小程序下载server
};
