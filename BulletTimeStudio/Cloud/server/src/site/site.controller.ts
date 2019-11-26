import { Controller, Get, Res, HttpStatus, Post, Body, Query } from '@nestjs/common';
import { SiteService } from './site.service';
import { SitesProviders } from './site.provider';
import { RetObject } from 'common/ret.component';

@Controller('site')
export class SiteController {
  constructor(private readonly siteService: SiteService) { }

  /**
   * @api {post} /site/add_site Create site setting
   * @apiVersion 1.1.0
   * @apiName add_site 
   * @apiGroup site
   *
   * @apiParam {Object} data Client object data
   * @apiParam {String} data.type Client data type: data.type(soccer/bt)
   * 
   * @apiSuccess {Object} ret Return object
   * @apiSuccess {Number} ret.code return 0
   * @apiSuccess {String} ret.description return description
   *
   * @apiError {Object} ret Return object
   * @apiError {Number} ret.code return 1
   * @apiError {String} ret.description error description
   * 
   * @apiError {Object} ret Return object
   * @apiError {Number} ret.code return 1
   * @apiError {Object} ret.result return result
   */
  @Post('add_site')
  async add_site( @Res() res, @Body() data) {
    const ret = await this.siteService.addSite(data);
    res.status(HttpStatus.OK).json(ret);
  }

  /**
   * @api {post} /site/get_site_names Get all site names 
   * @apiVersion 1.1.0
   * @apiName get_site_names 
   * @apiGroup site
   *
   * @apiParam {Object} data Client object data
   * @apiParam {String} data.type Client data type: data.type(soccer/bt)
   *
   * @apiSuccess {Object} ret return site settings
   * 
   */
  @Post('get_site_names')
  async get_site_names(@Res() res, @Body() data) {
    const ret = await this.siteService.getSiteNames(data);
    res.status(HttpStatus.OK).json(ret);
  }

  // // Need access token to find out relative group IDs
  // @Post('get_group_lists')
  // async get_group_lists(@Res() res, @Body() data) {
  //   const ret = await this.siteService.getGroupLists(data);
  //   res.status(HttpStatus.OK).json(ret);
  // }

  /**
   * @api {post} /site/get_site_lists Get all soccer site details (Obsolete)
   * @apiVersion 1.0.0
   * @apiName get_site_lists 
   * @apiGroup site
   *
   * @apiParam {Object} data Client object data
   * @apiParam {String} data.account Client account: data.account 
   *
   * @apiSuccess {Object} ret return array of all site details
   * 
   */
  @Post('get_site_lists')
  async get_site_lists(@Res() res, @Body() data) {
    const ret = await this.siteService.getSiteLists(data);
    res.status(HttpStatus.OK).json(ret);
  }

  /**
   * @api {post} /site/get_site_detail Get site details
   * @apiVersion 1.1.0
   * @apiName get_site_detail 
   * @apiGroup site
   *
   * @apiParam {Object} data Client object data
   * @apiParam {String} data.type Client data type: data.type(soccer/bt)
   * 
   * @apiSuccess {Object} ret Return object
   * @apiSuccess {Number} ret.code return 0
   * @apiSuccess {Object} ret.result return specific site details
   * 
   */
  @Post('get_site_detail')
  async get_site_detail(@Res() res, @Body() data) {
    const ret = await this.siteService.getSiteDetail(data);
    res.status(HttpStatus.OK).json(ret);
  }

  /**
   * @api {post} /site/update_site Update specific site details
   * @apiVersion 1.1.0
   * @apiName update_site 
   * @apiGroup site
   *
   * @apiParam {Object} data Client object data
   * @apiParam {String} data.type Client data type: data.type(soccer/bt)
   *
   * @apiSuccess {Object} ret Return object
   * @apiSuccess {Number} ret.code return 0
   * @apiSuccess {String} ret.description return description
   * 
   * @apiError {Object} ret Return object
   * @apiError {Number} ret.code return 1
   * @apiError {String} ret.description return description
   * 
   */
  @Post('update_site')
  async update_site( @Res() res, @Body() data) {
    const ret = await this.siteService.updateSite(data);
    res.status(HttpStatus.OK).json(ret);
  }

