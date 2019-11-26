import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TasksController } from './tasks/tasks.controller';

@Module({
  imports: [],
  controllers: [AppController, TasksController],
  components: [],
})
export class AppModule {}
