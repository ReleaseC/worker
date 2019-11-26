import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { SocketService } from '../../../shared/socket.service';


@Component({
    selector: 'app-camera',
    templateUrl: './camera.component.html',
    styleUrls: ['./camera.component.css']
})
export class CameraComponent implements OnInit {
    isHandset: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.Handset);
    // statusCollection: any;

    updateTime: string;
    photoTime: string;
    cameraDataSource: any;
    test: string;


    constructor(
        private breakpointObserver: BreakpointObserver,
        private socketService: SocketService) { }

    ngOnInit() {
        console.log('camera')
        this.getStatus();
        // setInterval(() => {
        //     this.getStatus();
        // }, 15000);
    }

    getStatus() {
        this.socketService.getStatus((obj) => {
            console.log('get status');
            obj.data.forEach(camera => {
                // tslint:disable-next-line:radix
                const battery = parseInt(camera.battery);
                if (battery < 100) {
                    if (battery < 50) {
                        camera['icon'] = 'warn';
                    }
                } else {
                    camera['icon'] = 'primary';
                }
            });
            this.cameraDataSource = obj.data;
            console.log('this.cameraDataSource' + JSON.stringify(this.cameraDataSource));
            this.updateTime = obj.updateTime;
            this.photoTime = obj.photoTime;
        });
    }
}
