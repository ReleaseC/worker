"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const users_schema_1 = require("./schemas/users.schema");
exports.UsersProviders = [
    {
        provide: 'UsersModelToken',
        useFactory: (mongoose) => mongoose.connection.model('runusers', users_schema_1.UsersSchema),
        inject: ['DbToken'],
    },
];
//# sourceMappingURL=users.provider.js.map