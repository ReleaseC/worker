import { Component, Get, Post, Res, Body, Response, Param, Query, HttpStatus, HttpException, Req } from '@nestjs/common';

@Component()
export class NotificationService {
    webpush: any;
    vapidKeys: any;
    notificationPayload: any;

    constructor() {
        this.webpush = require('web-push');
        this.vapidKeys = {
            'publicKey': 'BLnVk1MBGFBW4UxL44fuoM2xxQ4o9CuxocVzKn9UVmnXZEyPCTEFjI4sALMB8qN5ee67yZ6MeQWjd5iyS8lINAg',
            'privateKey': 'mp5xYHWtRTyCA63nZMvmJ_qmYO6A1klSotcoppSx-MI'
        };
        this.webpush.setVapidDetails(
            'mailto:example@yourdomain.org',
            this.vapidKeys.publicKey,
            this.vapidKeys.privateKey
        );
        this.notificationPayload = {
            'notification': {
                // 通知標題
                'title': '相機壞了',
                // 通知內文
                'body': new Date().toLocaleString(),
                // 通知圖示路徑
                'icon': 'assets/icons/icon-96x96.png',
                "dir": 'rtl',
                'actions': [{
                    'action': 'explore',
                    'title': 'test',
                },{
                    'action': 'explore',
                    'title': 'site',
                }]
            }
        };
    }

    async alert(sub:any, type:any) {
        console.log(JSON.stringify(sub));
        console.log(`Query = ${JSON.stringify(type)}`);
        console.log(this.notificationPayload);
        return new Promise((resolve, reject) => {
            this.webpush.sendNotification(sub, JSON.stringify(this.notificationPayload))
            .then(() => resolve({ message: 'sent successfully' }))
            .catch(err => {
                console.error('Error sending notification, reason: ', err);
                reject(err);
            });

        })
    }
}
