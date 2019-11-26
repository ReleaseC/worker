import * as mongoose from 'mongoose';

export const WechatSchema = new mongoose.Schema({
  wechat: Object,//用户微信access_token信息
  info: Object,//用户微信基本信息
  source: String,//来源,页面siteId
  time: String,//进入数据库的时间
  videoNames: Object,//用户子弹时间视频名称
  gameInfo:Object,//路跑用户的信息
  likes: Object//点赞量
});
