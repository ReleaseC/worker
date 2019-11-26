import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';
import * as child from 'child_process';
import * as express from 'express';
import * as io from 'socket.io-client';
import { setTimeout } from 'timers';
import * as fs from 'fs';
import * as Bluebird from 'bluebird';
import { CAMERA_DEVICES, SOCKET_EVENTS } from './common/socket.service';
import { YiManager } from './yiManager';

const config = require(`../config/${process.env.NODE_ENV || 'develop_tpe'}.json`);
const cameraManager = new YiManager();
// const cameraManager = require('./yi-action-camera.js');
const uuidv1 = require('uuid/v1');
const path = require('path');

const cameraCollection = [];
let socketTask: string = '';
let socketData: any;

function setupSocket() {

	const socket = io.connect(config.apiServer, { reconnect: true });

	socket.on('connect', data => {

		console.log('Connected to server, previous task=' + socketTask);

		if (socketTask !== '') {
			console.log('socket reconnected, resend task=' + socketTask);
			socket.emit(CAMERA_DEVICES.CAM_VIDEO_CUT_RESULT, socketData);
		}

		console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
		checkConnection();
		cameraCollection.forEach((camera) => {
			console.log(camera);
			socket.emit(SOCKET_EVENTS.EVENT_REGISTER, JSON.stringify(camera)); // Send to local_server
		});

	});

	socket.on(SOCKET_EVENTS.EVENT_CONNECT_CAMERA, (data) => {

		connectDevices(data);
	});

	socket.on(SOCKET_EVENTS.EVENT_ECHO, param => {
		cameraCollection.forEach((camera) => {
			socket.emit(SOCKET_EVENTS.EVENT_REGISTER, JSON.stringify(camera));
		});
	});

	socket.on(SOCKET_EVENTS.EVENT_UPDATE_STATUS, async () => {
		const status = await cameraManager.getStatus();
		socket.emit(SOCKET_EVENTS.EVENT_UPDATE_STATUS, status);
	});

	//获取相机的设置信息
	socket.on(SOCKET_EVENTS.EVENT_GET_CAMERA_CONFIG, async (param) => {
		console.log(param)
		console.log(">>>>>>>>>>>>>>")
		let data = await cameraManager.getConfigAll();
		console.log(data.length)
		socket.emit(SOCKET_EVENTS.EVENT_CAMERA_CONFIG, data);

	});

	//修改相机的设置信息
	socket.on(SOCKET_EVENTS.EVENT_SET_CAMERA_CONFIG, async (param) => {
		console.log(param['devicesetting'])
		for (let i = 0; i < 3; i++) {

			let data = await cameraManager.setConfigAll(param['devicesetting']["setting"][i][0], param['devicesetting']['setting'][i][1]);
		}
		// let data = await cameraManager.setConfigAll("iq_photo_iso","100");
		console.log(">>>>>>>")
	});


	socket.on(SOCKET_EVENTS.EVENT_CAMERA_COMMAND, (param) => {
		console.log('cameraCommand');
		const cmd = param;
		const uuidFolder = cmd.taskId;
		let videoSavePath = `YIAgentServer/assets/videos/${uuidFolder}`;
		videoSavePath = mkdirp(videoSavePath);

		if (cmd.status === 'countdown' || cmd.command === 'shootStart' || cmd.command === 'recordStart') {
			console.log('start record');
			// 正在拍摄
			if (cmd.mode !== 'photo') {
				// cameraManager.record(4500, videoSavePath)
				// 	.then((videoPathCollection) => {
				// 		console.log('videoPathCollection=' + videoPathCollection);
				// 		socketTask = CAMERA_DEVICES.CAM_VIDEO_CUT_RESULT;
				// 		socketData = {
				// 			siteId: cmd.siteId,
				// 			userId: cmd.userId,
				// 			taskId: cmd.taskId,
				// 			videoPaths: videoPathCollection,
				// 			mode: cmd.mode,
				// 		};

				// 		socket.emit(CAMERA_DEVICES.CAM_VIDEO_CUT_RESULT, socketData);

				// 	}, (err) => {
				// 		console.log('videoPathCollection error=' + err);
				// 	});
			} else {
				cameraManager.takePhotoAll(videoSavePath)
					.then((photoPathCollection) => {
						console.log('photoPathCollection=' + JSON.stringify(photoPathCollection));
						socketTask = CAMERA_DEVICES.CAM_VIDEO_CUT_RESULT;
						socketData = {
							siteId: cmd.siteId,
							userId: cmd.userId,
							taskId: cmd.taskId,
							videoPaths: photoPathCollection,
							mode: cmd.mode,
						};

						socket.emit(CAMERA_DEVICES.CAM_VIDEO_CUT_RESULT, socketData);

					}, (err) => {
						console.log('videoPathCollection error=' + err);
					});
			}
			// });
		}
	});

	socket.on(SOCKET_EVENTS.EVENT_ADJUST_POTHO, (param) => {
		console.log('cameraCommand');
		const cmd = param;
		const uuidFolder = cmd.taskId;
		let videoSavePath = `YIAgentServer/assets/videos/${uuidFolder}`;
		videoSavePath = mkdirp(videoSavePath);
		cameraManager.takePhotoAll(videoSavePath)
			.then((photoPathCollection) => {
				console.log('photoPathCollection=' + JSON.stringify(photoPathCollection));
				socketTask = CAMERA_DEVICES.CAM_VIDEO_CUT_RESULT;
				socketData = {
					type: cmd.type,
					siteId: cmd.siteId,
					userId: cmd.userId,
					taskId: cmd.taskId,
					videoPaths: photoPathCollection,
					mode: cmd.mode,
				};

				socket.emit(CAMERA_DEVICES.CAM_VIDEO_CUT_RESULT, socketData);

			}, (err) => {
				console.log('videoPathCollection error=' + err);
			});
	});
	socket.on(SOCKET_EVENTS.EVENT_PREVIEW, async (param) => {
		// const cmd = JSON.parse(param);
		// const uuidFolder = uuidv1().replace(/-/g, '');
		// let videoSavePath = `YIAgent/preview/${uuidFolder}`;
		// videoSavePath = mkdirp(`preview/${uuidFolder}`);
		// if (Boolean(cmd.start)) {
		// 	console.log('start preview');
		// 	cameraManager.setConfig().then((msg) => {
		// 		console.log(msg);
		// 		cameraManager.record(2000, mkdirp(`YIAgent/preview/${uuidFolder}`))
		// 			.then((videoPathCollection) => {

		// 				console.log(videoPathCollection);
		// 				Bluebird.map(videoPathCollection, (videoObj) => {

		// 					const outFilePath = mkdirp('../../BulletTime/bullet_localserver/assets/images/src') + '/' + videoObj.index + '.jpg';
		// 					const frameCmd = `ffmpeg -hide_banner -loglevel panic -y -ss 00:00:00 -i ${videoObj.path} -vframes 1 ${outFilePath}`;
		// 					child.execSync(frameCmd);
		// 					return { ip: videoObj.ip, index: videoObj.index, path: outFilePath };

		// 				}).then((photoPathCollection) => {
		// 					console.log(photoPathCollection);
		// 					photoPathCollection.forEach((photoObj) => {
		// 						// console.log(photoObj);
		// 						// convert binary data to base64 encoded string
		// 						const bitmap = fs.readFileSync(photoObj.path);
		// 						const photo = {
		// 							index: photoObj.index,
		// 							id: photoObj.ip,
		// 							preview: 'data:image/jpeg;base64,' + new Buffer(bitmap).toString('base64'),
		// 						};
		// 						// console.log('preview = ' + photo.preview);
		// 						socket.emit(CAMERA_DEVICES.CAM_PREVIEW_PIC, JSON.stringify(photo));
		// 					});
		// 				});
		// 			});
		// 	});
		// }
	});

	socket.on('disconnect', () => {
		console.log('disconnected from server');
		setInterval(async () => {
			console.log('reconnect tp server');
			socket.connect();
		}, 10000);
	});
}

