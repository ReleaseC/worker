import * as mongoose from 'mongoose';

export const databaseProviders = [
    {
        provide: 'DbToken',
        useFactory: async () => {
            (mongoose as any).Promise = global.Promise;

            let config = require(`../../config/${process.env.NODE_ENV || 'production'}.json`);
            await mongoose.connect(config.mongodb, {});
            return mongoose;
        },
    },
];
