import { Connection } from 'mongoose';
import { TaskSchema } from './schemas/task.schema';

export const taskProviders = [
  {
    provide: 'TaskModelToken',
    useFactory: (mongoose) => mongoose.connection.model('Task', TaskSchema),
    inject: ['DbToken'],
  },
];