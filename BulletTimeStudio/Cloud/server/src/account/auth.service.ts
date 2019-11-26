import * as jwt from 'jsonwebtoken';
import { Component } from '@nestjs/common';
import { AccountService } from './account.service';
import { RedisService } from '../common/redis.service'
import { RetObject } from '../common/ret.component';
var uuidv1 = require('uuid/v1');

@Component()
export class AuthService {
  constructor() { }

  public formatDate(time) {
    // 格式化日期，获取今天的日期
    const Dates = new Date( time );
    const year: number = Dates.getFullYear();
    const month: any = ( Dates.getMonth() + 1 ) < 10 ? '0' + ( Dates.getMonth() + 1 ) : ( Dates.getMonth() + 1 );
    const day: any = Dates.getDate() < 10 ? '0' + Dates.getDate() : Dates.getDate();
    return year + '-' + month + '-' + day;
  };

  async createToken(account) {
    let uuid = uuidv1().replace(/-/g, '');
    const expiresIn = 60 * 60, secretOrKey = uuid;
    const payload = { account: account, role: 'admin' };
    const token = jwt.sign(payload, secretOrKey, { expiresIn });
    const expire = this.formatDate(new Date().getTime() + ( 1000 * 24 * expiresIn )); // 3600

    console.log('expire=' + expire);
    const cacheData = {
      'account': account,
      'token': token,
      'expireTime': expire
    };
    RedisService.setCache(token, JSON.stringify(cacheData));

    return {
      expires_in: expiresIn,
      access_token: token,
    };
  }

  async authAccessToken(token) {
    let ret: RetObject = new RetObject;

    // ToDo:
    // const getData = JSON.parse(await RedisService.getCache(token));
    // if(getData.token === token){
    //   const expireTime = getData.expireTime;
    //   const currentTime = this.formatDate(new Date().getTime());
    //   if(expireTime === currentTime){
    //     ret.code = 1;
    //     ret.description = "access token expire, please re-login";
    //   }else{
    //     ret.code = 0;
    //     ret.description = "access token pass";
    //   }
    // }else{
    //   ret.code = 1;
    //   ret.description = "access denied";
    // }

    ret.code = 0;
    ret.description = "access token pass";
    return ret;
  }
}
