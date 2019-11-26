import { Document } from 'mongoose';

export interface Datareport extends Document {
  readonly activity_id: String;
  readonly taskId: String;
  readonly siteId: String;
  readonly templateId: String;
  readonly time: String;
  readonly visit: Number;
  readonly download: Number;
  readonly play: Number;
  readonly like: Number;
  readonly share: Number;
}
