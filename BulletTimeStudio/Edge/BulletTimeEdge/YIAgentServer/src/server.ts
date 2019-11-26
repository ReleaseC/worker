import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './modules/app.module';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as crypto from 'crypto';
import * as http from 'http';
import axios from 'axios';
import * as session from 'express-session';
import * as cors from 'cors';
import { Global } from './modules/common/global.component';
import * as io from 'socket.io';
import * as child from 'child_process';
import { setTimeout, setInterval } from 'timers';
import { CAMERA_DEVICES, SOCKET_EVENTS } from './modules/common/socket.component';
import * as ufile from '../lib/ufile';
import * as Bluebird from 'bluebird';
import { frameUploadTask, TASK_STATE } from './modules/common/db.component';
import { StatusService } from './modules/common/status.service';
import { environment } from './modules/common/env.component'

const util = require('util');
// const async = require('async');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const HttpRequest = ufile.HttpRequest;
const AuthClient = ufile.AuthClient;
const request = require('request');
const os = require('os');
const statusService = new StatusService();
const ping = require('ping');
const arp = require('node-arp');

/**
let game_data = fs.readFileSync('./1.txt', 'utf-8')
console.log(game_data.split(',')[0]);
async function auto_push(data) {
	for (let i = 0; i < data.split(',').length; i++) {
		console.log(data.split(',')[i])
		await axios.get('https://bt.siiva.com/users/auto_push/?game_id=' + data.split(',')[i])
	}
}
auto_push(game_data);
*/
let config = require(`../config/${process.env.NODE_ENV || 'development'}.json`);
async function get_devices() {
	let Response = await axios.post("https://iva.siiva.com/site/get_site_detail", { "siteId": config.siteId })
	var cameraConfig = Response.data["result"]["deviceConfig"];
	// console.log(cameraConfig)
	return cameraConfig
}

async function get_spare_devices() {
	let Response = await axios.post("https://iva.siiva.com/site/get_site_detail", { "siteId": config.siteId })
	var cameraConfig = Response.data["result"]["sparedeviceConfig"];
	// console.log(cameraConfig)
	return cameraConfig
}

// let cameraConfig = require(`../config/camera.json`);
// let cameraConfig = require(`../config/camera.json`);

let devices = [];
let recordingDevicesIsUpload = [];
let updateDevice = function (device) {
	var found, i;
	found = false;
	i = 0;
	while (i < devices.length) {
		if (device.id === devices[i].id) {
			found = true;
			devices[i] = device;
			break;
		}
		i++;
	}
	if (!found) {
		devices.push(device);
	}
};

let _port = 3001;
//let isCameraFree = 'Free';

