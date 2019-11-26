import { Connection } from 'mongoose';
import { DatareportSchema } from './schemas/datareport.schema';

export const DatareportProviders = [
  {
    provide: 'DatereportModelToken',
    useFactory: (mongoose) => mongoose.connection.model('datareports', DatareportSchema),
    inject: ['DbToken'],
  },
];