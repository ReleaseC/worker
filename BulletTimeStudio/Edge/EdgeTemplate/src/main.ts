import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SOCKET_EVENTS, SOCCOR_EVENT } from './common/socket.service';
import { environment } from './common/environment.service';
import { loginCloudData, DB_STATUS } from './common/db.service';

import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as session from 'express-session';
import * as cors from 'cors';

async function bootstrap() {
  const server = express();
  server.use(session({
		secret: 'siiva-template_edgeserver', // session secret
		resave: true,
		saveUninitialized: true,
	}));
  server.use(cors());
  server.use(bodyParser.json({ limit: '50mb' }));
  server.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  server.use(express.static('./dist/face'));

  const app = await NestFactory.create(AppModule, server);
  //const httpServer = await app.listen(environment.edgeServerListenPort);

  // Client role
	var client = require('socket.io-client');
	var client_socket = client.connect(environment.cloudServer);
	client_socket.on(SOCKET_EVENTS.EVENT_CONNECT, function () {
		// console.log('connect to cloud server');
    // // Send site_id and access_token
    // let body = {
    //   'siteId': '',
    //   'accessToken': ''
    // };
    // loginCloudData.findOne({}, (err, data) => {
    //   if(err) console.log('loginCloudData err=' + err);
    //   if(data){
    //     body.siteId = data.siteId;
    //     body.accessToken = data.accessToken;
    //     // Send body to cloud server
		//     client_socket.emit(SOCKET_EVENTS.EVENT_LOGIN, body);
    //   }
    //   console.log('loginCloudData data=' + JSON.stringify(data));
    // });
	});
  
  client_socket.on(SOCKET_EVENTS.EVENT_LOGIN, (data) => {
    //site_match
    console.log('SOCKET_EVENTS.EVENT_LOGIN = ' + JSON.stringify(data));
    if(data.status == DB_STATUS.OK){
      loginCloudData.findOne({'siteId': data.siteId}, (err, site) => {
        if(err) console.log('loginCloudData err=' + err);
        if(site){
          if(site.accessToken != data.accessToken){
            // Update new accessToken
            console.log('Update new accessToken');
            site.accessToken = data.accessToken;
            site.expireTime = data.expireTime;
            site.save();
          }
        }
      });
    }else{
      console.log('login error = ' + JSON.stringify(data.msg));
    }
  });

  client_socket.on('prepare_upload', (data) => {
    console.log('prepare_upload=' + JSON.stringify(data));
  });

  // Server role
  // const io = require('socket.io')(httpServer, {'multiplex': false});
  // io.on(SOCKET_EVENTS.EVENT_CONNECT, socket => {
  //   console.log('somebody connected');
  //   socket.on(SOCKET_EVENTS.EVENT_LOGIN, () => {
  //     console.log(SOCKET_EVENTS.EVENT_LOGIN);
  //   });
    
  // });
  client_socket.emit('sites_match', {siteId:'9eb754706d5611e8927b91a61c134115'}, (data) => {
    console.log(data);
  });
}
bootstrap();
