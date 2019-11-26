//import { User } from './interfaces/user.interface';
//import { Model } from 'mongoose';
import * as dns from 'dns';
import * as OS from 'os';
import * as timers from 'timers';
import { Component, Inject, Controller, Get, Post, Res, Body, Response, Param, Query, HttpStatus, HttpException, Req } from '@nestjs/common';
import { RetObject } from '../common/ret.component';
//import { CreateUserDto } from './dto/create-user.dto';
import { Global } from '../common/global.component';
import * as FS from 'fs';
import axios from 'axios';

@Component()
export class RecordService {
 
  async post_test(data) {
    let ret: RetObject = new RetObject;
    ret.code = 1;
    ret.result = data;
    return ret;
  }

  async get_test(id) {
    
    console.log(Global.getSocket());
    let ret: RetObject = new RetObject;
    ret.code = 1;
    ret.description = id;
    return ret;
  }

  async start_record(file_name,id) {
    var key = id;
    //Global.getSocket()[key].broadcast.emit('start_record',file_name);
    Global.getSocket()[key].emit('start_record',id);
    
  }
}
