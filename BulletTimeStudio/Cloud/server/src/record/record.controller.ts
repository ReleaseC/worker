import { Controller, Get, Post, Res, Body, Response, Param, Query, HttpStatus, HttpException, Req } from '@nestjs/common';
//import { CreateUserDto } from './dto/create-user.dto';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as crypto from 'crypto';
//import * as jsSHA from 'jssha';
import * as Http from 'http';
import { RetObject } from '../common/ret.component';
import { RecordService } from './record.service';

@Controller('record')
export class RecordController {
  constructor(private readonly recordService: RecordService) { }

  /**
    * @api {get} /notification/post_test post_test (Obsolete)
    * @apiVersion 1.0.0
    * @apiName post_test 
    * @apiGroup record
    * 
    */
  @Post('post_test')
  async Post_test(
    @Res() res,
    @Body() data ) {
    let ret = await this.recordService.post_test(data);
    res.status(HttpStatus.OK).json(ret);

  }

  /**
    * @api {get} /notification/get_test get_test (Obsolete)
    * @apiVersion 1.0.0
    * @apiName get_test 
    * @apiGroup record
    * 
    */
  @Get('get_test')
  async Get_test(
    @Res() res,
    @Query('id') id: string) {

    let ret = await this.recordService.get_test(id);
    res.status(HttpStatus.OK).json(ret);
  }

  /**
    * @api {get} /notification/start_record start_record (Obsolete)
    * @apiVersion 1.0.0
    * @apiName start_record 
    * @apiGroup record
    * 
    */
  @Get('start_record')
  async Start_record(
    @Res() res,@Query('file_name') file_name,@Query('id') id) {
    let ret = await this.recordService.start_record(file_name,id);
    res.status(HttpStatus.OK).json(ret);
  }
}
