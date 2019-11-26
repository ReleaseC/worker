import { Controller, Get, Post, Res, Body, Query, HttpStatus, UseGuards } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import {activitydb, taskdb} from "../common/db.service";

@Controller('activity')
@UseGuards(RolesGuard)
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {
  }

  /**
   * @api {get} /activity?activity_id=100001 Get activity by activity_id
   * @apiVersion 1.1.0
   * @apiName activity
   * @apiGroup activity
   *
   * @apiSuccess {Object} ret Return activity
   *
   */
  @Get('')
  async activityId(@Res() res, @Query() query) {
    const ret = await this.activityService.getActivity(query);
    res.status(HttpStatus.OK).json(ret);
  }



  /**
   * @api {get} /activity/list Get activity list
   * @apiVersion 1.1.0
   * @apiName activity/list
   * @apiGroup activity
   *
   * @apiSuccess {Object} ret Return activitylists
   *
   */
  @Get('list')
  async list(@Res() res, @Query() query) {
    const ret = await this.activityService.getActivityList(query);
    res.status(HttpStatus.OK).json(ret);
  }

  /**
   * @api {get} /activity/visit 浏览一个activity
   * @apiVersion 1.1.0
   * @apiName activity/visit
   * @apiGroup activity
   *
   *
   */
  @Get('visit')
  async visit(@Res() res, @Query() query) {
    const ret = await this.activityService.activityVisit(query);
    res.status(HttpStatus.OK).json(ret);
  }

    /**
     * @api {get} /activity/flow  一个activity的引流, 通过该活动, 点击跳转到的第三方界面的次数
     * @apiVersion 1.1.0
     * @apiName activity/flow
     * @apiGroup activity
     *
     *
     */
    @Get('flow')
    async flow(@Res() res, @Query() query) {
        const ret = await this.activityService.activityFlow(query);
        res.status(HttpStatus.OK).json(ret);
    }


    /**
     * @api {get} /activity/camera_setting Get camera setting
     * @apiVersion 1.1.0
     * @apiName camera_setting
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

    @Get('info')
    async activityInfo(@Res() res, @Query() query) {
        const ret = await this.activityService.getactivityInfo(query);
        res.status(HttpStatus.OK).json(ret);
    }

    @Get('camera_setting')
    async camera_setting(@Res() res, @Query() query) {
        const ret = await this.activityService.getCameraSetting(query);
        res.status(HttpStatus.OK).json(ret);
    }

    /**
     * @api {post} /activity/add_camera_setting Add new camera setting
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
    async add_camera_setting(@Res() res, @Body() data) {
        const ret = await this.activityService.addCameraSetting(data);
        res.status(HttpStatus.OK).json(ret);
    }

    @Post('add_camera_collect')
    async add_camera_collect(@Res() res, @Body() data) {
        const ret = await this.activityService.addCameraCollect(data);
        res.status(HttpStatus.OK).json(ret);
    }

    @Post('add_video')
    async add_video(@Res() res, @Body() data) {
        const ret = await this.activityService.addVideo(data);
        res.status(HttpStatus.OK).json(ret);
    }



    /**
     * @api {get} /activity/settings AnnotationTool 活动列表
     * @apiName settings
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
    @Get('settings')
    async settings(@Res() res, @Query() query) {
        let ret = await this.activityService.getSettings(query);
        // console.log("ret=" + JSON.stringify(ret));
        res.status(HttpStatus.OK).json(ret);
    }

    /**
     * @api {get} /activity/setting
     * @apiName settings
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
    @Get('setting')
    async setting(@Res() res, @Query() query) {
        let ret = await this.activityService.getSetting(query);
        // console.log("ret=" + JSON.stringify(ret));
        res.status(HttpStatus.OK).json(ret);
    }

    /**
     * @api {get} /activity/settings_stream
     * @apiName settings
     * @apiVersion 1.0.0
     * @apiGroup /site/v2
     *
     * @apiSuccess {Object} ret
     * @apiSuccess {Number} ret.code
     * @apiSuccess {Array} ret.result
     *
     * @apiSuccessExample
     */
    @Get('settings_stream')
    async settings_stream(@Res() res, @Query() query) {
        let ret = await this.activityService.getSettingsStream(query);
        // console.log("ret=" + JSON.stringify(ret));
        res.status(HttpStatus.OK).json(ret);
    }

    /**
     * @api {get} /activity/settings_ffmpeg_config
     * @apiName settings
     * @apiVersion 1.0.0
     * @apiGroup /site/v2
     *
     * @apiSuccess {Object} ret
     * @apiSuccess {Number} ret.code
     * @apiSuccess {Array} ret.result
     *
     * @apiSuccessExample
     */
    @Get('settings_ffmpeg_config')
    async settings_ffmpeg_config(@Res() res, @Query() query) {
        let ret = await this.activityService.getSettingsFfmpegConfig(query);
        // console.log("ret=" + JSON.stringify(ret));
        res.status(HttpStatus.OK).json(ret);
    }

    @Get('file_server_status')
    async file_server_status(@Res() res, @Query() query) {
        let ret = await this.activityService.getFileServerStatus(query);
        res.status(HttpStatus.OK).json(ret);
    }

    @Get('del_server_status')
    async del_server_status(@Res() res, @Query() query) {
        let ret = await this.activityService.delFileServerStatus(query);
        res.status(HttpStatus.OK).json(ret);
    }

    @Get('mome_ubuntu_status')
    async mome_ubuntu_status(@Res() res, @Query() query) {
        let ret = await this.activityService.getMomeUbuntuStatus(query);
        res.status(HttpStatus.OK).json(ret);
    }

    // @Get('mome_ubuntu_status')
    // async mome_ubuntu_status(@Res() res, @Query() query) {
    //     let ret = await this.activityService.getMomeUbuntuStatus(query);
    //     res.status(HttpStatus.OK).json(ret);
    // }

    @Post('set_check_time')
    async set_check_time(@Res() res, @Body() data) {
        let ret = await this.activityService.setCheckTime(data);
        res.status(HttpStatus.OK).json(ret);
    }

    /* 远端拍摄 */
    @Get('make_move')
    async make_move(@Res() res, @Query() query) {
        let ret = await this.activityService.makeMove(query);
        res.status(HttpStatus.OK).json(ret);
    }

    /* 结束远端拍摄 */
    @Get('end_move')
    async end_move(@Res() res, @Query() query) {
        let ret = await this.activityService.endMove(query);
        res.status(HttpStatus.OK).json(ret);
    }

    /* 开始提示 */
    @Get('start_prompt')
    async start_prompt(@Res() res, @Query() query) {
        let ret = await this.activityService.startPrompt(query);
        res.status(HttpStatus.OK).json(ret);
    }

    /* 取消提示 */
    @Get('stop_prompt')
    async stop_prompt(@Res() res, @Query() query) {
        let ret = await this.activityService.stopPrompt(query);
        res.status(HttpStatus.OK).json(ret);
    }

    /* 采集盒压力测试 */
    @Post('pressure_test')
    async pressure_test(@Res() res, @Body() data) {
        let ret = await this.activityService.pressureTest(data);
        res.status(HttpStatus.OK).json(ret);
    }

    @Get('fire_device')
    async fire_device(@Res() res, @Query() query) {
        let ret = await this.activityService.fireDevice(query);
        res.status(HttpStatus.OK).json(ret);
    }

    /* 活动设定机位信息, 一次设定1或多个 */
    @Post('set_cameras')
    async set_cameras(@Res() res, @Body() data) {
        let ret = await this.activityService.setCameras(data);
        res.status(HttpStatus.OK).json(ret);
    }

    /* 活动后期设定, 一次设定1或多个 */
    @Post('later_setting')
    async later_setting(@Res() res, @Body() data) {
        let ret = await this.activityService.laterSetting(data);
        res.status(HttpStatus.OK).json(ret);
    }

    @Get('restart_collect')
    async restart_collect(@Res() res, @Query() query) {
        let ret = await this.activityService.restartCollect(query);
        res.status(HttpStatus.OK).json(ret);
    }

    @Get('upload_test')
    async upload_test(@Res() res, @Query() query) {
        let ret = await this.activityService.uploadTest(query);
        res.status(HttpStatus.OK).json(ret);
    }























}
