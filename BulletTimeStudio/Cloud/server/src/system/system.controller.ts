// @ts-ignore
import { Controller, Get, Post, Res, Body, HttpStatus, Query } from '@nestjs/common';
import { SystemService } from './system.service';

@Controller('system')
export class SystemController {
  constructor(private readonly systemService: SystemService) { }

  /**
   * @api {get} /system/version Return version and name
   * @apiVersion 1.1.0
   * @apiName version 
   * @apiGroup system
   *
   * @apiSuccess {version} version
   * @apiSuccess {name} name
   *
   */
  @Get('version')
  version(@Res() res) {
    res.status(HttpStatus.OK).json({version: '1.1.0', name: 'Short Video Api Server'});
  }

  /**
   * @api {get} /system/get_git_commit_id return the last one commit id
   * @apiVersion 1.0.0
   * @apiName get_git_commit_id
   * @apiGroup system
   * 
   * @apiSuccess {Object} ret
   * @apiSuccess {Number} ret.code 0 
   * @apiSuccess {String} ret.description commit id
   * 
   * @apiError {Object} ret
   * @apiError {Number} ret.code not 1
   * @apiError {String} ret.description the error detail of exec
   */
  @Get('get_git_commit_id')
  async get_git_commit_id(@Res() res) {
    let ret = await this.systemService.getGitCommitId();
    res.status(HttpStatus.OK).json(ret);
  }

  /**
   * @api {get} /system/edgeversion Return edge version
   * @apiVersion 1.1.0
   * @apiName edgeversion 
   * @apiGroup system
   *
   * @apiSuccess {edgeadmin} edgemin version
   * @apiSuccess {edgeserver} edgeserver version
   * @apiSuccess {time} time
   */
  @Get('edgeversion')
  edgeversion(@Res() res) {
    res.status(HttpStatus.OK).json({"edgeadmin": '1.1.0', "edgeserver": '1.1.0', "time":"2018-6-19 11:35:20"});
  }

  /**
   * @api {post} /system/get_apk_version Get newest soccer apk version (Obsolete)
   * @apiVersion 1.0.0
   * @apiName get_apk_version 
   * @apiGroup system
   *
   * @apiParam {type} type
   * @apiParam {subType} subType
   *
   * @apiSuccess {ret} apk version
   */
  @Post('get_apk_version')
  async get_apk_version( @Res() res, @Body('type') type: string, @Body('subType') subType: string) {
    console.log('get_apk_version');
    const fs = require('fs');
    const path = require('path');
    const filePath = path.resolve('../../output/apk/', 'version.json');
    console.log('filePath='+filePath);
    const ret = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    res.status(HttpStatus.OK).json(ret);
  }

  /**
   * @api {post} /system/save_apk_version Update specific device soccer apk version (Obsolete)
   * @apiVersion 1.0.0
   * @apiName save_apk_version 
   * @apiGroup system
   *
   * @apiParam {Object} data Client object data
   * @apiParam {String} data.siteId Client siteId: data.siteId
   * @apiParam {String} data.deviceId Client deviceId: data.deviceId
   * @apiParam {String} data.role Client role: data.role
   * @apiParam {String} data.apkVersion Specific device's apkVersion: data.siteId
   *
   * @apiSuccess {Object} ret Return object
   * @apiSuccess {Number} ret.code return 0
   * @apiSuccess {Object} ret.result return result
   * 
   * @apiError {Object} ret Return object
   * @apiError {Number} ret.code return 1
   * @apiError {String} ret.description return description
   * 
   * @apiError {Object} ret Return object
   * @apiError {Number} ret.code return -1
   * @apiError {Object} ret.result return result
   * 
   */
  @Post('save_apk_version')
  async save_apk_version( @Res() res, @Body('siteId') siteId: string, @Body('deviceId') deviceId: string, @Body('role') role: string, @Body('apkVersion') apkVersion: string) {
    const ret = await this.systemService.saveApkVersion(siteId, deviceId, role, apkVersion);
    res.status(HttpStatus.OK).json(ret);
  }

  /**
   * @api {post} /system/get_apk_version_from_db Get all device's apk version (Obsolete)
   * @apiVersion 1.0.0
   * @apiName get_apk_version_from_db 
   * @apiGroup system
   * 
   * @apiParam {Array} siteIds 站点ID列表
   *
   * @apiSuccess {Object} ret device's apk version
   *
   */
  @Post('get_apk_version_from_db')
  async get_apk_version_from_db( @Res() res, @Body() data) {
    const ret = await this.systemService.getApkVersionFromDb(data);
    res.status(HttpStatus.OK).json(ret);
  }

  /**
   * @api {post} /system/reploy 自动部署接口[仅限bt-dev-1服务器][备用]
   * @apiName reploy
   * @apiVersion 1.0.0
   * @apiGroup system
   *
   * @apiSuccess {HTML} 502 Bad Gateway
   * 
   * @apiError {Object} ret
   * @apiError {Number} ret.code 1
   * @apiError {String} ret.description the stderr string
   */
  @Post('reploy')
  async reploy(@Res() res) {
    let ret = await this.systemService.reploy();
    res.status(HttpStatus.OK).json(ret);
  }
}
