import { Controller, Get, Post, Res, Body, Query, HttpStatus, UseGuards } from '@nestjs/common';
import { DeviceService } from './device.service';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('device')
@UseGuards(RolesGuard)
export class DeviceController {
    
    constructor(
        private readonly deviceService: DeviceService
    ) { }

    /**
     * @api {get} /device/get_device_list Get devices lists (Construction)
     * @apiVersion 1.2.0
     * @apiName get_device_list 
     * @apiGroup device
     *
     * @apiParam {Object} type no use
     *
     * @apiSuccess {Object} ret Return device lists
     * 
     */
    @Get('get_device_list')
    async get_device_list(@Res() res, @Query() type) {
        const ret = await this.deviceService.getDeviceList(type);
        res.status(HttpStatus.OK).json({ device: ret });
    }

    /**
     * @api {post} /device/add_device Add devices lists (Construction)
     * @apiVersion 1.2.0
     * @apiName add_device 
     * @apiGroup device
     *
     * @apiParam {Object} data no use
     *
     * @apiSuccess {Object} ret Return device lists
     * 
     */
    @Post('add_device')
    async add_device(@Res() res, @Body() data) {
        const ret = await this.deviceService.addDevice(data);
        res.status(HttpStatus.OK).json({ device: ret });
    }

    /**
     * @api {get} /device/get_device_status Get devices status
     * @apiVersion 1.1.0
     * @apiName get_device_status 
     * @apiGroup device
     *
     * @apiParam {String} siteId Site ID
     *
     * @apiSuccess {Object} ret Return object
     * @apiSuccess {Number} ret.code return 0
     * @apiSuccess {Object} ret.result return account lists
     * 
     * @apiError {Object} ret Return object
     * @apiError {Number} ret.code return 1
     * @apiError {String} ret.description error description
     * 
     */
    @Get('get_device_status')
    async get_device_status(@Res() res, @Query("siteId") siteId) {
        let ret = await this.deviceService.get_device_status(siteId);
        res.status(HttpStatus.OK).json({ device: ret });
    }


    /**
     * @api {get} /device/cmd 转发 cmd socket事件
     * @apiVersion 1.1.0
     * @apiName cmd
     * @apiGroup device
     *
     *
     * @apiSuccess {Object} ret Return object
     * @apiSuccess {Number} ret.code return 0
     * @apiSuccess {Object} ret.result return account lists
     *
     * @apiError {Object} ret Return object
     * @apiError {Number} ret.code return 1
     * @apiError {String} ret.description error description
     *
     */
    @Get('cmd')
    async send_cmd( @Res() res, @Query() query) {
        const ret = await this.deviceService.sendCmd(query);
        res.status(HttpStatus.OK).json(ret);
    }

    /**
     * @api {get} /device/update_attent 活动关注设备
     * @apiVersion 1.1.0
     * @apiName update_attent
     * @apiGroup device
     *
     *
     * @apiSuccess {Object} ret Return object
     * @apiSuccess {Number} ret.code return 0
     * @apiSuccess {Object} ret.result return account lists
     *
     * @apiError {Object} ret Return object
     * @apiError {Number} ret.code return 1
     * @apiError {String} ret.description error description
     *
     */
    @Get('update_attent')
    async add_attent( @Res() res, @Query() query) {
        const ret = await this.deviceService.updateAttent(query);
        res.status(HttpStatus.OK).json(ret);
    }

    // 通知拍摄上传
    @Get('make_move')
    async make_move( @Res() res, @Query() query) {
        const ret = await this.deviceService.makeMove(query);
        res.status(HttpStatus.OK).json(ret);
    }


    // 通知mome更新状态
    @Get('update_status')
    async update_status( @Res() res, @Query() query) {
        const ret = await this.deviceService.updateStatus(query);
        res.status(HttpStatus.OK).json(ret);
    }









    
}