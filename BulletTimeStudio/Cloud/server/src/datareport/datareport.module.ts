import { Module } from '@nestjs/common';
import { DatareportController } from './datareport.controller';
import { DatareportService } from './datareport.service';
import { DatabaseModule } from '../database/database.module';
import { DatareportProviders } from './datareport.provider';


@Module({
  imports: [DatabaseModule],
  controllers: [DatareportController],
  components: [DatareportService,
    ...DatareportProviders],
  exports:[DatareportService]
})
export class DatareportModule {}