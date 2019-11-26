"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datareport_schema_1 = require("./schemas/datareport.schema");
exports.DatareportProviders = [
    {
        provide: 'DatereportModelToken',
        useFactory: (mongoose) => mongoose.connection.model('datareports', datareport_schema_1.DatareportSchema),
        inject: ['DbToken'],
    },
];
//# sourceMappingURL=datareport.provider.js.map