async function bootstrap() {

	let cameraConfig = await get_devices();
	let ip = await scanIp();
	console.log(ip.length)
	ip.forEach((host) => {
		arp.getMAC(host.host, function (err, mac) {
			if (!err) {
				cameraConfig.camera.forEach((camera) => {
					if (String(camera.mac).toUpperCase() === String(mac).toUpperCase()) {
						camera['ip'] = host.host;
						console.log(`${camera.ip}/${camera.mac}/${camera.name}`);
						// console.log(camera)
					}
				})
			}
		});

	})

	const server = express();
	server.use(session({
		secret: 'bullet-time-studio-secret-ASDFJLKLSDAFKS', // session secret
		resave: true,
		saveUninitialized: true
	}));
	server.use(cors());
	server.use(bodyParser.json({ limit: '50mb' }));
	server.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
	server.use('/apk', express.static('./apk'));
	server.use(fileUpload());

	server.post('/upload', function (req, res) {

		const video_folder = './video';
		if (!fs.existsSync(video_folder)) {
			fs.mkdirSync(video_folder);
		}
		var record_time = Global.getTime();
		const video_folder1 = './video/' + record_time;
		if (!fs.existsSync(video_folder1)) {
			fs.mkdirSync(video_folder1);
		}
		if (!req.files)
			return res.status(400).send('No files were uploaded.');

		let idx = req.body.idx;
		let recordId = req.body.recordId;
		console.log('[upload] ' + idx + ' ' + recordId);

		let video_data = req.files.video_data;
		let video_name = 'siiva_' + req.files.video_data.name.split('_')[2] + '_' + req.files.video_data.name.split('_')[3];

		console.log(video_name)
		//console.log(video_data)
		let dst = video_folder1 + '/' + video_name
		let id = req.files.video_data.name.split('_')[3].split('.')[0];
		console.log(id)
		video_data.mv(dst, function (err) {
			if (err)
				return res.status(500).send(err);
			res.send('File uploaded!');
			console.log(record_time);

			recordingDevicesIsUpload[idx] = true;
			console.log('File uploaded');
			//华为手机的回传后校正和剪辑
			fs.readdir('./assets/videos/123456', function (err, data) {
				// console.log(data)    
				if (data.length === 12) {
					setTimeout(function () {
						console.log('开始剪辑>>>>>>>>>>>>>>>>>>>>>');
						var data1 = {};
						data1['videoPaths'] = [];
						for (var i = 0; i < data.length; i++) {
							data1['videoPaths'][Number(data[i].split('.')[0]) - 1] = { 'index': data[i].split('.')[0], 'path': '/home/siiva/PROJECTS/BulletTimeStudio/BulletTime/bullet_localserver/assets/videos/123456/' + data[i] }
							if (i === 11) {
								console.log(data1)
								videoCut(data1);
							}
							// console.log(data1['videoPaths'])      
							// console.log(i+'>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')               
							// console.log(data1['videoPaths'].length)  
						}

					}, 20000)
				}
			});
		});
	});

	const app = await NestFactory.create(ApplicationModule, server);
	const httpServer = await app.listen(_port);

	//作为客户端
	var client = require('socket.io-client');
	var client_socket = client.connect(environment.cloudServer);
	let deveice_interval;
	let edgeserver_isalive;
	client_socket.on('connect', function () {
		console.log('connect');
		var data = { 'siteId': environment.siteId };
		client_socket.emit('register', data);

		// Every ten sec. send battery info. to cloud server
		deveice_interval = setInterval(function () {
			// socket.broadcast.emit(SOCKET_EVENTS.EVENT_UPDATE_STATUS)
			const body = {
				'siteId': environment.siteId,
				'device_status': statusService.getData(),
			};
			client_socket.emit('camera_status_from_edge', body);
		}, 10000);

		edgeserver_isalive = setInterval(function () {
			// socket.broadcast.emit(SOCKET_EVENTS.EVENT_UPDATE_STATUS)
			console.log(">>>>>>>>>>>>>>>>>>>>>")
			const body = {
				'siteId': environment.siteId,
				'edgeserver_isalive': "is_alive",
			};
			client_socket.emit('edgeserver_status', body);
		}, 60000);
	});

	client_socket.on('prepare_To_record', function (data) {
		console.log(data)
		console.log(">>>>>>>>>>>>>>>>>>>>")
		if (data['siteId'] == config.siteId) {
			Global.setid(data.id)
			Global.getSocket()['local_page'].emit('countdown', { data: data })
		}

		// Global.getSocket()['local_page'].broadcast.emit('start_record',data);
	});

	client_socket.on('disconnect', function () {
		console.log('disconnect');
		clearInterval(deveice_interval);
	});

	// //校正时使用的拍摄
	client_socket.on(SOCKET_EVENTS.EVENT_ADJUST_POTHO, function (data) {
		if (data["siteId"] == environment.siteId) {
			Global.getSocket()['local_page'].emit(SOCKET_EVENTS.EVENT_ADJUST_POTHO, { data: data })
		}
	});

	//作为服务器端
	var io = require('socket.io')(httpServer);
	//console.log(io)
	io.on('connect', function (socket) {

		console.log('a user connected.');
		console.log(cameraConfig.camera)

		socket.emit(SOCKET_EVENTS.EVENT_CONNECT_CAMERA, cameraConfig.camera);


		//重新去扫描并链接
		client_socket.on(SOCKET_EVENTS.EVENT_RESCAN, function (data) {
			if (data["siteId"] == environment.siteId) {
				setTimeout(async function () {
					let cameraConfig = await get_devices();
					let sparecameraConfig = await get_spare_devices()
					let ip = await scanIp();
					// console.log(ip)
					ip.forEach((host) => {
						arp.getMAC(host.host, function (err, mac) {
							if (!err) {
								cameraConfig.camera.forEach((camera, index) => {
									if (String(camera.mac).toUpperCase() === String(mac).toUpperCase()) {
										camera['ip'] = host.host;
										console.log(`${camera.ip}/${camera.mac}/${camera.name}`);
									} else {
										sparecameraConfig.camera.forEach((camera, index1) => {
											if (String(camera.mac).toUpperCase() === String(mac).toUpperCase()) {
												cameraConfig.camera[index] = sparecameraConfig.camera[index1]
											}
										})
										camera['ip'] = host.host;
										camera['mac'] = mac;
									}
								})
							}
						});
					})
					socket.broadcast.emit(SOCKET_EVENTS.EVENT_CONNECT_CAMERA, cameraConfig.camera);
				}, 1000)
			}

		});

		socket.on('disconnect', function (data) {
			console.log('disconnect: ' + data);
			devices = [];
			socket.broadcast.emit('echo', '');
		});

		socket.on('join', function (data) {
			console.log(data);
			//socket.emit('countdown',{msg:data.id})
			Global.setSocket(socket, data.id);
		});

		// 
		socket.on(SOCKET_EVENTS.EVENT_CAMERA_STATUS, (cb) => {
			statusService.getData()
			// cb(statusService.getData())
			// console.log(statusService.getData())
			socket.broadcast.emit(SOCKET_EVENTS.EVENT_UPDATE_STATUS)
		});

		setInterval(function () {
			socket.broadcast.emit(SOCKET_EVENTS.EVENT_UPDATE_STATUS)
		}, 10000);

		socket.on(SOCKET_EVENTS.EVENT_UPDATE_STATUS, (data) => {
			statusService.getData()
			// console.log(data)
			statusService.updateData(data);
		});


		socket.on(SOCKET_EVENTS.EVENT_TASKS_STATUS, async (data, cb) => {
			await frameUploadTask.find({ site_id: data }, (err, tasks) => {
				if (err) cb(err);
				if (tasks) {
					cb(tasks);
				} else {
					cb('No tasks');
				}
			});

			socket.emit(SOCKET_EVENTS.EVENT_TASKS_STATUS);
		});

		socket.on(SOCKET_EVENTS.EVENT_REGISTER, function (data) {
			//console.log(data)
			let device = JSON.parse(data);
			var id = device.id;
			//console.log(id)
			Global.setSocket(socket, id);
			//console.log('register: ' + JSON.stringify(devices));
			updateDevice(device);
		})

		socket.on(SOCKET_EVENTS.EVENT_ECHO, function (data) {
			devices = [];
			socket.broadcast.emit(SOCKET_EVENTS.EVENT_ECHO, ''); // Send refresh command to YIAgent or Android
		})

		// upload csv file
		socket.on(SOCKET_EVENTS.EVENT_UCLOUD_UPLOAD, () => {
			console.log("Receive Event");
			const data = {
				siteId: config.siteId
			};
			csvCloudUpload(data)
				.then((msg) => {
					console.log(msg);
				})
		})

		function checkIsCameraFree() {
			if (Global.getStatus() !== 'Free') {
				const data = {
					'code': 400,
					'status': 'Need wait',
				};
				socket.emit(SOCKET_EVENTS.EVENT_ERROR_COMMAND, data); // Send socket command back to client
			}
		}

		socket.on(SOCKET_EVENTS.EVENT_IS_CAMERA_FREE, () => {
			console.log('-------Check is camera or not-------');
			checkIsCameraFree();
		});

		socket.on(SOCKET_EVENTS.EVENT_CAMERA_COMMAND, function (data) {
			console.log('-------Camera command-------');

			// Convert to JSON file type
			if (typeof (data) === 'string') {
				data = JSON.parse(data);
			}
			statusService.updatePhotoTime();
			// console.log('data=' + JSON.stringify(data));

			// Check can record or not
			// if (Global.getStatus() !== 'Free') return;

			// If no userId, send command error back to client
			// if ((!data['userId']) || (data['userId'] === '')) {
			// 	data['code'] = 400;
			// 	data['status'] = 'Need userId';
			// 	socket.emit(SOCKET_EVENTS.EVENT_ERROR_COMMAND, data); // Send socket command back to client
			// 	return;
			// }

			Global.setStatus('Recoding');

			for (let i = 0; i < devices.length; i++) {
				recordingDevicesIsUpload[i] = false;
			}

			// 2. Create taskId
			const uuidv1 = require('uuid/v1');

			data['taskId'] = uuidv1().replace(/-/g, '');

			// 3. Add siteId
			data['siteId'] = config.siteId;

			// 4. Add userId
			data['userId'] = data['userId'];
			//data['userId'] = 'test_userId';

			// 5. Add nickname
			//data['nickname'] = 'test_nickname';
			data['nickname'] = data['nickname'];
			// 6. Add capture mode
			data['mode'] = config.mode || 'photo';

			// add csv & frame source
			data['source'] = {
				csv: `${data.siteId}`,
				frame: `${data.siteId}/${data.taskId}`
			};

			//随机模板
			// ToDo: 不應該從這裡設定...
			const num = Math.floor(Math.random() * 6);
			const template = ['0012_1.mov', '0012_2.mov', '0012_3.mov', '0012_4.mov', '0012_5.mov', '0012_6.mov'];
			//  add template
			// data['template'] = template[num];
			data['template'] = '';

			// Send socket to all device
			console.log('data=' + JSON.stringify(data));
			socket.broadcast.emit(SOCKET_EVENTS.EVENT_CAMERA_COMMAND, data); // Send camera command to YIAgent or Android

			// create task
			const create = {
				siteId: data.siteId,
				taskId: data.taskId,
				userId: data.userId,
				template: data.template,
				nickname: data.nickname,
				cameraNum: config.cameraNum,
				source: data.source
			}
			console.log('Task content=' + JSON.stringify(create))

			request({
				url: `${config.apiServer}/task/task_create`,
				method: "POST",
				json: true,
				body: create
			}, (error, response, body) => {
				if (!error && response.statusCode == 200) {
					console.log(body)
				}
			})
		});

		// //校正时使用的拍摄
		socket.on(SOCKET_EVENTS.EVENT_ADJUST_POTHO, function (data) {
			if (data["siteId"] == environment.siteId) {
				var Data = { "type": "adjust", "siteId": config.siteId, "userId": "siiva", "taskId": "siiva" }
				socket.broadcast.emit(SOCKET_EVENTS.EVENT_ADJUST_POTHO, Data);
			}

		});


		// ToDo: move this code to cloud
		socket.on(CAMERA_DEVICES.CAM_VIDEO_CUT_RESULT, function (data) {
			console.log('EVENT_VIDEO_CUT_RESULT=' + JSON.stringify(data));
			if (data.type !== "adjust") {
				postProcess(data);
			} else {
				frameCloudUpload(data, data.videoPaths);
				socket.emit(SOCKET_EVENTS.EVENT_ADJUST_POTHO_SUCCESS, { "status": "success" });
			}

		});

		socket.on(SOCKET_EVENTS.EVENT_PREVIEW, function (data) {
			console.log('-------start preview-------')
			socket.broadcast.emit(SOCKET_EVENTS.EVENT_PREVIEW, data); // Send socket commonad to YIAgent
		});

		//通知获取相机设置信息
		client_socket.on(SOCKET_EVENTS.EVENT_GET_CAMERA_CONFIG, function () {
			socket.broadcast.emit(SOCKET_EVENTS.EVENT_GET_CAMERA_CONFIG, { "siteId": config.siteId }); // Send socket commonad to YIAgent
		});

		//发送设备的设置信息
		socket.on(SOCKET_EVENTS.EVENT_CAMERA_CONFIG, function (data) {
			client_socket.emit(SOCKET_EVENTS.EVENT_GET_CAMERA_CONFIG, { "siteId": config.siteId, "devicesetting": data }); // Send socket commonad to YIAgent
		});

		//修改设备的设置信息
		client_socket.on(SOCKET_EVENTS.EVENT_SET_CAMERA_CONFIG, function (data) {
			socket.emit(SOCKET_EVENTS.EVENT_SET_CAMERA_CONFIG, { "siteId": config.siteId, "devicesetting": data }); // Send socket commonad to YIAgent
		});

		socket.on(CAMERA_DEVICES.CAM_PREVIEW_PIC, function (data) {
			socket.broadcast.emit(CAMERA_DEVICES.CAM_PREVIEW_PIC, data); // Send data back to dashboard
		})

		socket.on(SOCKET_EVENTS.EVENT_ADJUST_PREVIEW_COUNT, function () {
			console.log('-------start preview_adjust_count-------')
			const cmd = 'python src/modules/Algo/adjust_points_count.py --dataDirInput assets/images/src/ ';
			child.exec(cmd, (error, stdout, stderr) => {
				// console.log('error=' + error);
				// console.log('stdout=' + stdout);
				// console.log('stderr=' + stderr);
				const data = parseInt(stdout.replace('count= ', ''));
				socket.emit(CAMERA_DEVICES.CAM_NUMBER_OF_ADJUST_DEVICES, data); // send socket event to dashboard
			});
		});

		socket.on(SOCKET_EVENTS.EVENT_ADJUST_PREVIEW, function (data) {
			console.log('-------start preview_adjust-------');

			const cmd = JSON.parse(data);
			// cmd = {
			//     'calibration' : calibration,
			//     'param1' : this.adjParam_param1,
			//     'param2' : this.adjParam_param2,
			//     'minRadius' : this.adjParam_minRadius,
			//     'maxRadius' : this.adjParam_maxRadius,
			//     'thresDistCent' : this.adjParam_thresDistCent
			// 	   'ux' : this.adjParam_ux,
			//     'ly' : this.adjParam_ly,
			// };

			// create pic folder
			mkdirp('assets/images/src');
			mkdirp('assets/images/filter');
			mkdirp('assets/images/dst');
			const filterCommand = 'python src/modules/Algo/adjust_color.py' +
				' --dataDirInput assets/images/src/' +
				' --dataDirOutput assets/images/filter/';

			const command = 'python src/modules/Algo/adjust_points.py' +
				' --dataDirInput assets/images/filter/' +
				' --dataDirOutput assets/images/dst/' +
				' --param1 ' + cmd.param1 +
				' --param2 ' + cmd.param2 +
				' --minRadius ' + cmd.minRadius +
				' --maxRadius ' + cmd.maxRadius +
				' --thresDistCent ' + cmd.thresDistCent +
				' --lx ' + cmd.lx +
				' --ux ' + cmd.ux +
				' --ly ' + cmd.ly +
				' --uy ' + cmd.uy +
				' --calibrated ' + cmd.calibration;

			console.log('command=' + command);
			console.log('start run python script: calibration = ' + cmd.calibration);

			promiseFromChildProcess(child.exec(filterCommand))
				.then((oot) => {
					child.exec(command, (error, stdout, stderr) => {
						//console.log('error=' + error);
						//console.log('stdout=' + stdout);
						//console.log('stderr=' + stderr);
						const out = stdout;
						const strSplit = out.replace(/\n$/, '').split(';');
						const num = parseInt(strSplit[0].replace('n_images= ', ''));
						let xy_all_real;
						let xy_all_interpolated;
						let bitmap;
						let fileName;
						console.log('num=' + num);
						var path = require('path');
						for (let i = 0; i < num; i++) {
							if (Boolean(cmd.calibration)) {
								//console.log('strSplit[ '+(3*i+1)+' ]=' + strSplit[3*i+1]);
								xy_all_real = strSplit[3 * i + 1].replace('xy_all_real[ ' + i + ' ]= ', '');
								//console.log('strSplit[ '+(3*i+2)+' ]=' + strSplit[3*i+2]);
								xy_all_interpolated = strSplit[3 * i + 2].replace('xy_all_interpolated[ ' + i + ' ]= ', '');
								fileName = strSplit[3 * i + 3].replace('fileName[ ' + i + ' ]= ', '').replace(' ', '');
								console.log('xy_all_real[ ' + i + ' ]=' + xy_all_real);
								console.log('xy_all_interpolated[ ' + i + ' ]=' + xy_all_interpolated);
								console.log('fileName[ ' + i + ' ]=' + fileName);
								bitmap = fs.readFileSync(path.join(__dirname, '../') + fileName);
								data = {
									'calibration': cmd.calibration,
									'index': i,
									'xy_all_real': xy_all_real,
									'xy_all_interpolated': xy_all_interpolated,
									'preview': 'data:image/jpeg;base64,' + new Buffer(bitmap).toString('base64'),
								};
							} else {
								fileName = strSplit[2 * i + 2].replace('fileName[ ' + i + ' ]= ', '').replace(' ', '');
								console.log('fileName[ ' + i + ' ]=' + fileName);
								bitmap = fs.readFileSync(path.join(__dirname, '../') + fileName);
								data = {
									'calibration': cmd.calibration,
									'index': i,
									'preview': 'data:image/jpeg;base64,' + new Buffer(bitmap).toString('base64'),
								};
							}
							console.log(data)
							socket.emit(CAMERA_DEVICES.CAM_ADJUST_PREVIEW_PIC, data); // send socket event to dashboard
						}// End for
					});// End child.exec
				})
		});
		// console.log('device connected, broadcast devices ' + JSON.stringify(devices));
		socket.emit(CAMERA_DEVICES.CAM_NUMBER_OF_DEVICES, { 'devices': JSON.stringify(devices) }); // Send emit to Stuio/dashboard
	});

	// var util = require('util');
	// var setTimeoutPromise = util.promisify(setInterval);
	// setTimeoutPromise(function () {
	// }, 30000);
}