  /**
   * @api {get} /site/get_template
   * @apiVersion 1.1.0
   * @apiName get_template 
   * @apiGroup site
   *
   * @apiSuccess {Object} ret Return object
   * @apiSuccess {Number} ret.code return 0
   * @apiSuccess {String} ret.description return description
   *
   */
  @Get('get_template')
  async get_template(@Res() res) {
    const ret = await this.siteService.getTemplate();
    res.status(HttpStatus.OK).json(ret);
  }

  /**
   * @api {post} /site/add_template
   * @apiVersion 1.1.0
   * @apiName add_template 
   * @apiGroup site
   *
   * @apiSuccess {Object} ret Return object
   * @apiSuccess {Number} ret.code return 0
   * @apiSuccess {String} ret.description return description
   *
   */
  @Post('add_template')
  async add_template(@Res() res, @Body() data) {
    const ret = await this.siteService.addTemplate(data);
    res.status(HttpStatus.OK).json(ret);
  }

  /**
   * @api {post} /site/change_DeviceConfig Update new device config in specific site
   * @apiVersion 1.1.0
   * @apiName change_DeviceConfig 
   * @apiGroup site
   *
   * @apiParam {Object} data Client object data
   * @apiParam {String} data.siteId Client siteId: data.siteId
   * @apiParam {Object} data.deviceConfig Client deviceConfig: data.deviceConfig
   *
   * @apiSuccess {Object} ret Return object
   * @apiSuccess {Number} ret.code return 0
   * @apiSuccess {String} ret.description return description
   * 
   * @apiError {Object} ret Return object
   * @apiError {Number} ret.code return 1
   * @apiError {String} ret.description return description
   * 
   */
  @Post('change_DeviceConfig')
  async changeDeviceConfig(@Res() res, @Body() data) {
    const ret = await this.siteService.changeDeviceConfig(data);
    res.status(HttpStatus.OK).json(ret);
  }

  /**
   * @api {get} /site/get_CameraSetting Get camera setting
   * @apiVersion 1.1.0
   * @apiName get_CameraSetting 
   * @apiGroup site
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
  @Get('get_CameraSetting')
  async get_CameraSetting(@Res() res) {
    const ret = await this.siteService.getCameraSetting();
    res.status(HttpStatus.OK).json(ret);
  }

  /**
   * @api {post} /site/add_camera_setting Add new camera setting
   * @apiVersion 1.1.0
   * @apiName add_camera_setting 
   * @apiGroup site
   *
   * @apiParam {Object} data Client object data
   * @apiParam {String} siteId siteId
   * @apiParam {Object} cameraSetting cameraSetting:{ role position rotation scale }, example{"role": "VideoCam", "position": "0", "rotation": "90", "scale": "1.2"}
   *
   * 
   * @apiSuccess {Object} ret Return object
   * @apiSuccess {Number} ret.code return 0
   * @apiSuccess {Object} ret.result return result
   *
   */
  @Post('add_camera_setting')
  async add_CameraSetting(@Res() res, @Body() data) {
    const ret = await this.siteService.addCameraSetting(data);
    res.status(HttpStatus.OK).json(ret);
  }

  /**
   * @api {get} /site/get_account_match_sites Get all account_match_sites details (Obsolete)
   * @apiVersion 1.0.0
   * @apiName get_account_match_sites 
   * @apiGroup site
   *
   * @apiSuccess {Object} ret Return object
   * @apiSuccess {Number} ret.code return 0
   * @apiSuccess {Object} ret.result return result
   *
   */
  @Get('get_account_match_sites')
  async get_account_match_sites(@Res() res) {
    const ret = await this.siteService.getAccountMatchSites();
    res.status(HttpStatus.OK).json(ret);
  }

  /**
   * @api {post} /site/add_account_match_sites Add new account_match_sites setting (Obsolete)
   * @apiVersion 1.0.0
   * @apiName add_account_match_sites 
   * @apiGroup site
   *
   * @apiParam {Object} data Client object data
   * @apiParam {String} data.siteId Client siteId: data.siteId
   * @apiParam {String} data.account Client account: data.account
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
  @Post('add_account_match_sites')
  async add_account_match_sites(@Res() res, @Body() data) {
    console.log('controller account_match_sites')
    const ret = await this.siteService.addAccountMatchSites(data);
    res.status(HttpStatus.OK).json(ret);
  }

  /**
   * @api {get} /site/get_binding_table Get all binding tables details (Obsolete)
   * @apiVersion 1.0.0
   * @apiName get_binding_table 
   * @apiGroup site
   *
   * @apiSuccess {Object} ret Return object
   * @apiSuccess {Number} ret.code return 0
   * @apiSuccess {Object} ret.result return result
   *
   */
  @Get('get_binding_table')
  async get_binding_table(@Res() res) {
    const ret = await this.siteService.getBindingTable();
    res.status(HttpStatus.OK).json(ret);
  }

