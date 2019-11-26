import { Module } from '@nestjs/common';
import { CustomizeService } from './customize.service';
import { CustomizeController } from './customize.controller';

@Module({
  controllers: [
    CustomizeController,
],
components: [
  CustomizeService,
],
})
export class CustomizeModule {}