function mkdirp(inputPath: string) {
	let rootPath = path.join(__dirname, '../../');
	const folderName = inputPath.split('/');
	folderName.forEach(folder => {
		rootPath = path.join(rootPath, '/', folder);
		if (!fs.existsSync(rootPath)) {
			fs.mkdirSync(rootPath);
		}
	});
	return rootPath;
}

function checkConnection() {
	setInterval(async () => {
		await cameraManager.checkConnectionAll();
	}, 30000);
}

async function connectDevices(data: any) {
	const cameraObj = data;
	cameraObj.forEach((obj, index) => {
		if (cameraCollection.find((camera) => camera.ip === obj.ip) === undefined) {
			cameraCollection.push({ index: index + 1, ip: obj.ip, name: obj.name, mac: obj.mac });
		}
	});
	// console.log(JSON.stringify(cameraCollection));
	const res = await cameraManager.connectAll(cameraCollection);
	// console.log(await cameraManager.getConfigAll())
}

function promiseFromChildProcess(child, videoObj) {
	return new Promise((resolve, reject) => {
		child.stdout.on('data', resolve);
		child.stderr.on('data', reject);
	});
}

async function bootstrap() {
	const server = express();
	const app = await NestFactory.create(ApplicationModule, server);
	await app.listen(3003);
}
setupSocket();
bootstrap();