  /**
   * @api {post} /site/set_binding_table Set a new binding table (Obsolete)
   * @apiVersion 1.0.0
   * @apiName set_binding_table 
   * @apiGroup site
   *
   * @apiParam {Object} data Client object data
   * @apiParam {String} data.siteId Client siteId: data.siteId
   * @apiParam {String} data.deviceId Client device id: data.deviceId
   * @apiParam {String} data.role Client device role: data.role
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
  @Post('set_binding_table')
  async set_binding_table(@Res() res, @Body() data) {
    const ret = await this.siteService.setBindingTable(data);
    res.status(HttpStatus.OK).json(ret);
  }

  @Post('get_heartbeat_redis')
  async get_heartbeat_redis(@Res() res, @Body() data) {
    // console.log('controller get_heartbeat_redis')
    const ret = await this.siteService.getHeartbeatRedis(data);
    res.status(HttpStatus.OK).json(ret);
  }

  @Post('set_heartbeat_redis')
  async set_heartbeat_redis(@Res() res, @Body() data) {
    // console.log('controller set_heartbeat_redis')
    const ret = await this.siteService.setHeartbeatRedis(data);
    res.status(HttpStatus.OK).json(ret);
  }

  // ------------------------ V2 Site ------------------------------
  /**
   * @api {post} /site/v2/post_site_setting Create site setting by type
   * @apiVersion 1.1.0
   * @apiName post_site_setting 
   * @apiGroup site/v2/
   *
   * @apiParam {Object} body Client object body
   * @apiParam {String} body.type Client data type: body.type(soccer/bt)
   * 
   * @apiSuccess {Object} ret Return object
   * @apiSuccess {Number} ret.code return 0
   * @apiSuccess {String} ret.description return description
   *
   * @apiError {Object} ret Return object
   * @apiError {Number} ret.code return 1
   * @apiError {String} ret.description error description
   * 
   */
  @Post('v2/post_site_setting')
  async post_site_setting( @Res() res, @Body() body) {
    const ret = await this.siteService.postSiteSetting(body);
    res.status(HttpStatus.OK).json(ret);
  }

  /**
   * @api {get} /site/v2/get_site_setting Get all site setting by type
   * @apiVersion 1.1.0
   * @apiName get_site_setting 
   * @apiGroup site/v2/
   *
   * @apiParam {String} query Client data type(soccer/bt)
   * 
   * @apiSuccess {Object} ret Return object
   * @apiSuccess {Number} ret.code return 0
   * @apiSuccess {Object} ret.result return specific site details
   * 
   * @apiError {Object} ret Return object
   * @apiError {Number} ret.code return 1
   * @apiError {String} ret.description error description
   * 
   */
  @Get('v2/get_site_setting')
  async get_site_setting(@Res() res, @Query() query) {
    const ret = await this.siteService.getSiteSetting(query);
    res.status(HttpStatus.OK).json(ret);
  }

  /**
   * @api {post} /site/v2/get_site_setting_info Get site setting by siteId
   * @apiVersion 1.1.0
   * @apiName get_site_setting_info 
   * @apiGroup site/v2/
   *
   * @apiParam {Object} body Client object body
   * @apiParam {String} body.type Client data type: body.type(SOCCOR/BT/BASKETBALL)
   * @apiParam {String} body.siteId user siteId
   * @apiParam {String} body.accesstoken user accesstoken
   * 
   * @apiSuccess {Object} ret Return object
   * @apiSuccess {Number} ret.code return 0
   * @apiSuccess {Object} ret.result return specific site details
   * 
   * @apiError {Object} ret Return object
   * @apiError {Number} ret.code return 1
   * @apiError {String} ret.description error description
   * 
   */
  @Post('v2/get_site_setting_info')
  async get_site_setting_info(@Res() res, @Body() body) {
    const ret = await this.siteService.getSiteSettingInfo(body);
    res.status(HttpStatus.OK).json(ret);
  }