function csvCloudUpload(data) {
	return Bluebird.map(['adjust.xlsx'], (fileName) => {
		return new Promise((resolve, reject) => {
			const bucket = 'eee'; // "eee".cn-sh2.ufileos.com
			const key = `${data.siteId}/${fileName}`;  // destination file name
			const file_path = `assets/images/dst/${fileName}`; // source file path + name
			const method = 'POST';
			const url_path_params = '/' + key;
			const req = new HttpRequest(method, url_path_params, bucket, key, file_path);
			const client = new AuthClient(req);
			return client.SendRequest((res) => {
				if (res instanceof Error) {
					reject(util.inspect(res));
				} else {
					resolve(`${data.siteId}/${fileName}`);
				}
			});

		})
	})
}


function frameCloudUpload(data, videoPathCollection) {
	console.log(videoPathCollection)
	return Bluebird.map(videoPathCollection, (pathObj, index) => {
		return new Promise((resolve, reject) => {

			if (pathObj.path !== undefined) {
				const bucket = 'siiva'; // "eee".cn-sh2.ufileos.com
				const key = `${data.siteId}/${data.taskId}/${index + 1}.jpg`;  // destination file name
				const file_path = pathObj.path; // source file path + name
				const method = 'POST';
				const url_path_params = '/' + key;
				const req = new HttpRequest(method, url_path_params, bucket, key, file_path);
				const client = new AuthClient(req);
				return client.SendRequest((res) => {
					if (res instanceof Error) {
						//reject(util.inspect(res));
						//报错后会重复抓取
						frameCloudUpload(data, file_path);
					} else {
						resolve(`${data.siteId}/${data.taskId}`);
					}
				});
			}

		})
	})
}

