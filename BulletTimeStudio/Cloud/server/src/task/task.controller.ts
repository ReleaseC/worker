import { Controller, Get, Post, Res, Body, Query, HttpStatus, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import {taskdb} from "../common/db.service";

@Controller('task')
@UseGuards(RolesGuard)
export class TaskController {
    constructor(private readonly taskService: TaskService) { }

    /**
     * @api {post} /task/task_create Create new task
     * @apiVersion 1.1.0
     * @apiName task_create 
     * @apiGroup task
     *
     * @apiParam {Object} data Client object data
     * @apiParam {String} data.type Client data type: data.type(soccer/bt)
     * 
     * 
     * @apiSuccess {Object} ret Return object
     * @apiSuccess {Number} ret.code return 0
     * @apiSuccess {String} ret.description return description
     * 
     */
    @Roles('customer')
    @Post('task_create')
    async task_create( @Res() res, @Body() data) {
        const ret = await this.taskService.createTask(data);
        res.status(HttpStatus.OK).json(ret);
    }

    /**
     * @api {post} /task/task_update Update task state
     * @apiVersion 1.1.0
     * @apiName task_update 
     * @apiGroup task
     *
     * @apiParam {Object} data Client object data
     * @apiParam {String} data.type Client data type: data.type(soccer/bt)
     *
     * @apiSuccess {Object} ret Return object
     * @apiSuccess {Number} ret.code return 0
     * @apiSuccess {Object} ret.result return specific site details
     * 
     */
    @Roles('customer')
    @Post('task_update')
    async task_update (@Res() res, @Body() data) {
        const ret = await this.taskService.updateTask(data);
        res.status(HttpStatus.OK).json(ret);
    }

    /**
     * @api {post} /task/task_delete Delete task state
     * @apiVersion 1.1.0
     * @apiName task_delete 
     * @apiGroup task
     *
     * @apiParam {Object} data Client object data
     * @apiParam {String} data.type Client data type: data.type(annoTool)
     *
     * @apiSuccess {Object} ret Return object
     * @apiSuccess {Number} ret.code return 0
     * @apiSuccess {Object} ret.result return specific site details
     * 
     */
    @Post('task_delete')
    async task_delete (@Res() res, @Body() data) {
        const ret = await this.taskService.deleteTask(data);
        res.status(HttpStatus.OK).json(ret);
    }

  /**
   * @api {post} /task/update_task_to_ready restart task force
   * @apiVersion 1.0.0
   * @apiName update_task_to_ready
   * @apiGroup task
   *
   * @apiParam {Object} data
   * @apiParam {String} data.msg 细部信息
   * @apiParam {String} data.taskId 任务ID
   *
   * @apiSuccess {Object} ret
   * @apiSuccess {Number} ret.code return 0
   * @apiSuccess {Object} ret.result of execute
   *
   * @apiSuccessExample
   * {
   *   code: 0
   *   result: {
   *     taskId: "",
   *     state: ""
   *     ...
   *   }
   * }
   */
    @Post('update_task_to_ready')
    async update_task_to_ready(@Res() res, @Body() data) {
        let ret = await this.taskService.updateTaskToDataReady(data);
        res.status(HttpStatus.OK).json(ret);
    }

    /**
     * @api {get} /task/task_get Get single task 
     * @apiVersion 1.1.0
     * @apiName task_get 
     * @apiGroup task
     *
     * @apiParam {Object} query Client object query
     *
     * @apiSuccess {Object} ret Return task
     * 
     */
    @Get('task_get')
    async task_get( @Res() res, @Query() query) {
        const ret = await this.taskService.getTask(query);
        res.status(HttpStatus.OK).json({ task: ret });
    }

    /**
     * @api {get} /task/effect_task_get Get single effect task 
     * @apiVersion 1.1.0
     * @apiName effect_task_get 
     * @apiGroup task
     *
     * @apiParam {Object} query Client object query
     *
     * @apiSuccess {Object} ret Return task
     * 
     */
    @Get('effect_task_get')
    async effect_task_get( @Res() res, @Query() type) {
        const ret = await this.taskService.getEffectTask(type);
        res.status(HttpStatus.OK).json({ task: ret });
    }

    /**
     * @api {post} /task/task_finish
     * @apiVersion 1.1.0
     * @apiName task_finish 
     * @apiGroup task
     *
     * @apiParam {Object} data Client object data
     *
     * @apiSuccess {Object} ret Return task
     *
     */
    @Post('task_finish')
    async task_finish( @Res() res, @Body() data) {
        const ret = await this.taskService.finishTask(data);
        res.status(HttpStatus.OK).json(ret);
    }

    /**
     * @api {post} /task/effect_task_finish Update effect task state to finish
     * @apiVersion 1.1.0
     * @apiName effect_task_finish 
     * @apiGroup task
     *
     * @apiParam {Object} data Client object data
     * @apiParam {String} data.msg Client messenge: data.msg
     *
     * @apiSuccess {Object} ret Return task
     * 
     */
    @Post('effect_task_finish')
    async effect_task_finish( @Res() res, @Query() data) {
        const ret = await this.taskService.finishEffectTask(data);
        res.status(HttpStatus.OK).json({ task: ret });
    }

    /**
     * @api {post} /task/task_abort Abort specific task
     * @apiVersion 1.1.0
     * @apiName task_abort 
     * @apiGroup task
     *
     * @apiParam {Object} data Client object data
     * @apiParam {String} data.msg Client messenge: data.msg
     *
     * @apiSuccess {Object} ret Return task
     *
     */
    @Post('task_abort')
    async task_abort( @Res() res, @Body() data) {
        const ret = await this.taskService.onAbortTask(data);
        res.status(HttpStatus.OK).json(ret);
    }

    /**
     * @api {get} /task/task_list_get Get task list
     * @apiVersion 1.1.0
     * @apiName task_list_get 
     * @apiGroup task
     *
     * @apiParam {Object} query Client object query
     * @apiParam {String} query.time 创建时间模糊查询
     * @apiParam {String} [query.siteId = {}] 站点Id
     * @apiParam {String} [query.state = {}] 任务状态
     * @apiParam {Boolean} [query.sort = 1] 是否按创建时间逆向排序
     * @apiParam {Number} [query.limit = all] 查询数据项数目
     *
     * @apiSuccess {Object} ret Return tasklists
     *
     */
    @Get('task_list_get')
    async task_list_get( @Res() res, @Query() query) {
        const ret = await this.taskService.getTaskList(query);
        res.status(HttpStatus.OK).json(ret);
    }

    /**
     * @api {post} /task/get_task_file_lists Get all soccer task videos in ucloud (Obsolete) 
     * @apiVersion 1.0.0
     * @apiName get_task_file_lists 
     * @apiGroup task
     *
     * @apiParam {Object} data Client object data
     * @apiParam {String} data.taskId Client taskId: data.taskId
     * 
     * @apiSuccess {Object} ret Return object
     * @apiSuccess {Number} ret.code return 0
     * @apiSuccess {Object} ret.result return result
     * 
     */
    @Post('get_task_file_lists')
    async get_task_file_lists( @Res() res, @Body() data) {
        const ret = await this.taskService.get_task_file_lists(data);
        res.status(HttpStatus.OK).json(ret);
    }

    /**
     * @api {post} /task/task_cancel Update task state to cancel
     * @apiVersion 1.1.0
     * @apiName task_cancel 
     * @apiGroup task
     *
     * @apiParam {Object} data Client object data
     * @apiParam {String} data.taskId Client taskId: data.taskId
     * @apiParam {String} data.msg Client messenge: data.msg
     * 
     * @apiSuccess {Object} ret Return object
     * @apiSuccess {Number} ret.code return 0
     * @apiSuccess {Object} ret.result return result
     * 
     */
    @Post('task_cancel')
    async task_cancel( @Res() res, @Body() data) {
        const ret = await this.taskService.onCancelTask(data);
        res.status(HttpStatus.OK).json(ret);
    }
    
    /**
     * @api {post} /task/get_bt_single_task_status
     * @apiVersion 1.1.0
     * @apiName get_bt_single_task_status 
     * @apiGroup task
     *
     * @apiParam {Object} data Client object data
     * @apiParam {String} data.taskId Client taskId: data.taskId
     * @apiParam {String} data.userId Client userId: data.userId
     * @apiParam {String} data.state Client state: data.state
     * 
     * @apiSuccess {Object} ret Return object
     * @apiSuccess {Number} ret.code return 0
     * @apiSuccess {Object} ret.result return result
     *
     */
    @Post('get_bt_single_task_status')
    async get_bt_single_task_status( @Res() res, @Body() data) {
        const ret = await this.taskService.getBtSingleTaskStatus(data);
        res.status(HttpStatus.OK).json(ret);
    }
    
    /**
     * @api {post} /task/update_status 更新任务状态
     * @apiVersion 1.2.0
     * @apiName update_status 
     * @apiGroup task
     *
     * @apiParam {Object} data 
     * @apiParam {String} data.taskId 任务id
     * @apiParam {String} data.role 角色
     * @apiParam {String} data.position 位置
     * @apiParam {String} data.msg 信息
     * @apiParam {String} data.shift 微调量[单位：微秒][范围：-1000 ~ 1000]
     * 
     * @apiSuccess {Object} ret Return object
     * @apiSuccess {Number} ret.code return 0
     * 
     * @apiError {Object} ret 
     * @apiError {Number} ret.code not 0
     * @apiError {String} ret.description 
     *
     */
    @Post('update_status')
    async update_status(@Res() res, @Body() data) {
        let ret = await this.taskService.updateStatus(data);
        res.status(HttpStatus.OK).json(ret);
    }

    /**
     * @api {post} /task/get_status 取得任務狀態
     * @apiVersion 1.2.0
     * @apiName get_status 
     * @apiGroup task
     *
     * @apiParam {Object} data 
     * @apiParam {String} data.taskId task id
     * 
     * @apiSuccess {Object} retStatus
     * @apiSuccess {String} retStatus.stats task status
     * @apiSuccess {String} retStatus.videoCam1_status VideoCam 0 status
     * @apiSuccess {String} retStatus.videoCam2_status VideoCam 1 status
     * @apiSuccess {String} retStatus.videoCam3_status VideoCam 2 status
     * @apiSuccess {String} retStatus.worker worker status
     * @apiSuccess {String} retStatus.url url of production when worker is output video
     * 
     * @apiSuccessExample {json} Success-Response:
     *  HTTP/1.1 200 OK
     * {
     *      "state": "complete",
     *      "videoCam1_status": "File upload finished",
     *      "videoCam2_status": "",
     *      "videoCam3_status": "",
     *      "worker": "step8/8:upload Video complete",
     *      "url": "https://..."
     * }
     * 
     */
    @Post('get_status')
    async get_status(@Res() res, @Body() data) {
        let ret = await this.taskService.getStatus(data);
        res.status(HttpStatus.OK).json(ret);
    }


    // ToDo: apidoc
    @Get('task_get_by_type')
    async task_get_by_type( @Res() res, @Query() query) {
        const ret = await this.taskService.getTaskStatusByDataType(query);
        res.status(HttpStatus.OK).json(ret);
    }

  /**
   * @api {post} /task/del 一条task标为删除
   * @apiVersion 1.1.0
   * @apiName task_del
   * @apiGroup task
   *
   *
   * @apiSuccess {Object} ret Return object
   * @apiSuccess {Number} ret.code return 0
   * @apiSuccess {Object} ret.result return specific site details
   *
   */
  @Roles('customer')
  @Get('del')
  async del (@Res() res, @Query() data) {
    const ret = await this.taskService.delTask(data);
    res.status(HttpStatus.OK).json(ret);
  }

  /**
   * @api {get} /task/like 为一个task点赞
   * @apiVersion 1.1.0
   * @apiName like
   * @apiGroup task
   * @apiSuccess {Object} ret Return object
   * @apiSuccess {Number} ret.code return 0
   * @apiSuccess {Object} ret.result return specific site details
   *
   */
  @Get('like')
  async like( @Res() res, @Query() query) {
    const ret = await this.taskService.taskLike(query);
    res.status(HttpStatus.OK).json(ret);
  }

  /**
   * @api {get} /task/if_like 是否赞过某个task
   * @apiVersion 1.1.0
   * @apiName if_like
   * @apiGroup task
   * @apiSuccess {Object} ret Return object
   * @apiSuccess {Number} ret.code return 0
   * @apiSuccess {Object} ret.result return specific site details
   *
   *
   */
  @Get('if_like')
  async if_like( @Res() res, @Query() query) {
    const ret = await this.taskService.taskIfLike(query);
    res.status(HttpStatus.OK).json(ret);
  }


  /**
   * @api {get} /task/like/list
   * @apiVersion 1.1.0
   * @apiName like
   * @apiGroup task
   * @apiSuccess {Object} ret Return object
   * @apiSuccess {Number} ret.code return 0
   * @apiSuccess {Object} ret.result return specific site details
   *
   *
   */
  @Get('like_list')
  async likeList( @Res() res, @Query() query) {
    const ret = await this.taskService.taskLikeList(query);
    res.status(HttpStatus.OK).json(ret);
  }

  /**
   * @api {get} /task/collect 为一个task收藏
   * @apiVersion 1.1.0
   * @apiName collect
   * @apiGroup task
   * @apiSuccess {Object} ret Return object
   * @apiSuccess {Number} ret.code return 0
   * @apiSuccess {Object} ret.result return specific site details
   *
   *
   */
  @Get('collect')
  async collect( @Res() res, @Query() query) {
    const ret = await this.taskService.taskCollect(query);
    res.status(HttpStatus.OK).json(ret);
  }

  /**
   * @api {get} /task/if_collect 是收藏过某个task
   * @apiVersion 1.1.0
   * @apiName if_collect
   * @apiGroup task
   * @apiSuccess {Object} ret Return object
   * @apiSuccess {Number} ret.code return 0
   * @apiSuccess {Object} ret.result return specific site details
   *
   *
   */
  @Get('if_collect')
  async if_collect( @Res() res, @Query() query) {
    const ret = await this.taskService.taskIfCollect(query);
    res.status(HttpStatus.OK).json(ret);
  }


  /**
   * @api {get} /task/collect/list
   * @apiVersion 1.1.0
   * @apiName collect
   * @apiGroup task
   * @apiSuccess {Object} ret Return object
   * @apiSuccess {Number} ret.code return 0
   * @apiSuccess {Object} ret.result return specific site details
   *
   */
  @Get('collect_list')
  async collectList( @Res() res, @Query() query) {
    const ret = await this.taskService.taskCollectList(query);
    res.status(HttpStatus.OK).json(ret);
  }

  /**
   * @api {get} /task/visit 浏览一条视频
   * @apiVersion 1.1.0
   * @apiName visit
   * @apiGroup task
   * @apiSuccess {Object} ret Return object
   * @apiSuccess {Number} ret.code return 0
   * @apiSuccess {Object} ret.result return specific site details
   *
   *
   */
  @Get('visit')
  async visit( @Res() res, @Query() query) {
    const ret = await this.taskService.taskVisit(query);
    res.status(HttpStatus.OK).json(ret);
  }

    /**
     * @api {get} /task/task_info info
     * @apiVersion 1.1.0
     * @apiName visit
     * @apiGroup task
     * @apiSuccess {Object} ret Return object
     * @apiSuccess {Number} ret.code return 0
     * @apiSuccess {Object} ret.result return specific site details
     *
     *
     */
  @Get('task_info')
  async task_info( @Res() res, @Query() query) {
    const ret = await this.taskService.taskInfo(query);
    res.status(HttpStatus.OK).json(ret);
  }

    @Get('send_local_cloud')
    async send_local_cloud( @Res() res, @Query() query) {
        const ret = await this.taskService.sendLocalCloud(query);
        res.status(HttpStatus.OK).json(ret);
    }

    @Get('send_prompt_scan')
    async send_prompt_scan( @Res() res, @Query() query) {
        const ret = await this.taskService.sendPromptScan(query);
        res.status(HttpStatus.OK).json(ret);
    }

    @Get('has_preview_img')
    async has_preview_img( @Res() res, @Query() query) {
        const ret = await this.taskService.hasPreviewImg(query);
        res.status(HttpStatus.OK).json(ret);
    }

    @Get('has_preview_video')
    async has_preview_video( @Res() res, @Query() query) {
        const ret = await this.taskService.hasPreviewVideo(query);
        res.status(HttpStatus.OK).json(ret);
    }



}