  /**
   * @api {post} /site/v2/update_site_setting Update site setting by type
   * @apiVersion 1.1.0
   * @apiName update_site_setting 
   * @apiGroup site/v2/
   *
   * @apiParam {Object} body Client object body
   * @apiParam {String} body.type Client data type: body.type(soccer/bt/basketball)
   * 
   * @apiSuccess {Object} ret Return object
   * @apiSuccess {Number} ret.code return 0
   * @apiSuccess {String} ret.description return description
   * 
   * @apiError {Object} ret Return object
   * @apiError {Number} ret.code return 1
   * @apiError {String} ret.description error description
   * 
   */
  @Post('v2/update_site_setting')
  async update_site_setting(@Res() res, @Body() body) {
    const ret = await this.siteService.updateSiteSetting(body);
    res.status(HttpStatus.OK).json(ret);
  }

  /**
   * @api {get} /site/v2/bind Binding device on site setting DeviceConfig
   * @apiVersion 1.1.0
   * @apiName bind 
   * @apiGroup site/v2/
   *
   * @apiParam {String} access_token Client assess_token
   * @apiParam {String} siteId Client siteId
   * @apiParam {String} type Client type (SOCCOR/BASKETBALL)
   * @apiParam {String} deviceId Client deviceId
   * @apiParam {String} role Client role (admin/GoalCam/VideoCam)
   * @apiParam {String} position Client position (0/1/2)
   * 
   * @apiSuccess {Object} ret Return object
   * @apiSuccess {Number} ret.code return 0
   * @apiSuccess {String} ret.description return description
   * 
   * @apiError {Object} ret Return object
   * @apiError {Number} ret.code return 1
   * @apiError {String} ret.description error description
   * 
   */
  @Get('v2/bind')
  async bind(@Res() res, @Query() query) {
    const ret = await this.siteService.bind(query);
    res.status(HttpStatus.OK).json(ret);
  }

  /**
   * @api {get} /site/v2/prebind 查询指定站点、指定role/position的绑定情况
   * @apiVersion 1.0.0
   * @apiName prebind 
   * @apiGroup site/v2/
   *
   * @apiParam {String} accessToken Client assessToken
   * @apiParam {String} siteId Client siteId
   * @apiParam {String} role Client role (admin/GoalCam/VideoCam)
   * @apiParam {String} position Client position (0/1/2)
   * 
   * @apiSuccess {Object} ret Return object
   * @apiSuccess {Object} ret.result 
   * @apiSuccess {String} ret.result.deviceId 
   * 
   * @apiError {Object} ret Return object
   * @apiError {Object} ret.result
   * @apiError {String} ret.result.device 
   * 
   * @apiSuccessExample Success-Response:
   *  HTTP/1.1 200 OK
   * 
   *  { 
   *    "device": ""
   *  }
   * 
   */
  @Get('v2/prebind')
  async prebind(@Res() res, @Query() query) {
    let ret: RetObject = await this.siteService.prebind(query);

    res.status(HttpStatus.OK).json(ret.result);
  }

  /**
   * @api {post} /site/v2/create 创建站点
   * @apiVersion 1.0.0
   * @apiName create
   * @apiGroup site/v2
   * 
   * @apiParam {Object} data the object contains general settings
   * @apiParam {String} data.accessToken 令牌
   * @apiParam {String} [data.siteName] 站点名称
   * @apiParam {String} [data.siteType] 站点类型
   * @apiParam {String} [data.siteDescription] 站点描述
   * @apiParam {Object} [data.source] 素材存放源
   * @apiParam {String} [data.source.provider.name] 素材存放提供商名称
   * @apiParam {String} [data.prefix] 前缀、通常为taskId
   * @apiParam {Array} [data.groups] 站点所在组
   * 
   * @apiSuccess {Object} ret the object contains execute result
   * @apiSuccess {Number} ret.code return 0
   * @apiSuccess {String} ret.siteId return this siteId
   * 
   * @apiError {Object} ret the object contains execute result 
   * @apiError {Number} ret.code return 1
   * @apiError {String} ret.description the detail of error
   *  
   */
  @Post('v2/create')
  async create(@Res() res, @Body() data) {
    let ret = await this.siteService.create(data);
    res.status(HttpStatus.OK).json(ret);
  }

