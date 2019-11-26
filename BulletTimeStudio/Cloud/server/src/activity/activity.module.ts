import { Module } from '@nestjs/common';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { DatabaseModule } from '../database/database.module';
import { activityProviders } from './activity.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [ActivityController],
  components: [
    ActivityService,
    ...activityProviders,
  ],
})
export class ActivityModule {}
