import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TasksService }  from './tasks/tasks.service';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  // await app.listen(3000);

  const tasksService = new TasksService();
  tasksService.doTasks();
  tasksService.removefile();
}
bootstrap();
