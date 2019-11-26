import * as mongoose from 'mongoose';

export const ActivitySchema = new mongoose.Schema({
  activityId: String,
  activityName: String,
  group: String,
  address: String,
  mark: String,
  createdAt: String,
  visits: Array
});
