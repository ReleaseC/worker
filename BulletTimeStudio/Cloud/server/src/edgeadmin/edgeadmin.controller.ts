import { Controller, Get, Post, Res, Body, Response, Param, Query, HttpStatus, HttpException, Req } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as crypto from 'crypto';
import * as jsSHA from 'jssha';
import * as Http from 'http';
import { RetObject } from '../common/ret.component';
import { EdgeadminService } from './edgeadmin.service';
import { environment } from '../environment/environment';

@Controller('edgeadmin')
export class EdgeadminController {
  constructor(private readonly edgeadminService: EdgeadminService) { }

  //查询是否是参赛者
  /**
    * @api {post} /edgeadmin/adjust_data adjust_data (Obsolete)
    * @apiVersion 1.0.0
    * @apiName adjust_data 
    * @apiGroup edgeadmin
    * 
    */
  @Post('adjust_data')
  async adjust_data(
    @Res() res,
    @Body() data) {
    let ret = await this.edgeadminService.adjust_data(data);
    res.status(HttpStatus.OK).json(ret);
  }
}
