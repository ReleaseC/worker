import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './modules/app.module';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as crypto from 'crypto';
import * as http from 'http';
import * as fs from 'fs';
import axios from 'axios';
import { Global } from './modules/common/global.component';
//import * as io from 'socket.io';
import * as client from 'socket.io-client';
import { setInterval } from 'timers';
var macaddress = require('macaddress');
var md5 = require('md5');
var JsonDB = require('node-json-db');
import {SETTING} from './modules/setting/setting.service'
console.log('>>>>>>>>>'+SETTING.API_SERVER)
let API_SERVER = SETTING.API_SERVER;
let PORT = SETTING.PORT;

let deviceId = md5(JSON.stringify(macaddress.networkInterfaces()));
let deviceDB = new JsonDB('./db/device.json', true, false);
var id = deviceDB.getData('/').index;

console.log('>>>>>>>>>>>>'+id)
//deviceDB.push("device", { "id": deviceId, "index": id });

let deviceIndex = id;
try {
	deviceIndex = deviceDB.getData('/' + deviceId);
}
catch (e) {
	//console.log('<<<<<<'+deviceIndex)
}

let device = {};
device['id'] = deviceId;
device['index'] = deviceIndex;


let getDevice = function () {
	console.log('getDevice: ' + JSON.stringify(device));
	return device;
}

async function bootstrap() {
	const server = express();
	const app = await NestFactory.create(ApplicationModule, server);
	const httpServer = await app.listen(PORT);

	// var socket_client = client.connect('http://192.168.1.110:3000/', { reconnect: true });
	var socket_client = client.connect(API_SERVER, { reconnect: true });
	socket_client.on('connect', function (data) {
		console.log('connected')
		socket_client.emit('register', JSON.stringify(getDevice()));

		socket_client.on('echo', (error) => {
			socket_client.emit('register', JSON.stringify(getDevice()));
		});

		socket_client.on('updateDevice', (data) => {
			// console.log('updateDevice ' + data);
			let _device = JSON.parse(data);
			if (device['id'] === _device['id']) {
				device = _device;
				console.log(JSON.stringify(device));
				//deviceDB.push('/' + deviceId, device['index']);
				deviceDB.push("device", { "id": deviceId, "index": device['index'] });
				//deviceDB.save();
				socket_client.emit('register', JSON.stringify(getDevice()));
			}
		});

		socket_client.on('preview', (data) => {
			console.log('preview: ' + data);
			let cmd = JSON.parse(data);
			if (cmd['start']) {
				fnStartPreview(socket_client);
			}
			else {
				fnStopPreview();
			}
		});

		socket_client.on('beep', (data) => {
			let _device = JSON.parse(data);
			if (device['id'] === _device['id']) {
				console.log('\x07');
			}
		});
	});

	socket_client.on('error', (error) => {
		console.log(error);
	});

	socket_client.on('start_record',(data)=>{
		console.log(data);
		console.log('开始录制')
		doStart_record(data);
	});

	async function doStart_record(data) {
		try {
			console.log(data)
			// let response = await axios.get('http://localhost:3000/record/start_record');
			let response = await axios.get('http://localhost:3003/record/start_record?id='+data.id);
			return response;
		}
		catch (error) {
			console.log(error);
		}
	};
}
//bootstrap();

var UDP_PORT = 6024;
var dgram = require('dgram');
var UDP_server = dgram.createSocket("udp4");
let timerId;
let timerIdPreview;
UDP_server.bind(function () {
	UDP_server.setBroadcast(true);
	timerId = setInterval(broadcastNew, 1000);
});

function broadcastNew() {
	let msg = {};
	msg['cmd'] = 'echo_ip';
	var message = new Buffer(JSON.stringify(msg));
	UDP_server.send(message, 0, message.length, UDP_PORT, '255.255.255.255', function () {
		// console.log("Sent '" + message + "'");
	});
}

UDP_server.on('message', function (message, rinfo) {
	console.log('Message from: ' + rinfo.address + ':' + rinfo.port + ' - ' + message);
	console.log(message)
	console.log(rinfo)
	let msg = JSON.parse(message);
	var is_start = 1;
	Global.setstart(is_start);
	console.log('<<<<' + Global.getstart())
	if (msg['address'] === undefined && Global.getstart() === 1) {
		clearInterval(timerId);
		//API_SERVER = msg['server'];
		console.log('<<<<<<Find API_SERVER: ' + msg['server']);
		bootstrap();
	}
});

let fnStartPreview = function (socket) {
	//if (timerIdPreview) {
		clearInterval(timerIdPreview);
	//}
	//timerIdPreview = setInterval(function () {
		// take picture
		// let msg = {};
		// msg['id'] = device['id'];
		// msg['preview'] = device_preview; // data uri of taken picture
		// send to server
		// socket.emit('device_preview', JSON.stringify(msg));
		const exec = require('child_process').exec;
		var yourscript = exec('python record.py',
			(error, stdout, stderr) => {
				console.log(`${stdout}`);
				console.log(`${stderr}`);
				if (error !== null) {
					console.log(`exec error: ${error}`);
				}
				fs.readFile(`${process.cwd()}/preview.jpg`, (err, data) => {
					// let base64Image = new Buffer(data, 'binary').toString('base64');
					let base64 = 'data:image/jpeg;base64,' + new Buffer(data).toString('base64')
					let msg = {};
					msg['id'] = device['id'];
					msg['index'] = device['index'];
					msg['preview'] = base64; // data uri of taken picture
					socket.emit('device_preview', JSON.stringify(msg));
					console.log('emit device_preview: ' + JSON.stringify(msg).substring(0, 200));
				})
			});
	//}, 3000);
}

let fnStopPreview = function () {
	if (timerIdPreview) {
		clearInterval(timerIdPreview);
	}
	timerIdPreview = 0;
}
