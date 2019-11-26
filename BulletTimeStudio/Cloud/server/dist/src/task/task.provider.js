"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const task_schema_1 = require("./schemas/task.schema");
exports.taskProviders = [
    {
        provide: 'TaskModelToken',
        useFactory: (mongoose) => mongoose.connection.model('Task', task_schema_1.TaskSchema),
        inject: ['DbToken'],
    },
];
//# sourceMappingURL=task.provider.js.map