import { Connection } from 'mongoose';
import { SitesSchema } from './schemas/site.schema';

export const SitesProviders = [
  {
    provide: 'SitesModelToken',
    useFactory: (mongoose) => mongoose.connection.model('sites', SitesSchema),
    inject: ['DbToken'],
  },
];