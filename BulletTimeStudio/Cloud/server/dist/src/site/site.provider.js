"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const site_schema_1 = require("./schemas/site.schema");
exports.SitesProviders = [
    {
        provide: 'SitesModelToken',
        useFactory: (mongoose) => mongoose.connection.model('sites', site_schema_1.SitesSchema),
        inject: ['DbToken'],
    },
];
//# sourceMappingURL=site.provider.js.map