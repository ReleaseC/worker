import * as mongoose from 'mongoose';

export const SitesSchema = new mongoose.Schema({
  siteId: String,//活动编号
  name: String,//活动名称
  type: String,//BT-1
  param: Object,//剪辑的参数
  source: Object,
  output: Object,//输出的参数
  workerId: String,//分配的worker
  accessToken: String,//未知
  expireTime: String,//未知
  template:Object//可用的模板
});
