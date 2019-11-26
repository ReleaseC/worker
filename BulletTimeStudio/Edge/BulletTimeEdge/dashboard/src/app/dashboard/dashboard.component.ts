import { Component, OnInit, AfterViewInit, ViewChildren } from '@angular/core';
import { DeviceService } from '../service/device.service';
import { DeviceComponent } from './device/device.component';
import { CAMERA_DEVICES, SOCKET_EVENTS, CAMERA_COMMAND } from '../service/socket.service';
// tslint:disable-next-line:import-blacklist
import { Subscription } from 'rxjs';
import { TimerObservable } from 'rxjs/observable/TimerObservable';

declare const $: any;

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
    isRecording = false;
    devices: any;
    countDown = 0;
    private fPreview = false;
    private subscription: Subscription;
    adjust_num = 0;
    adjust_devices: any;
    adjParam_param1: Number = 10;
    adjParam_param2: Number = 10;
    adjParam_minRadius: Number = 10;
    adjParam_maxRadius: Number = 30;
    adjParam_thresDistCent: Number = 1200;
    adjParam_lx: Number = 0;
    adjParam_ux: Number = 1920;
    adjParam_ly: Number = 0;
    adjParam_uy: Number = 1080;
    processing: String;
    tmpDevices: any;
    tmpAdjust_devices: any;

    // Draw rectangle
    Rect_index: Number = -1;
    Rect_x: Number = 0;
    Rect_y: Number = 0;
    Rect_w: Number = 0;
    Rect_h: Number = 0;
    //

    @ViewChildren(DeviceComponent)
    deviceComponent;

    constructor(private deviceService: DeviceService) { }

    ngOnInit() {
        this.deviceService
            .getDevices()
            .subscribe(devices => {
                this.devices = devices.sort((a, b) => a['index'] - (b['index']));
                this.tmpDevices = devices;
                console.log(this.devices);
            });

        this.deviceService
            .getDevicePreview()
            .subscribe(msg => {
                this.processing = '';
                msg = JSON.parse(msg.toString());
                for (let i = 0; i < this.devices.length; i++) {
                    const d = this.devices[i];
                    if (msg['id'] === d['id']) {
                        d['preview'] = msg['preview'];
                    }
                }
            });

        // Test adjust result count
        this.deviceService
            .getAdjustResultCount()
            .subscribe(msg => {
                if (msg == null) { return; }
                console.log('getAdjustResultCount=' + msg.toString());
                this.adjust_num = parseInt(msg.toString(), 10);
                // console.log(devices);
                const adjust_device = [];
                for (let i = 0; i < this.adjust_num; i++) {
                    adjust_device.push({ 'index': i, 'xy_all_real': '', 'xy_all_interpolated' : '' });
                }
                console.log(adjust_device);
                this.tmpAdjust_devices = adjust_device;
            });

        // Get adjust result
        this.deviceService
            .getAdjustResult()
            .subscribe(msg => {
                // msg = JSON.parse(msg.toString());
                console.log('index=' + msg['index']);
                this.adjust_num = parseInt(msg['index'], 10);
                console.log('xy_all_real=' + msg['xy_all_real']);
                console.log('xy_all_interpolated=' + msg['xy_all_interpolated']);
                const d = this.adjust_devices[this.adjust_num];
                console.log('d=' + d);
                if (msg['calibration']) {
                    // calibration = 1
                    d['xy_all_real'] = msg['xy_all_real'];
                    d['xy_all_interpolated'] = msg['xy_all_interpolated'];
                    d['preview'] = msg['preview'];
                } else {
                    // calibration = 0
                    d['preview'] = msg['preview'];
                }
                this.processing = '';
            });

        this.onPreviewAdjustCount();
    }

    // onRecordStart(event) {
    //     console.log('Record Start');
    //     const d = new Date().toISOString().split(':').join('-').substr(0, 19);
    //     const cmd = {};
    //     this.countDown = 5;

    //     const timer = TimerObservable.create(1000, 1000);
    //     this.subscription = timer.subscribe(t => {
    //         this.countDown--;
    //         if (this.countDown <= 0) {
    //             this.subscription.unsubscribe();
    //             cmd[CAMERA_COMMAND.KEY_COMMAND] = CAMERA_COMMAND.RECORD_START;
    //             cmd[CAMERA_COMMAND.KEY_RECORD_ID] = d;
    //             cmd[CAMERA_COMMAND.KEY_DURATION] = 10;
    //             console.log(cmd);
    //             //this.deviceService.sendEvent(SOCKET_EVENTS.EVENT_CAMERA_COMMAND, cmd);

    //         }
    //     });
    // }

    onRefreshDevice(event) {
        console.log('Refresh device');
        this.deviceService.sendEvent(SOCKET_EVENTS.EVENT_ECHO, '');
    }

    onShootStart(event) {
        console.log('Record Start');
        const cmd = {};
        cmd[CAMERA_COMMAND.KEY_COMMAND] = CAMERA_COMMAND.RECORD_START;
        cmd[CAMERA_COMMAND.KEY_DURATION] = 5;
        console.log(cmd);
        this.deviceService.sendEvent(SOCKET_EVENTS.EVENT_CAMERA_COMMAND, cmd);
    }

    onPreview(event) {
        // Clear adjust devices winsows
        console.log('onpreview ' + event);
        this.adjust_devices = null;
        // Show adjust devices winsows
        this.devices = this.tmpDevices;

        const cmd = {};
        cmd['start'] = !this.fPreview;
        // console.log('Preview ' + JSON.stringify(cmd));
        this.deviceService.sendEvent(SOCKET_EVENTS.EVENT_PREVIEW, cmd); // send socket event to local_server
        this.processing = 'preview is processing...please wait';
    }

    onPreviewAdjustCount() {
        console.log('onPreviewAdjustCount');
        const cmd = {};
        this.deviceService.sendEvent(SOCKET_EVENTS.EVENT_ADJUST_PREVIEW_COUNT, cmd);
    }

    onPreviewAdjust(calibration) {
        // Clear pewview devices windows
        this.devices = null;
        // Show adjust devices winsows
        this.adjust_devices = this.tmpAdjust_devices;

        if ((this.adjParam_param1 == null) || (this.adjParam_param2 == null) ||
            (this.adjParam_minRadius == null) || (this.adjParam_maxRadius == null) || (this.adjParam_thresDistCent == null) ||
            (this.adjParam_lx == null) || (this.adjParam_ux == null) ||
            (this.adjParam_ly == null) || (this.adjParam_uy == null)
        ) {
            this.processing = 'Some arguments missing';
            return;
        }

        console.log('calibration=' + calibration);
        console.log('adjParam_param1=' + this.adjParam_param1);
        console.log('adjParam_param2=' + this.adjParam_param2);
        console.log('adjParam_minRadius=' + this.adjParam_minRadius);
        console.log('adjParam_maxRadius=' + this.adjParam_maxRadius);
        console.log('adjParam_thresDistCent=' + this.adjParam_thresDistCent);
        console.log('adjParam_lx=' + this.adjParam_lx);
        console.log('adjParam_ux=' + this.adjParam_ux);
        console.log('adjParam_ly=' + this.adjParam_ly);
        console.log('adjParam_uy=' + this.adjParam_uy);

        const cmd = {
            'calibration' : calibration,
            'param1' : this.adjParam_param1,
            'param2' : this.adjParam_param2,
            'minRadius' : this.adjParam_minRadius,
            'maxRadius' : this.adjParam_maxRadius,
            'thresDistCent' : this.adjParam_thresDistCent,
            'lx' : this.adjParam_lx,
            'ux' : this.adjParam_ux,
            'ly' : this.adjParam_ly,
            'uy' : this.adjParam_uy,
        };
        this.processing = 'Calibration ' + calibration + ' is processing...please wait';
        this.deviceService.sendEvent(SOCKET_EVENTS.EVENT_ADJUST_PREVIEW, cmd);
    }

    onDrawRect() {
        let length;
        if (this.devices !== null) {
	    // Preview devices length
            length = this.devices.length;
        } else {
	    // Adjust devices length
            length = this.adjust_devices.length;
        }

        console.log('Rect_index=' + this.Rect_index);
        if (this.Rect_index < 0) {
	        // Write rectangle to all
            for (let i = 0; i < length; i++) {
                this.deviceComponent._results[i].drawRect(
                    this.Rect_x,
                    this.Rect_y,
                    this.Rect_w,
                    this.Rect_h
                );
            }
        }else {
	        // Write rectangle to specific image
            const index: any = this.Rect_index;
            this.deviceComponent._results[index].drawRect(
                this.Rect_x,
                this.Rect_y,
                this.Rect_w,
                this.Rect_h
            );
        }
    }// End onDrawRect

    getLength() {
        let length;
        if (this.devices !== null) {
	    // Preview devices length
            length = this.devices.length;
        } else {
	    // Adjust devices length
            length = this.adjust_devices.length;
        }
        return length;
    }

    onCenterPoint() {
        for (let i = 0; i < this.getLength(); i++) {
            this.deviceComponent._results[i].drawCenterPoint();
        }
    }// End onCenterPoint

    onGrid() {
        for (let i = 0; i < this.getLength(); i++) {
            this.deviceComponent._results[i].drawGrid();
        }
    }// End onGrid

    onCross() {
        for (let i = 0; i < this.getLength(); i++) {
            this.deviceComponent._results[i].drawCross();
        }
    }

    testUpload() {
        this.deviceService.sendEvent(SOCKET_EVENTS.EVENT_UCLOUD_UPLOAD, null);
    }
}