function addZero(data) {
	return (data > 9) ? data : '0' + data;
}

function getCurrentTime() {
	const d = new Date();
	const year = d.getFullYear();
	const month = addZero(d.getMonth() + 1);
	const date = addZero(d.getDate());
	const hour = addZero(d.getHours());
	const min = addZero(d.getMinutes());
	const sec = addZero(d.getSeconds());

	return year + '/' + month + '/' + date + ' ' + hour + ':' + min + ':' + sec;
}

function postProcess(data) {

	// Add task into mongodb
	let task = new frameUploadTask();
	task.status = TASK_STATE.CREATE;
	task.site_id = data.siteId;
	task.task_id = data.taskId;
	task.user_id = data.userId;
	task.video_path = data.videoPaths;
	task.node = data.mode;
	task.date = getCurrentTime();
	task.save();

	// if (data.mode === 'photo') {
	// 	const videoPathCollection = data.videoPaths;
	// 	frameCloudUpload(data, videoPathCollection)
	// 		.then((msg) => {
	// 			console.log(msg);
	// 			const update = {
	// 				siteId: data.siteId,
	// 				taskId: data.taskId,
	// 				userId: data.userId
	// 			}
	// 			request({
	// 				url: `${config.apiServer}/task/task_update`,
	// 				method: "POST",
	// 				json: true,
	// 				body: update
	// 			}, (error, response, body) => {
	// 				if (!error && response.statusCode == 200) {
	// 					console.log(body)
	// 				}
	// 			})
	// 		})
	// 		.catch((err) => {
	// 			console.log(err);
	// 		})


	// } else {
	// 	videoCut(data);
	// }

}