    /**
   * @api {post} /site/v2/update_general 更新站点基础信息
   * @apiVersion 1.0.0
   * @apiName update_general
   * @apiGroup site/v2
   * 
   * @apiParam {Object} data the object contains general settings
   * @apiParam {String} data.accessToken 令牌
   * @apiParam {String} data.siteId 站点ID
   * @apiParam {String} [data.siteName] 站点名称
   * @apiParam {String} [data.siteType] 站点类型
   * @apiParam {String} [data.siteDescription] 站点描述
   * @apiParam {Object} [data.source] 素材存放源
   * @apiParam {String} [data.source.provider.name] 素材存放提供商名称
   * @apiParam {String} [data.prefix] 前缀、通常为taskId
   * @apiParam {Array} [data.groups] 站点所在组
   * 
   * @apiSuccess {Object} ret the object contains execute result
   * @apiSuccess {Number} ret.code return 0
   * 
   * @apiError {Object} ret the object contains execute result 
   * @apiError {Number} ret.code when return 1, it means the code had been executed successfully, but no effect data.
   * @apiError {Number} ret.code when return 2, it means error occurs.
   * @apiError {String} ret.description the detail of status
   *  
   */
  @Post('v2/update_general')
  async update_general(@Res() res, @Body() data) {
    let ret = await this.siteService.updateGeneral(data);
    res.status(HttpStatus.OK).json(ret);
  }

  /**
   * @api {get} /site/v2/get_general 获取站点基础信息
   * @apiVersion 1.0.0
   * @apiName get_general
   * @apiGroup site/v2
   * 
   * @apiParam {Object} data the object contains general settings
   * @apiParam {String} data.accessToken 令牌
   * @apiParam {String} data.siteId 站点ID
   * 
   * @apiSuccess {Object} ret the object contains execute result
   * @apiSuccess {Number} ret.code return 0
   * 
   * @apiSuccess {Object} ret.result the data object
   * @apiSuccess {String} ret.result.siteName 站点ID
   * @apiSuccess {String} ret.result.siteType 站点类型
   * @apiSuccess {String} ret.result.siteDescription 站点描述
   * @apiSuccess {String} ret.result.groups 站点所在组
   * 
   * @apiError {Object} ret the object contains execute result 
   * @apiError {Number} ret.code when return 1, it means the code had been executed successfully, but no effect data.
   * @apiError {Number} ret.code when return 2, it means error occurs.
   * @apiError {String} ret.description the detail of status
   *  
   */
  @Get('v2/get_general')
  async get_general(@Res() res, @Query() query) {
    let ret = await this.siteService.getGeneral(query.siteId, query.accessToken);
    res.status(HttpStatus.OK).json(ret);
  }

    /**
   * @api {post} /site/v2/update_video 更新站点视频设置
   * @apiVersion 1.0.0
   * @apiName update_video
   * @apiGroup site/v2
   * 
   * @apiParam {Object} data the object contains general settings
   * @apiParam {String} data.siteId 站点ID
   * @apiParam {String} data.accessToken 令牌
   * 
   * @apiParam {Object} [data.param] 剪辑参数
   * @apiParam {Object} [data.param.mask] 遮罩参数
   * @apiParam {String} [data.param.loop] 循环播放组数
   * @apiParam {Array} [data.param.templatesFront] 前景模板数组
   * @apiParam {Array} [data.param.templatesBack] 背景模板数组
   * 
   * @apiParam {Object} [data.output] 视频输出配置
   * @apiParam {String} [data.output.path] 视频输出路径
   * @apiParam {Object} [data.output.format] 视频输出格式
   * 
   * @apiParam {Object} [data.source] 素材存放源
   * @apiParam {String} [data.source.provider.name] 素材存放提供商名称
   * 
   * @apiParam {String} [data.prefix] 前缀、通常为taskId
   * 
   * @apiSuccess {Object} ret the object contains execute result
   * @apiSuccess {Number} ret.code return 0
   * 
   * @apiError {Object} ret the object contains execute result 
   * @apiError {Number} ret.code when return 1, it means the code had been executed successfully, but no effect data.
   * @apiError {Number} ret.code when return 2, it means error occurs.
   * @apiError {String} ret.description the detail of status
   * 
   *  
   */
  @Post('v2/update_video')
  async update_video(@Res() res, @Body() data) {
    let ret = await this.siteService.updateVideo(data);
    res.status(HttpStatus.OK).json(ret);
  }

