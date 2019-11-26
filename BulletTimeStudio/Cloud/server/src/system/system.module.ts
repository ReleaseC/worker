import { Module } from '@nestjs/common';
import { SystemController } from './system.controller';
import { SystemService } from './system.service';

@Module({
    controllers: [SystemController],
    components: [
        SystemService,
    ],
})
export class SystemModule {}