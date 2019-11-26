import { Document } from 'mongoose';

export interface Users extends Document {
  readonly wechat :Object;
  readonly game_id: String;
  readonly name: String;
  readonly game_time:String;
  readonly is_video: Number;
  readonly source:String
  readonly likes:Number
  
}