    /**
   * @api {get} /site/v2/get_groups 获取站点分组列表
   * @apiVersion 1.0.0
   * @apiName get_groups
   * @apiGroup site/v2
   * 
   * @apiParam {Object} data the object contains the site group
   * @apiParam {String} data.siteId 站点ID
   * @apiParam {String} data.accessToken 令牌
   * 
   * @apiSuccess {Object} ret the object contains query result
   * @apiSuccess {Number} ret.code return 0
   * @apiSuccess {Object} ret.result the array of group 
   * 
   * @apiError {Object} ret the object contains execute result 
   * @apiError {Number} ret.code when return 1, it means the code had been executed successfully, but no effect data.
   * @apiError {Number} ret.code when return 2, it means error occurs.
   * @apiError {String} ret.description the detail of status
   * 
   *  
   */
  @Get('v2/get_groups')
  async get_groups(@Res() res, @Query() data) {
    let ret = await this.siteService.getGroup(data);
    res.status(HttpStatus.OK).json(ret);
  }

  /**
   * @api {post} /site/v2/add_group 添加站点分组
   * @apiVersion 1.0.0
   * @apiName add_group
   * @apiGroup site/v2
   * 
   * @apiParam {Object} data the object contains the site group
   * @apiParam {String} data.siteId 站点ID
   * @apiParam {String} data.accessToken 令牌
   * @apiParam {String} data.group 站点分组
   * 
   * @apiSuccess {Object} ret the object contains query result
   * @apiSuccess {Number} ret.code return 0
   * 
   * @apiError {Object} ret the object contains execute result 
   * @apiError {Number} ret.code when return 1, it means the code had been executed successfully, but no effect data.
   * @apiError {Number} ret.code when return 2, it means error occurs.
   * @apiError {String} ret.description the detail of status
   * 
   *  
   */
  @Post('v2/add_group')
  async add_group(@Res() res, @Body() data) {
    let ret = await this.siteService.addGroup(data);
    res.status(HttpStatus.OK).json(ret);
  }

  /**
   * @api {get} /site/v2/device_reconnect 设备重连
   * @apiVersion 1.0.0
   * @apiName device_reconnect
   * @apiGroup site/v2
   * 
   * @apiParam {Object} data 
   * @apiParam {String} data.deviceId 设备ID
   * 
   * @apiSuccess {Object} ret the object contains query result
   * @apiSuccess {Number} ret.code return 0
   * @apiSuccess {Object} ret.result 
   * @apiSuccess {String} ret.result.siteId 站点Id
   * @apiSuccess {Array} ret.result.deviceConfig 设备配置数组
   * @apiSuccess {String} ret.result.deviceConfig.role 角色
   * @apiSuccess {String} ret.result.deviceConfig.position 位置
   * @apiSuccess {String} ret.result.deviceConfig.deviceId 设备Id
   * 
   * @apiSuccessExample {json} Success-Response:
   *  HTTP/1.1 200 OK
   *  {
   *    "code": 0,
   *    "result": {
   *        "deviceConfig": [
   *          {
   *            "role": "",
   *            "deviceId": "",
   *            "position": ""
   *          }
   *      ],
   *      "siteId": ""
   *    }
   *  }
   * 
   * @apiError {Object} ret the object contains execute result 
   * @apiError {Number} ret.code when return 1, it means the code had been executed successfully, but no effect data.
   * @apiError {Number} ret.code when return 2, it means error occurs.
   * @apiError {String} ret.result the empty object for format
   * 
   *  
   */
  @Get('v2/device_reconnect')
  async device_reconnect(@Res() res, @Query() data) {
    let ret = await this.siteService.reconnectDevice(data);
    res.status(HttpStatus.OK).json(ret);
  }

    /**
     * @api {get} /site/v2/get_devices_by_group 通过分组获取设备列表
     * @apiName get_devices_by_group
     * @apiVersion 1.0.0
     * @apiGroup /site/v2
     * 
     * @apiParam {Object} query the object of querystring
     * @apiParam {String} query.group 分组
     * 
     * @apiSuccess {Object} ret result of execute
     * @apiSuccess {Number} ret.code 0
     * @apiSuccess {Object} ret.result deviceConfig
     * 
     * @apiError {Object} ret 
     * @apiError {Number} ret.code not 0
     * @apiError {String} ret.description the result of error 
     */
    @Get('v2/get_devices_by_group')
    async get_devices_by_group(@Res() res, @Query() query) {
        let ret = await this.siteService.getDevicesByGroup(query);
        res.status(HttpStatus.OK).json(ret);
    }

