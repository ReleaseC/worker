import { Controller, Get, Post, Res, Body, Query, HttpStatus } from '@nestjs/common';
import { WeparkService } from './wepark.service';

@Controller('wepark')
export class WeparkController {

    constructor(private readonly weparkService: WeparkService) {}

    @Post('OnEvent')
    async onEvent(@Res() res, @Body() data) {
        const ret = await this.weparkService.onEvent(data);
        res.status(HttpStatus.OK).json(ret);
    }

    @Post('onUserEvent')
    async onUserEvent(@Res() res, @Body() data) {

        const ret = await this.weparkService.onUserEvent(data);
        res.status(HttpStatus.OK).json(ret);

    }
}
