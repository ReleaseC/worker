import { Controller, Get, Post, Res, Body, Response, Param, Query, HttpStatus, HttpException, Req } from '@nestjs/common';
import { WechatPaymentService } from './wechat_payment.service';


@Controller('wechat_payment')
export class WechatPaymentController {
    constructor(private readonly WechatPaymentService: WechatPaymentService) {
    }

    /**
     * @api {post} /wechat_payment/create_wechatpay
     * @apiName create_wechatpay 
     * @apiGroup wechat_payment
     *
     * @apiParam {data} sidatateId
     *
     */
    @Post('create_wechatpay')
    async create_wechatpay( @Req() req, @Res() res, @Body() data) {
        let ret = await this.WechatPaymentService.create_wechatpay(data);
       // console.log(ret);
        res.status(HttpStatus.OK).json(ret);
    }

    /**
     * @api {post} /wechat_payment/create_ticket_order
     * @apiName create_ticket_order
     * @apiGroup wechat_payment
     * 
     * @apiParam {Object} data
     * @apiParam {String} data.siteId 
     * @apiParam {String} data.openId
     * @apiParam {String} data.taskId
     * 
     * @apiSuccess {Object} ret
     * @apiSuccess {Number} ret.code 0 
     * 
     * @apiError {Object} ret
     * @apiError {Number} ret.code 1
     * @apiError {String} ret.description
     */
    @Post('create_ticket_order')
    async create_ticket_order(@Res() res, @Body() data) {
        let ret = await this.WechatPaymentService.create_ticket_order(data);
        res.status(HttpStatus.OK).json(ret);
    }

    /**
     * @api {post} /wechat_payment/is_pay
     * @apiName is_pay 
     * @apiGroup wechat_payment
     *
     * @apiParam {data} sidatateId
     *
     */
    @Post('is_pay')
    async is_pay(@Res() res, @Body() data){
        let ret = await this.WechatPaymentService.is_pay(data);
        console.log(ret)
        res.status(HttpStatus.OK).send(ret);
    }

    @Post('update_pay_state')
    async update_pay_state(@Res() res, @Body() data) {
        let ret = await this.WechatPaymentService.update_pay_state(data);
        console.log(ret);
        res.status(HttpStatus.OK).send(ret);
    }

    /**
     * @api {get} /wechat_payment/get_order_list
     * @apiName get_order_list 
     * @apiGroup wechat_payment
     *
     * @apiParam {siteId} siteId
     *
     */
    @Get('get_order_list')
    async get_order_list(
        @Res() res,@Query('siteId') siteId : string) {

        let ret = await this.WechatPaymentService.get_order_list(siteId);
        res.status(HttpStatus.OK).send(ret);
    }

    /**
     * @api {get} /wechat_payment/get_users_order
     * @apiName get_users_order 
     * @apiGroup wechat_payment
     *
     * @apiParam {siteId} siteId
     * @apiParam {openid} openid
     * @apiParam {taskId} taskId
     *
     */
    @Get('get_users_order')
    async get_users_order(
        @Res() res,@Query('siteId') siteId : string,@Query('openid') openid : string,@Query('taskId') taskId : string) {

        let ret = await this.WechatPaymentService.get_users_order(siteId,openid,taskId);
        res.status(HttpStatus.OK).send(ret);
    }

}