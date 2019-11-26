import { Module } from '@nestjs/common';
import { RecordModule } from './record/record.module';
import { SystemModule } from './system/system.module';
@Module({
  imports: [],
  components: [],
  modules: [RecordModule, SystemModule]
})
export class ApplicationModule {}
