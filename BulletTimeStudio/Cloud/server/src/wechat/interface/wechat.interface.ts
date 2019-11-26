import { Document } from 'mongoose';

export interface Wechat extends Document {
  readonly wechat: Object;
  readonly info: Object;
  readonly gameInfo:Object;
  readonly source: String;
  readonly time: String;
  readonly videoNames: Object;
  readonly likes: Object;
}
