import * as mongoose from 'mongoose';

export const UsersSchema = new mongoose.Schema({
  wechat :Object,
  game_id: String,//用户比赛编号
  name: String,//姓名
  game_time: String,//比赛成绩
  is_video: Number,//是否有视频
  source:String,//哪场比赛
  likes:Number
});
