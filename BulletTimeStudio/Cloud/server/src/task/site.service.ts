import { Component, Inject, Controller, Get, Post, Res, Body, Response, Param, Query, HttpStatus, HttpException, Req } from '@nestjs/common';
import { Model } from 'mongoose';

let SiteSettings = [
    {
        siteId: "0001",
        name: "台北test",
        type: "BT-1",
        param: {      // TODO: from UI setting of this site
            "text": "",
            "background": "path/to/bgFile/in/ucloud",
            "mask": "greenscreen",
            "color": "green",
            "similarity": "0.17",
            "blend": "0.1",
            "framerate": "6",
            "loop": "1"
        },
        source: {

        },
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
        param: {      // TODO: from UI setting of this site
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
        source: {

        },
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
        param: {      // TODO: from UI setting of this site
            "text": "",
            "background": "path/to/bgFile/in/ucloud",
            "fps": "30",
            "mask": "none",
        },
        source: {

        },
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
        param: {      // TODO: from UI setting of this site
            "text": "",
            "background": "path/to/bgFile/in/ucloud",
            "fps": "30"
        },
        source: {

        },
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
        param: {      // TODO: from UI setting of this site
            "text": "",
            "background": "path/to/bgFile/in/ucloud",
            "fps": "30"
        },
        source: {

        },
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
        param: {      // TODO: from UI setting of this site
            "text": "",
            "background": "path/to/bgFile/in/ucloud",
            "fps": "30"
        },
        source: {

        },
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
        param: {      // TODO: from UI setting of this site
            "text": "",
            "background": "path/to/bgFile/in/ucloud",
            "fps": "30"
        },
        source: {

        },
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
        param: {      // TODO: from UI setting of this site
            "text": "",
            "background": "path/to/bgFile/in/ucloud",
            "fps": "30"
        },
        source: {

        },
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
        param: {      // TODO: from UI setting of this site
            "text": "",
            "background": "path/to/bgFile/in/ucloud",
            "fps": "30"
        },
        source: {

        },
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
        param: {      // TODO: from UI setting of this site
            "text": "",
            "background": "path/to/bgFile/in/ucloud",
            "fps": "30"
        },
        source: {

        },
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
        param: {      // TODO: from UI setting of this site
            "text": "",
            "background": "path/to/bgFile/in/ucloud",
            "fps": "30"
        },
        source: {

        },
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
        param: {      // TODO: from UI setting of this site
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
        source: {

        },
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
        param: {

        },
        source: {

        },
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
        param: {

        },
        source: {

        },
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
        param: {      // TODO: from UI setting of this site
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
        source: {

        },
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

@Component()
export class SiteService {

    find(siteId: string): Object {
        try {
            let siteSettings = SiteSettings.filter(site => site.siteId === siteId);
            return siteSettings[0];
        }
        catch (e) {
            return null;
        }
    }
}
