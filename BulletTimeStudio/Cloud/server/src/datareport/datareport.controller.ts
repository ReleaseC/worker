import { Controller, Post, Get, Body, Req, Query, Res, HttpStatus } from "@nestjs/common";
import * as bodyParser from "body-parser";
import * as express from "express";
import * as crypto from "crypto";
import * as jsSHA from "jssha";
import * as Http from "http";
import { DatareportService } from "./datareport.service";
import { RetObject } from "../common/ret.component";
import { environment } from "../environment/environment";

@Controller("datareport")
export class DatareportController {

    constructor(
        private readonly datareportService: DatareportService
    ) {
    }

    /**
     * @api {post} /datareport/point_page Create/update data report
     * @apiVersion 1.1.0
     * @apiName point_page
     * @apiGroup datareport
     *
     * @apiParam {Object} data Client object data
     * @apiParam {String} data.siteId Client siteId: data.siteId
     * @apiParam {String} data.mode Client mode: data.mode (play, like, share, download, ...)
     *
     * @apiSuccess {Object} ret Return object
     * @apiSuccess {Number} ret.code return 0
     * @apiSuccess {String} ret.description return description
     *
     */
    @Post("point_page")
    async point_page(@Res() res, @Body() data) {
        let ret = await this.datareportService.point_page(data);
        res.status(HttpStatus.OK).json(ret);
    }

    /**
     * @api {post} /datareport/statistics 统计模板视频的访问量、播放量、下载量、分享量、点赞量
     * @apiVersion 1.0.0
     * @apiName statistics
     * @apiGroup datareport
     *
     * @apiParam {Object} data the structure that client sent
     * @apiParam {String} [data.taskId] 按任务统计时可以选用 填入taskId, 此时只需要在填入data.mode选定统计类容即可
     *
     * @apiParam {String} data.siteId siteId 站点ID
     * @apiParam {String} data.templateId templateId 模板ID
     * @apiParam {String} data.mode mode: 'play' | 'share' | 'like' | 'download' | 'visit'
     *
     * @apiSuccess {Object} ret return result of execute
     * @apiSuccess {Number} ret.code return 0
     *
     * @apiError {Object} ret return result of execute
     * @apiError {Number} ret.code return 1
     * @apiError {String} ret.description the detail of error
     *
     * @apiSuccessExample
     * {
     *     "code": 0
     * }
     *
     */
    @Post("statistics")
    async statistics(@Res() res, @Body() data) {
        let ret = await this.datareportService.statistics(data);
        res.status(HttpStatus.OK).json(ret);
    }

  /**
   * @api {post} /datareport/cancel_statistics 取消收藏, 点赞
   * @apiVersion 1.0.0
   * @apiName statistics
   * @apiGroup datareport
   *
   * @apiParam {Object} data the structure that client sent
   * @apiParam {String} [data.taskId] 按任务统计时可以选用 填入taskId, 此时只需要在填入data.mode选定统计类容即可
   *
   * @apiParam {String} data.siteId siteId 站点ID
   * @apiParam {String} data.templateId templateId 模板ID
   * @apiParam {String} data.mode mode: 'play' | 'share' | 'like' | 'download' | 'visit'
   *
   * @apiSuccess {Object} ret return result of execute
   * @apiSuccess {Number} ret.code return 0
   *
   * @apiError {Object} ret return result of execute
   * @apiError {Number} ret.code return 1
   * @apiError {String} ret.description the detail of error
   *
   * @apiSuccessExample
   * {
   *     "code": 0
   * }
   *
   */
  @Post("cancel_statistics")
  async cancel_statistics(@Res() res, @Body() data) {
    let ret = await this.datareportService.cancel_statistics(data);
    res.status(HttpStatus.OK).json(ret);
  }


    /**
     * @api {get} /datareport/get_data Get data report
     * @apiVersion 1.1.0
     * @apiName get_data
     * @apiGroup datareport
     *
     * @apiParam {Object} data Client object data
     * @apiParam {String} data.siteId Client siteId: data.siteId
     *
     * @apiSuccess {Object} ret Return object
     * @apiSuccess {Number} ret.code return 0
     * @apiSuccess {Object} ret.result return account lists
     *
     */
    @Get("get_data")
    async get_data(@Res() res, @Query("siteId") siteId) {
        let ret = await this.datareportService.get_data(siteId);
        res.status(HttpStatus.OK).json(ret);
    }

    /**
     * @api {get} /datareport/get_statistics 获取统计结果
     * @apiVersion 1.0.0
     * @apiName get_statistics
     * @apiGroup datareport
     *
     * @apiParam {String} siteId 站点ID
     *
     * @apiSuccess {Object} ret return Object
     * @apiSuccess {Number} ret.code return 0
     * @apiSuccess {Object} ret.result the object of query
     *
     * @apiError {Object} ret return object
     * @apiError {Number} ret.code return 1
     * @apiError {String} ret.description the detail description of error
     *
     */
    @Get("get_statistics")
    async get_statistics(@Res() res, @Query("siteId") siteId, @Query("taskId") taskId) {
        let ret = taskId ? await this.datareportService.getTaskStatistics(taskId) :
            await this.datareportService.get_statistics(siteId);
        res.status(HttpStatus.OK).json(ret);
    }

    /**
     * @api {get} /datareport/download_file Download data report (Construction)
     * @apiVersion 1.2.0
     * @apiName download_file
     * @apiGroup datareport
     *
     * @apiParam {Object} data Client object data
     * @apiParam {String} data.siteId Client siteId: data.siteId
     *
     * @apiSuccess {Object} object return client.MakeAuth()
     *
     */
    @Get("download_file")
    async download_file(@Res() res, @Query("method") method, @Query("bucket") bucket, @Query("key") key, @Query("content_md5") content_md5, @Query("content_type") content_type, @Query("date") date) {
        let ret = await this.datareportService.download_file(method, bucket, key, content_md5, content_type, date);
        res.status(HttpStatus.OK).json(ret);
    }

    /**
     * @api {get} /datareport/import_data Import data report (Construction)
     * @apiVersion 1.2.0
     * @apiName import_data
     * @apiGroup datareport
     *
     *
     * @apiSuccess {Object} ret Return object
     * @apiSuccess {Number} ret.code return 0
     *
     */
    @Get("import_data")
    async import_data(@Res() res) {
        let ret = await this.datareportService.import_data();
        res.status(HttpStatus.OK).json(ret);
    }

}