    /**
     * @api {post} /site/v2/update_device_label 通过分组获取设备列表
     * @apiName update_device_label
     * @apiVersion 1.0.0
     * @apiGroup /site/v2
     * 
     * @apiParam {Object} data the object 
     * @apiParam {String} data.deviceId 设备Id
     * @apiParam {String} data.label 备注
     * 
     * @apiSuccess {Object} ret result of execute
     * @apiSuccess {Number} ret.code 0
     * 
     * @apiError {Object} ret 
     * @apiError {Number} ret.code not 0
     * @apiError {String} ret.description the result of error 
     */
    @Post('v2/update_device_label')
    async update_device_label(@Res() res, @Body() data) {
        let ret = await this.siteService.updateDeviceLabel(data);
        res.status(HttpStatus.OK).json(ret);
    }

  /**
     * @api {get} /site/v2/get_deviceConfig 根據siteId取得D
     * @apiName update_device_label
     * @apiVersion 1.1.0
     * @apiGroup /site/v2
     * 
     * @apiParam {String} siteId siteId
     * 
     * @apiSuccess {Object} ret the object contains query result
     * @apiSuccess {Number} ret.code return 0
     * @apiSuccess {Object} ret.result the array of group 
     * 
     * @apiError {Object} ret 
     * @apiError {Number} ret.code not 0
     * @apiError {String} ret.description the result of error 
     */
    @Get('v2/get_deviceConfig')
    async get_deviceConfig(@Res() res, @Query() query) {
        let ret = await this.siteService.getDeviceConfig(query);
        // console.log("ret=" + JSON.stringify(ret));
        res.status(HttpStatus.OK).json(ret);
    }

  /**
   *
   * @api {post} /site/v2/add_share_site_setting 添加共享站点设定
   * @apiName add_share_site_setting
   * @apiGroup /site/v2
   * @apiVersion 1.0.0
   *
   * @apiParam {Object} data
   * @apiParam {String} data.deviceId 设备ID
   * @apiParam {String} data.siteId 站点ID
   *
   * @apiSuccess {Object} ret
   * @apiSuccess {Number} ret.code it will return 0
   *
   * @apiError {Object} ret
   * @apiError {Number} ret.code it will return 2
   * @apiError {String} ret.description the description of error
   *
   * @apiSuccessExample
   * {
   *   "code": 0
   * }
   */
    @Post('v2/add_share_site_setting')
    async addShareSiteSetting(@Res() res, @Body() data) {
      let ret = await this.siteService.addShareSiteSetting(data);
      res.status(HttpStatus.OK).json(ret);
    }

    /**
     * @api {get} /site/v2/get_basketAnnoSite 获取篮球Annotation Tool site列表
     * @apiName get_basketAnnoSite
     * @apiVersion 1.0.0
     * @apiGroup /site/v2
     *
     * @apiSuccess {Object} ret
     * @apiSuccess {Number} ret.code
     * @apiSuccess {Array} ret.result
     *
     * @apiSuccessExample
     * {
     *    "code": 0,
     *    "result": [
     *      {
     *        "_id": "",
     *        "siteId": "",
     *        "siteName": ""
     *      }
     *    ]
     * }
     */
    @Get('v2/get_basketAnnoSite')
    async get_basketAnnoSite(@Res() res, @Query() query) {
        let ret = await this.siteService.getBasketAnnoSite(query);
        // console.log("ret=" + JSON.stringify(ret));
        res.status(HttpStatus.OK).json(ret);
    }


    @Get('v2/get_basket_anno_site_by_siteId')
    async get_basket_anno_site_by_siteId(@Res() res, @Query() query) {
      let ret = await this.siteService.getBasketAnnoSiteBySiteId(query);
      // console.log("ret = " + JSON.stringify(ret));
      res.status(HttpStatus.OK).json(ret);
    }

    // ToDo: apidoc
    @Get('v2/get_basketAnnoTeamBySiteId')
    async get_basketAnnoTeamBySiteId(@Res() res, @Query() query) {
        let ret = await this.siteService.getBasketAnnoTeamBySiteId(query);
        // console.log("ret=" + JSON.stringify(ret));
        res.status(HttpStatus.OK).json(ret);
    }

