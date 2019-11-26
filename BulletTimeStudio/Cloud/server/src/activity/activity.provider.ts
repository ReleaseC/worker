import { Connection } from 'mongoose';
import { ActivitySchema } from './schemas/activity.schema';

export const activityProviders = [
  {
    provide: 'ActivityModelToken',
    useFactory: (mongoose) => mongoose.connection.model('Activity', ActivitySchema),
    inject: ['DbToken'],
  },
];