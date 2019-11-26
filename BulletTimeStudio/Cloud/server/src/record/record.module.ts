import { Module } from '@nestjs/common';
import { RecordController } from './record.controller';
import { RecordService } from './record.service';

@Module({
  //modules: [DatabaseModule],
  controllers: [RecordController],
  components: [
    RecordService
  ],
})
export class RecordModule {}