    /**
     * @api {post} /site/v2/upsert_basketball_session 新增篮球赛事
     * @apiName upsert_basketball_session
     * @apiVersion 1.0.0
     * @apiGroup /site/v2
     *
     * @apiParam {String} siteId  站点ID 如果存在则更新其他字段，如果站点ID不存在则插入
     * @apiParam {String} siteName 站点名称
     * @apiParam {Array} player 球员
     *
     * @apiSuccess {Object} ret
     * @apiSuccess {Number} ret.code 0
     *
     * @apiSuccessExample
     *
     *  // --------- request body example
     * {
     *    "siteId": "",
     *    "siteName": "",
     *    "player": [
     *      {
     *        "name": "",
     *        "team": ""
     *      }
     *    ]
     * }
     *
     * // ----------- response body example
     * {
     *    "code": 0
     * }
     *
     *
     * @apiError {Object} ret
     * @apiError {Number} ret.code not 0
     *
     *
     */
    @Post('v2/upsert_basketball_session')
    async upsert_basketball_session(@Res() res, @Body() data) {
      let ret = await this.siteService.upsertBasketBallSession(data);
      console.log(`ret = ${JSON.stringify(ret)}`);
      res.status(HttpStatus.OK).json(ret);
    }

    /**
     * @api {get} /site/v2/ffmpeg_config 获取ffmpeg配置信息
     * @apiName ffmpeg_config
     * @apiGroup /site/v2
     * @apiVersion 1.0.0
     *
     * @apiParam {String} siteId
     *
     * @apiSuccess {Object} ret
     * @apiSuccess {Number} ret.code 0
     * @apiSuccess {Object} ret.result
     *
     * @apiSuccessExample
     * {
     *    "code": 0,
     *    "result": {
     *      "ffmpegConfig": {
     *        "streamSourceUri": "',
     *        "streamSourceName": "",
     *        "start": "",
     *        "end": ""
     *      }
     *    }
     * }
     */
    @Get('v2/ffmpeg_config')
    async ffmpeg_config(@Res() res, @Query() query) {
      let ret = await this.siteService.getFFmpegConfig(query);

      res.status(HttpStatus.OK).json(ret);
    }

    /**
     * @api {post} /site/v2/update_ffmpeg_config 更新ffmpeg配置
     * @apiName update_ffmpeg_config
     * @apiGroup /site/v2
     * @apiVersion 1.0.0
     *
     * @apiParam {String} siteId
     * @apiParam {Object} ffmpegConfig
     *
     * @apiSuccess {Object} ret.code 0
     *
     * @apiSuccessExample
     * // request body
     * {
     *    "siteId": "",
     *    "ffmpegConfig": {
     *      "streamSourceUri": "",
     *      "streamSourceName": "",
     *      "start": "",  //  可选
     *      "end": ""   //  可选
     *    }
     * }
     *
     * // response body if success
     * {
     *    "code": 0
     * }
     *
     */
    @Post('v2/update_ffmpeg_config')
    async update_ffmpeg_config(@Res() res, @Body() data) {
      let ret = await this.siteService.updateFFmpegConfig(data);

      res.status(HttpStatus.OK).json(ret);
    }

    /**
     * @api {post} /site/v2/update_ffmpeg_config_time 更新ffmpeg配置对象开始录制流和结束录制流的时间
     * @apiName update_ffmpeg_config_time
     * @apiGroup /site/v2
     * @apiVersion 1.0.0
     *
     * @apiParam {String} siteId 站点ID
     * @apiParam {String} start 起点时间 eg. 2018/10/26 13:00:00 表示从这个时间点开始录制
     * @apiParam {String} end 结束时间  eg. 2018/11/30 13:00:00 表示到这个时间点停止录制
     *
     * @apiSuccess {Object} ret
     * @apiSuccess {Number} ret.code 0
     *
     * @apiSuccessExample
     * {
     *    "code": 0
     * }
     *
     * @apiError {Object} ret
     * @apiError {Number} ret.code not 0
     * @apiError {String} ret.description the detail of error
     */
    @Post('v2/update_ffmpeg_config_time')
    async update_ffmpeg_config_time(@Res() res, @Body() data) {
        let ret = await this.siteService.updateFFmpegConfigTime(data);

        res.status(HttpStatus.OK).json(ret);
    }
}
