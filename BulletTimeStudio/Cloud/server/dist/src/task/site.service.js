"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
let SiteSettings = [
    {
        siteId: "0001",
        name: "台北test",
        type: "BT-1",
        param: {
            "text": "",
            "background": "path/to/bgFile/in/ucloud",
            "mask": "greenscreen",
            "color": "green",
            "similarity": "0.17",
            "blend": "0.1",
            "framerate": "6",
            "loop": "1"
        },
        source: {},
        output: {
            "name": "",
            "path": "ucloud",
            "format": {
                "width": 1080,
                "height": 1920
            }
        },
        workerId: ''
    },
    {
        siteId: "0002",
        name: "上海test-1",
        type: "BT-1",
        param: {
            "text": "",
            "background": "path/to/bgFile/in/ucloud",
            "fps": "30",
            "mask": "greenscreen",
            "color": "green",
            "similarity": "0.17",
            "blend": "0.1",
            "framerate": "5",
            "loop": "0"
        },
        source: {},
        output: {
            "name": "",
            "path": "ucloud",
            "format": {
                "width": 1080,
                "height": 1920
            }
        },
        workerId: ''
    },
    {
        siteId: "0003",
        name: "上海test-2",
        type: "BT-1",
        param: {
            "text": "",
            "background": "path/to/bgFile/in/ucloud",
            "fps": "30",
            "mask": "none",
        },
        source: {},
        output: {
            "name": "",
            "path": "ucloud",
            "format": {
                "width": 1080,
                "height": 1920
            }
        },
        workerId: ''
    },
    {
        siteId: "0004",
        name: "安吉HelloKitty樂園",
        type: "BT-1",
        param: {
            "text": "",
            "background": "path/to/bgFile/in/ucloud",
            "fps": "30"
        },
        source: {},
        output: {
            "name": "",
            "path": "ucloud",
            "format": {
                "width": 1080,
                "height": 1920
            }
        },
        workerId: ''
    },
    {
        siteId: "0005",
        name: "鄉村路跑時光子彈",
        type: "BT-1",
        param: {
            "text": "",
            "background": "path/to/bgFile/in/ucloud",
            "fps": "30"
        },
        source: {},
        output: {
            "name": "",
            "path": "ucloud",
            "format": {
                "width": 1080,
                "height": 1920
            }
        },
        workerId: ''
    },
    {
        siteId: "0006",
        name: "鄉村路跑衝線視頻",
        type: "10sec-1",
        param: {
            "text": "",
            "background": "path/to/bgFile/in/ucloud",
            "fps": "30"
        },
        source: {},
        output: {
            "name": "",
            "path": "ucloud",
            "format": {
                "width": 1080,
                "height": 1920
            }
        },
        workerId: ''
    },
    {
        siteId: "0007",
        name: "武勝路跑時光子彈",
        type: "BT-1",
        param: {
            "text": "",
            "background": "path/to/bgFile/in/ucloud",
            "fps": "30"
        },
        source: {},
        output: {
            "name": "",
            "path": "ucloud",
            "format": {
                "width": 1080,
                "height": 1920
            }
        },
        workerId: ''
    },
    {
        siteId: "0008",
        name: "武勝路跑衝線視頻",
        type: "10sec-1",
        param: {
            "text": "",
            "background": "path/to/bgFile/in/ucloud",
            "fps": "30"
        },
        source: {},
        output: {
            "name": "",
            "path": "ucloud",
            "format": {
                "width": 1080,
                "height": 1920
            }
        },
        workerId: ''
    },
    {
        siteId: "0009",
        name: "大連馬拉松時光子彈",
        type: "BT-1",
        param: {
            "text": "",
            "background": "path/to/bgFile/in/ucloud",
            "fps": "30"
        },
        source: {},
        output: {
            "name": "",
            "path": "ucloud",
            "format": {
                "width": 1080,
                "height": 1920
            }
        },
        workerId: ''
    },
    {
        siteId: "0010",
        name: "大連馬拉松衝線視頻",
        type: "10sec-1",
        param: {
            "text": "",
            "background": "path/to/bgFile/in/ucloud",
            "fps": "30"
        },
        source: {},
        output: {
            "name": "",
            "path": "ucloud",
            "format": {
                "width": 1080,
                "height": 1920
            }
        },
        workerId: ''
    },
    {
        siteId: "0011",
        name: "杭州为爱行走時光子彈",
        type: "BT-1",
        param: {
            "text": "",
            "background": "path/to/bgFile/in/ucloud",
            "fps": "30"
        },
        source: {},
        output: {
            "name": "",
            "path": "ucloud",
            "format": {
                "width": 1080,
                "height": 1920
            }
        },
        workerId: ''
    },
    {
        siteId: "0012",
        name: "未来生活节",
        type: "BT-1",
        param: {
            "text": "",
            "background": "path/to/bgFile/in/ucloud",
            "fps": "30",
            "mask": "greenscreen",
            "color": "green",
            "similarity": "0.17",
            "blend": "0.1",
            "framerate": "5",
            "loop": "0"
        },
        source: {},
        output: {
            "name": "",
            "path": "ucloud",
            "format": {
                "width": 1080,
                "height": 1920
            }
        },
        workerId: ''
    },
    {
        siteId: "tpe_test_0001",
        name: "飛索",
        type: "RIFLE-1",
        param: {},
        source: {},
        output: {
            "name": "",
            "path": "ucloud",
            "format": {
                "width": 1080,
                "height": 1920
            }
        },
        workerId: ''
    },
    {
        siteId: "tpe_test_0002",
        name: "足球",
        type: "SOCCER-1",
        param: {},
        source: {},
        output: {
            "name": "",
            "path": "ucloud",
            "format": {
                "width": 1080,
                "height": 1920
            }
        },
        workerId: ''
    },
    {
        siteId: "0013",
        name: "環球港",
        type: "BT-1",
        param: {
            "text": "",
            "background": "path/to/bgFile/in/ucloud",
            "fps": "30",
            "mask": "greenscreen",
            "color": "green",
            "similarity": "0.17",
            "blend": "0.1",
            "framerate": "5",
            "loop": "0"
        },
        source: {},
        output: {
            "name": "",
            "path": "ucloud",
            "format": {
                "width": 1080,
                "height": 1920
            }
        },
        workerId: ''
    },
];
let SiteService = class SiteService {
    find(siteId) {
        try {
            let siteSettings = SiteSettings.filter(site => site.siteId === siteId);
            return siteSettings[0];
        }
        catch (e) {
            return null;
        }
    }
};
SiteService = __decorate([
    common_1.Component()
], SiteService);
exports.SiteService = SiteService;
//# sourceMappingURL=site.service.js.map