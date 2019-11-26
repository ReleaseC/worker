import { Module } from '@nestjs/common';
import { RecordModule } from './record/record.module';
@Module({
  imports: [],
  components: [],
  modules: [RecordModule]
})
export class ApplicationModule {}