function videoCut(data) {
	var videoPathCollection = data.videoPaths;
	const exec = child.exec,
		// python file relative path 
		pyPath = 'src/modules/Algo',
		// video file relative path 
		voiceFps = '30',
		frameParameter = '--hImage 1080 --wImage 1920 --hVideo 1080 --wVideo 1920',
		csvParameter = '--xyRealFile assets/images/dst/realXY.csv --xyInterpolateFile assets/images/dst/interpolatedXY.csv';
	const centerVideo = path.relative(path.join(__dirname, '../'), videoPathCollection[Math.floor(videoPathCollection.length / 2)].path);
	const videoPath = path.join(centerVideo, '../');
	mkdirp(videoPath + 'frame')

	const centerHighCmd = `python ${pyPath}/highest_pos_lighted.py --input_video ${centerVideo} --noOutFile 0`;
	const centerVoiceMaxCmd = `python ${pyPath}/sync_videos.py --inputDir ${centerVideo} --csvDir ${videoPath} --frameDir ${videoPath + 'frame/'} --centerVideo 1 --fps ${voiceFps} `;
	const voiceMaxCmd = `python ${pyPath}/sync_videos.py --inputDir ${videoPath} --csvDir ${videoPath} --frameDir ${videoPath + 'frame/'} --centerVideo 0 --fps ${voiceFps} `;
	const angleCmd = `python ${pyPath}/align_points.py --inputDir ${videoPath + 'frame/'}  --outputDir ${videoPath} ${csvParameter} ${frameParameter}`;

	let targetCollection = [];

	console.log('----------------------');
	console.log('command = ' + centerHighCmd);
	console.log('----------------------');

	promiseFromChildProcess(exec(centerHighCmd))
		.then((highestFrame) => {
			//正在剪辑
			Global.setStatus('Cutting');
			console.log('highest frame of center high video = ' + highestFrame);
			console.log('----------------------');
			console.log('command = ' + centerVoiceMaxCmd + ' --difference ' + highestFrame);
			console.log('----------------------');
			return promiseFromChildProcess(exec(centerVoiceMaxCmd + ` --difference ${highestFrame}`));

		}, (err) => {
			console.log(err);
			//出现错误
			Global.setStatus('Error');
		})

		.then((diffNumber) => {

			console.log('Difference number of frame between highest and volumeMax: ' + diffNumber);
			console.log('----------------------');
			console.log('command = ' + voiceMaxCmd + ' --difference ' + diffNumber);
			console.log('----------------------');
			return promiseFromChildProcess(exec(voiceMaxCmd + ` --difference ${diffNumber}`));

		}, (err) => {
			console.log(err);
			//出现错误
			Global.setStatus('Error');
		})
		.then((targetFrame: string) => {


			let task = new frameUploadTask();
			task.status = TASK_STATE.CREATE;
			task.site_id = data.siteId;
			task.task_id = data.taskId;
			task.user_id = data.userId;
			task.video_path = data.videoPaths;
			task.node = data.mode;
			task.date = getCurrentTime();
			task.save();

			// frameCloudUpload(data, videoPath)
			// 	.then((msg) => {
			// 		console.log(msg);
			// 		const update = {
			// 			siteId: data.siteId,
			// 			taskId: data.taskId,
			// 			userId: data.userId,
			// 			source: {
			// 				csv: `${data.siteId}`,
			// 				frame: msg[0]
			// 			},
			// 		}
			// 		request({
			// 			url: `${config.apiServer}/task/task_update`,
			// 			method: "POST",
			// 			json: true,
			// 			body: update
			// 		}, (error, response, body) => {
			// 			if (!error && response.statusCode == 200) {
			// 				console.log(body)
			// 			}
			// 		})
			// 	})
			// 	.catch((err) => {
			// 		console.log(err);
			// 	})


			// targetCollection = targetFrame.split('\n');
			// targetCollection.pop();
			// console.log('video\'s target frame = ' + targetCollection.toString());
			// console.log('----------------------');
			// console.log('command = ' + angleCmd + ' --targetFrame ' + targetCollection.toString());
			// console.log('----------------------');
			// return promiseFromChildProcess(exec(angleCmd + ' --targetFrame ' + targetCollection.toString()));

		}, (err) => {
			console.log(err);
			//出现错误
			Global.setStatus('Error');
		})
	// .then((alignFrame) => {
	// 	console.log(alignFrame);
	// 	const cmd = `ffmpeg -framerate 3 -i ${videoPath}align/cam%03d_transformed.jpg -filter minterpolate='fps=30' ${videoPath}align/out.mp4`
	// 	console.log('----------------------');
	// 	console.log('command = ' + cmd);
	// 	console.log('----------------------');
	// 	return promiseFromChildProcess(exec(cmd));

	// }, (err) => {
	// 	console.log(err);
	// 	//出现错误
	// 	Global.setStatus('Error');
	// })
	// .then((data) => {

	// 	console.log(data);
	// 	//让相机可以拍摄
	// 	Global.setStatus('Free');
	// }, (err) => {
	// 	console.log(err);
	// 	//出现错误
	// 	Global.setStatus('Error');
	// })
}

