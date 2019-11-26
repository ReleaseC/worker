import { Document } from 'mongoose';

export interface Sites extends Document {
  readonly siteId: String,//活动编号
  readonly name: String,//活动名称
  readonly type: String,//BT-1
  readonly param: Object,//剪辑的参数
  readonly source: Object,
  readonly output: Object,//输出的参数
  readonly workerId: String,//分配的worker
  readonly accessToken: String,//未知
  readonly expireTime: String,//未知
  readonly template: Object//可用的模板
}

/**
 * site settings 通用部分结构
 */
export interface SiteGeneralSettings {
  siteId: String,
  siteName: String,
  siteType: String,
  siteDescription: String,
  groups: Array<String>,
}

/**
 * 站点通用设定请求体
 */
export interface SiteGeneralSettingsRequest extends SiteGeneralSettings {
  accessToken: String
}


/**
 * site settings 视频部分结构
 */
export interface SiteVideoSettings {
  siteId: String,
  param: {
    mask: Object,
    loop: String,
    templatesFront: Array<Object>,
    templatesBack: Array<Object>,
  },
  output: {
    path: String,
    format: Object
  },
  source: {
    provider: {
      name: String
    }
  },
  prefix: String,
}

/**
 * 站点视频设定请求体
 */
export interface SiteVideoSettingsRequest extends SiteVideoSettings {
  accessToken: String
}

/**
 * 站点标准请求体
 */
export interface SiteQueryRequest {
  siteId: String,
  accessToken: String
}

/**
 * 站点分组
 */
export interface SiteGroup {
  siteId: String,
  group: String
}

/**
 * 站点分组 请求体
 */
export interface SiteGroupRequest extends SiteGroup {
  accessToken: String
}

export interface FFmpegConfig {
  streamSourceUri: String,
  streamSourceName: String
}