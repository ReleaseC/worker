import { Controller, Get, Post, Res, Body, Query, HttpStatus, Req } from '@nestjs/common';
import { PartnerService } from './partner.service';
import {RetObject} from "../common/ret.component";


@Controller('partner')
export class PartnerController {

    constructor(private readonly partnerService: PartnerService) {}

    @Post('make_shoot')
    async make_shoot(@Res() res, @Body() data) {
        const ret = await this.partnerService.makeShoot(data);
        res.status(HttpStatus.OK).json(ret);
    }

    @Post('upload')
    async upload(@Res() res, @Body() data, @Req() req) {
        const ret = await this.partnerService.upload(data, req);
        res.status(HttpStatus.OK).json(ret);
    }



}
