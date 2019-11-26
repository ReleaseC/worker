import { Controller, Get, Post, Res, Body, Response, Param, Query, HttpStatus, HttpException, Req } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as crypto from 'crypto';
import * as jsSHA from 'jssha';
import * as Http from 'http';
import { RetObject } from '../common/ret.component';
import { UsersService } from './users.service';
import { environment } from '../environment/environment';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  /**
    * @api {get} /users/find Find user 
    * @apiVersion 1.1.0
    * @apiName find 
    * @apiGroup users
    *
    * @apiParam {String} name User name
    * @apiParam {String} game_id User game id
    * 
    * @apiSuccess {Object} ret Return object
    * @apiSuccess {Number} ret.code return 0
    * @apiSuccess {Object} ret.result return result
    * 
    * @apiError {Object} ret Return object
    * @apiError {Number} ret.code return 1
    * @apiError {String} ret.description return description
    *
    */
  @Get('find')
  async find(
    @Res() res,
    @Query('name') name: string,
    @Query('game_id') game_id: string) {

    let ret = await this.usersService.find(name, game_id);
    res.status(HttpStatus.OK).json(ret);
  }

  /**
    * @api {get} /users/get_video Get video 
    * @apiVersion 1.1.0
    * @apiName get_video 
    * @apiGroup users
    *
    * @apiParam {String} game_id User game id
    * 
    * @apiSuccess {Object} ret Return object
    * @apiSuccess {Number} ret.code return 0
    * @apiSuccess {Object} ret.result return result
    * 
    * @apiError {Object} ret Return object
    * @apiError {Number} ret.code return 1
    * @apiError {String} ret.description return description
    *
    */
  @Get('get_video')
  async get_video(@Res() res, @Query('game_id') game_id: string) {
    let ret = await this.usersService.get_video(game_id);
    res.status(HttpStatus.OK).json(ret);
  }

  /**
    * @api {get} /users/auto_push Auto push
    * @apiVersion 1.0.0
    * @apiName auto_push 
    * @apiGroup users
    *
    * @apiParam {String} game_id User game id
    * 
    * @apiSuccess {Object} ret Return object
    * @apiSuccess {Number} ret.code return 0
    * @apiSuccess {String} ret.description return description
    *
    */
  @Get('auto_push')
  async auto_push(@Res() res, @Query('game_id') game_id: string) {
    let ret = await this.usersService.auto_push(game_id);
    console.log(ret);
    res.status(HttpStatus.OK).json(ret);
  }

  /**
    * @api {get} /users/auto_push Auto update
    * @apiVersion 1.1.0
    * @apiName auto_update 
    * @apiGroup users
    *
    * @apiParam {String} game_id User game id
    * @apiParam {String} game_time User gametime
    * 
    * @apiSuccess {Object} ret Return object
    * @apiSuccess {Number} ret.code return 0
    * @apiSuccess {Object} ret.result return result
    *
    */
  @Get('auto_update')
  async auto_update(@Res() res, @Query('game_id') game_id: string,@Query('game_time') game_time: string) {
    let ret = await this.usersService.auto_update(game_id,game_time);
    console.log(ret);
    res.status(HttpStatus.OK).json(ret);
  }

  /**
    * @api {get} /users/is_reservate Check is reservate
    * @apiVersion 1.1.0
    * @apiName is_reservate 
    * @apiGroup users
    *
    * @apiParam {String} code User code
    * @apiParam {String} state User state
    * 
    * @apiSuccess {Object} ret Return object
    * @apiSuccess {Number} ret.code return 0
    * @apiSuccess {Object} ret.result return result
    * 
    * @apiError {Object} ret Return object
    * @apiError {Number} ret.code return 1
    * @apiError {Object} ret.result return result
    *
    */
  @Get('is_reservate')
  async is_reservate(@Res() res, @Query('code') code: string, @Query('state') state: String) {
    let ret = await this.usersService.is_reservate(code, state);
    if (ret.code == 1) {
      res.redirect(environment.apiServer + '0008/#/login?openid=' + ret.description + '&is_reservate=' + ret.code + '&is_video=' + ret.result['is_video']+"&game_id="+ret.result['game_id']+"&name="+ret.result['name']+"&game_time="+ret.result['game_time']);
    } else {
      var wechat = JSON.stringify(ret.result)
      res.redirect(environment.apiServer + '0008/#/login?openid=' + ret.description + '&is_reservate=' + ret.code + '&wechat=' + wechat);
    }
  }

  /**
    * @api {post} /users/add_user Add user 
    * @apiVersion 1.1.0
    * @apiName add_user 
    * @apiGroup users
    *
    * @apiParam {String} game_id User game_id
    * @apiParam {String} name User name
    * @apiParam {String} wechat User wechat
    * 
    * @apiSuccess {Object} ret Return object
    * @apiSuccess {Number} ret.code return 0
    * 
    * @apiError {Object} ret Return object
    * @apiError {Number} ret.code return 1
    *
    */
  @Post('add_user')
  async add_user(@Res() res, @Body() data) {
    let ret = await this.usersService.add_user(data);
    console.log(ret)
    res.status(HttpStatus.OK).json(ret);

  }

  /**
    * @api {post} /users/get_users Get user 
    * @apiVersion 1.1.0
    * @apiName get_users 
    * @apiGroup users
    *
    * @apiParam {String} game_id User game_id
    * @apiParam {String} name User name
    * @apiParam {String} wechat User wechat
    * 
    * @apiSuccess {Object} ret Return object
    * @apiSuccess {Number} ret.code return 0
    * @apiSuccess {Object} ret.result return users
    *
    */
  @Post('get_users')
  async get_users(@Res() res,@Body() data ){
      let ret = await this.usersService.get_users(data);        
      res.status(HttpStatus.OK).json(ret);
  }

  /**
    * @api {get} /users/give_like Give like 
    * @apiVersion 1.1.0
    * @apiName give_like 
    * @apiGroup users
    *
    * @apiParam {String} game_id User game_id
    * 
    * @apiSuccess {Object} ret Return object
    * @apiSuccess {Number} ret.code return 0
    *
    */
  @Get('give_like')
  async give_like(@Res() res,@Query('game_id') game_id){
      let ret = await this.usersService.give_like(game_id);
      res.status(HttpStatus.OK).json(ret);
  }

  /**
    * @api {get} /users/user_test User test 
    * @apiVersion 1.1.0
    * @apiName give_like 
    * @apiGroup users
    *
    * @apiParam {String} game_id User game_id
    * 
    * @apiSuccess {Object} ret Return object
    * @apiSuccess {Number} ret.code return 0
    * 
    * @apiError {Object} ret Return object
    * @apiError {Number} ret.code return 1
    *
    */
  @Get('user_test')
  async user_test(@Res() res){
      let ret = await this.usersService.userTest();
      res.status(HttpStatus.OK).json(ret);
  }
}
