import { Injectable, NgModule } from '@angular/core';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { CAMERA_DEVICES, SOCKET_EVENTS } from './socket.service';

@Injectable()
export class DeviceService {

    constructor(private socket: Socket) { }

    sendEvent(event: string, cmd: any) {
        // console.log('sendEvent: ' + event + ' ' + cmd);
        this.socket.emit(event, JSON.stringify(cmd));
    }

    getDevices() {
        return this.socket
            .fromEvent(CAMERA_DEVICES.CAM_NUMBER_OF_DEVICES)
            .map(data => JSON.parse(data['devices']));
    }

    getDevicePreview() {
        return this.socket
            .fromEvent(CAMERA_DEVICES.CAM_PREVIEW_PIC)
            .map(data => data);
    }

    // Adjust result count
    getAdjustResultCount() {
        return this.socket
            .fromEvent(CAMERA_DEVICES.CAM_NUMBER_OF_ADJUST_DEVICES)
            .map(data => data);
    }

    // Adjust result data
    getAdjustResult() {
        return this.socket
            .fromEvent(CAMERA_DEVICES.CAM_ADJUST_PREVIEW_PIC)
            .map(data => data);
    }
}
