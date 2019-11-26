import { Module } from '@nestjs/common';

import { SystemModule } from './system/system.module';

@Module({
    modules: [
        SystemModule
    ]
})
export class ApplicationModule { }