async function scanIp() {

	const localIp = getLocalIp().split('.');
	console.log(localIp)
	const hosts = new Array(254);
	hosts.fill(`${localIp[0]}.${localIp[1]}.${localIp[2]}`)
	console.log(hosts.length)

	let lanIp = await Bluebird.map(hosts, async (host, index) => {
		const res = await ping.promise.probe(`${host}.${index + 1}`)
		return Bluebird.resolve(res);
	})
	lanIp = lanIp.filter((ip) => {
		return ip.alive;
	})

	console.log(lanIp.length)
	return lanIp;

}



function getLocalIp(): string {
	var ip = 'ip_unknown';
	var ifaces = os.networkInterfaces();
	Object.keys(ifaces).forEach(function (ifname) {
		var alias = 0;
		ifaces[ifname].forEach(function (iface) {
			if ('IPv4' !== iface.family || iface.internal !== false) {
				return;
			}
			if (alias >= 1) {
			} else {
				ip = iface.address;
			}
			++alias;
		});
	});
	return ip;
}

function mkdirp(inputPath: string) {
	let rootPath = path.join(__dirname, '../')
	const folderName = inputPath.split('/');
	folderName.forEach(folder => {
		rootPath = path.join(rootPath, '/', folder);
		if (!fs.existsSync(rootPath)) {
			fs.mkdirSync(rootPath);
		}
	});
	return rootPath;
}

function promiseFromChildProcess(child) {
	return new Promise(function (resolve, reject) {
		child.stdout.on('data', resolve);
		child.stderr.on('data', reject);
		// child.addListener("error", reject); 
		// child.addListener("exit", resolve); 
	});
}

bootstrap();

var PORT = 6024;
var dgram = require('dgram');
var client = dgram.createSocket('udp4');

client.on('listening', function () {
	var address = client.address();
	console.log('UDP Client listening on ' + address.address + ":" + address.port);
	client.setBroadcast(true);
});

client.on('message', function (message, rinfo) {
	console.log('Message from: ' + rinfo.address + ':' + rinfo.port + ' - ' + message);
	let msg1 = JSON.parse(message);
	if (msg1['cmd'] === 'echo_ip') {
		let msg = {};
		require('dns').lookup(require('os').hostname(), function (err, add, fam) {
			console.log('addr: ' + add);
			msg['server'] = `http://${add}:${_port}`;
			client.send(JSON.stringify(msg), rinfo.port, rinfo.address, (err) => {
				console.log("  >> echo: " + msg);
			});
		});
	}
});
client.bind(PORT);
