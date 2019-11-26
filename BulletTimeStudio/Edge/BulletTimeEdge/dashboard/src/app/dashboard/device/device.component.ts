import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { DeviceService } from '../../service/device.service';
import { DomSanitizer } from '@angular/platform-browser';
// import { NumberPickerModule } from '@retailify/ngx-mat-numberpicker';

declare const $: any;

@Component({
    selector: 'app-device',
    templateUrl: './device.component.html'
})

export class DeviceComponent implements OnInit {
    @Input() device: any;
    isImg: Boolean = true;
    WIDTH: Number = 800;
    HEIGHT: Number = 450;

    @ViewChild('layout') canvasRef;

    constructor(private deviceService: DeviceService, private sanitizer: DomSanitizer) { }

    ngOnInit() {
    }

    getIndex() {
        return this.device['index'];
    }

    getPreview() {
        // console.log('getPreview()');
        // console.log(JSON.stringify(this.device).substring(0, 200));
        return this.sanitizer.bypassSecurityTrustUrl(this.device['preview']);
    }

    onIndexChanged(value: number): void {
        // console.log('new value: ' + value);
        this.device['index'] = value;
        this.deviceService.sendEvent('updateDevice', this.device);
    }

    drawRect(x: number, y: number, w: number, h: number) {
        this.isImg = false;

        console.log('x=' + x);
        console.log('y=' + y);
        console.log('w=' + w);
        console.log('h=' + h);

        const canvas = this.canvasRef.nativeElement;
        const context = canvas.getContext('2d');
        const self = this;

        const img = new Image();
        img.onload = function () {
            context.drawImage(img, 0, 0, self.WIDTH, self.HEIGHT);
            context.strokeStyle = 'red';
            context.lineWidth = 5;
            context.strokeRect(x, y, w, h);
        };
        img.src = this.device['preview'];
    }// End drawRect

    drawCenterPoint() {
        this.isImg = false;

        const canvas = this.canvasRef.nativeElement;
        const context = canvas.getContext('2d');
        const self = this;

        const img = new Image();
        img.onload = function () {
            // canvas.width = self.HEIGHT;
            // canvas.height = self.WIDTH;
            // context.translate(0, self.WIDTH);
            // context.rotate(270 * Math.PI / 180);
            context.clearRect(0, 0, self.WIDTH, self.HEIGHT);
            context.drawImage(img, 0, 0, self.WIDTH, self.HEIGHT);
            context.fillStyle = 'red';
            context.arc(400, 225, 4, 0, 2.0 * Math.PI);
            context.fill();
        };
        img.src = this.device['preview'];
    }// End drawCenterPoint

    drawGrid() {
        this.isImg = false;

        const canvas = this.canvasRef.nativeElement;
        const context = canvas.getContext('2d');
        const self = this;

        const img = new Image();
        img.onload = function () {
            context.clearRect(0, 0, self.WIDTH, self.HEIGHT);
            context.drawImage(img, 0, 0, self.WIDTH, self.HEIGHT);
            context.strokeStyle = 'red';

            // Line 1 |
            context.moveTo(266, 0); // 800/3
            context.lineTo(266, self.HEIGHT);
            context.stroke();

            // Line 2 |
            context.moveTo(426, 0); // 800/3*2
            context.lineTo(426, self.HEIGHT);
            context.stroke();

            // Line 3 一
            context.moveTo(0, 150); // 450/3
            context.lineTo(self.WIDTH, 150);
            context.stroke();

            // Line 4 一
            context.moveTo(0, 300); // 450/3*2
            context.lineTo(self.WIDTH, 300);
            context.stroke();

        };
        img.src = this.device['preview'];
    }// End drawGrid

    drawCross() {
        this.isImg = false;

        const canvas = this.canvasRef.nativeElement;
        const context = canvas.getContext('2d');
        const self = this;

        const img = new Image();
        img.onload = function () {
            context.clearRect(0, 0, self.WIDTH, self.HEIGHT);
            context.drawImage(img, 0, 0, self.WIDTH, self.HEIGHT);
            context.strokeStyle = 'red';

            // Line 1 |
            context.moveTo(400, 0); // 800/2
            context.lineTo(400, self.HEIGHT);
            context.stroke();

            // Line 2 一
            context.moveTo(0, 225); // 450/2
            context.lineTo(self.WIDTH, 225);
            context.stroke();
        };
        img.src = this.device['preview'];
    }// End drawCross
}
