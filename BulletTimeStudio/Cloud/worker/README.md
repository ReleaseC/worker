<p align="center">
  <a href="http://siiva.com/" target="blank"><img src="http://siiva.cn/wp-content/uploads/2018/01/WechatIMG4.png" alt="siiva Logo" /></a>
</p>

****<P ALIGN="CENTER">根据不同环境使用不同环境下的config</P>****
**<P Align="Center">Depending On The Environment Using A Different Environment Config. </P>**

## Description

<p align="left">
使用了config文件后，后台启动方式的改变 ，以前可以直接node index.js，也可以npm run start 现在必须是用npm run start来启动程序。</p>
<p align="left">
更新了package.json文件中的内容，如下：
"start": "cross-env NODE_ENV=development node index.js"</p>
<p align="left">
如果要使用production的配置文件，可以将package.json的代码改为
"start": "cross-env NODE_ENV=production node index.js"
</p>
<p align="left">将development环境下设置为启用default配置,如需在不同环境下使用对应config，请按照相应格式改好，示例代码在文章最下面</p>

## Start

```bash
$ npm run start
```

## Example

```Javascript
if (process.env.NODE_ENV === 'development') {
  // var config = require('config').get('Dev');// 下面的是启用了default的配置
  var config = require('config').get('Customer');
  // console.log(config);
  var dbHost = config.get('dashBoard.host');
  // console.log('DevdbHost:'+dbHost);
}
if (process.env.NODE_ENV === 'production') {

  var config = require('config').get('Pro');
  var dbHost = config.get('dashBoard.host');
  // console.log('ProdbHost:'+dbHost);
}
if (process.env.NODE_ENV === 'local') {
  var config = require('config').get('Loc');
  var dbHost = config.get('dashBoard.host');
  // console.log('LocdbHost:'+dbHost);
}
// console.log('dbHost:'+dbHost);
```
