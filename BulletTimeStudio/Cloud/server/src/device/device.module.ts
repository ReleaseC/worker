import { Module } from '@nestjs/common';
import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';

@Module({
    controllers: [DeviceController],
    components: [DeviceService],
})
export class DeviceModule {}
