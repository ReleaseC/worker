import { Controller, Get, Res, HttpStatus, Post, Body, Query } from '@nestjs/common';
import { CustomizeService } from './customize.service';

@Controller('customize')
export class CustomizeController {
    constructor(
        private readonly customizeService: CustomizeService,
    ) { }

    @Get('get_text_template')
    async get_text_template(@Res() res) {
        const ret = await this.customizeService.getTextTemplate();
        res.status(HttpStatus.OK).json(ret);
    }

    @Get('get_video_template')
    async get_video_template(@Res() res) {
        const ret = await this.customizeService.getVideoTemplate();
        res.status(HttpStatus.OK).json(ret);
    }

    @Get('get_audio_template')
    async get_audio_template(@Res() res) {
        const ret = await this.customizeService.getAudioTemplate();
        res.status(HttpStatus.OK).json(ret);
    }

}
