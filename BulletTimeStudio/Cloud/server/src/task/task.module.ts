import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { SiteService } from './site.service';
import { DatabaseModule } from '../database/database.module';
import { taskProviders } from './task.provider';

@Module({
    imports: [DatabaseModule],
    controllers: [TaskController],
    components: [
        TaskService, SiteService,
        ...taskProviders,
    ],
})
export class TaskModule {}
