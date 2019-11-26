"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
let NotificationService = class NotificationService {
    constructor() {
        this.webpush = require('web-push');
        this.vapidKeys = {
            'publicKey': 'BLnVk1MBGFBW4UxL44fuoM2xxQ4o9CuxocVzKn9UVmnXZEyPCTEFjI4sALMB8qN5ee67yZ6MeQWjd5iyS8lINAg',
            'privateKey': 'mp5xYHWtRTyCA63nZMvmJ_qmYO6A1klSotcoppSx-MI'
        };
        this.webpush.setVapidDetails('mailto:example@yourdomain.org', this.vapidKeys.publicKey, this.vapidKeys.privateKey);
        this.notificationPayload = {
            'notification': {
                'title': '相機壞了',
                'body': new Date().toLocaleString(),
                'icon': 'assets/icons/icon-96x96.png',
                "dir": 'rtl',
                'actions': [{
                        'action': 'explore',
                        'title': 'test',
                    }, {
                        'action': 'explore',
                        'title': 'site',
                    }]
            }
        };
    }
    alert(sub, type) {
        return __awaiter(this, void 0, void 0, function* () {
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
            });
        });
    }
};
NotificationService = __decorate([
    common_1.Component(),
    __metadata("design:paramtypes", [])
], NotificationService);
exports.NotificationService = NotificationService;
//# sourceMappingURL=notification.service.js.map