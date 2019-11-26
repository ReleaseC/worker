import { Connection } from 'mongoose';
import { UsersSchema } from './schemas/users.schema';

export const UsersProviders = [
  {
    provide: 'UsersModelToken',
    useFactory: (mongoose) => mongoose.connection.model('runusers', UsersSchema),
    inject: ['DbToken'],
  },
];