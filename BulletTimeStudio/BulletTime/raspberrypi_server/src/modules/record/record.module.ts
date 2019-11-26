import { Module } from '@nestjs/common';
import { RecordController } from './record.controller';
import { RecordService } from './record.service';
//import { usersProviders } from './test.providers';
//import { DatabaseModule } from '../database/database.module';


@Module({
  //modules: [DatabaseModule],
  controllers: [RecordController],
  components: [
    RecordService
  ],
})
export class RecordModule {}