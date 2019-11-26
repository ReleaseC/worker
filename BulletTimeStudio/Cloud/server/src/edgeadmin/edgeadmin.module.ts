import { Module } from '@nestjs/common';
import { EdgeadminController } from './edgeadmin.controller';
import { EdgeadminService } from './edgeadmin.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [EdgeadminController],
  components: [
    EdgeadminService
  ],
  exports: [EdgeadminService]
})
export class EdgeadminModule {}