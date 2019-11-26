"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const activity_schema_1 = require("./schemas/activity.schema");
exports.activityProviders = [
    {
        provide: 'ActivityModelToken',
        useFactory: (mongoose) => mongoose.connection.model('Activity', activity_schema_1.ActivitySchema),
        inject: ['DbToken'],
    },
];
//# sourceMappingURL=activity.provider.js.map