import { Module } from '@nestjs/common';
import { SiteController } from './site.controller';
import { DatabaseModule } from '../database/database.module';
import { SiteService } from './site.service';
import { SitesProviders } from './site.provider';

@Module({
    imports: [DatabaseModule],
    controllers: [SiteController],
    components: [
        SiteService,
        ...SitesProviders
      ],
    //   exports: [UsersService]
})
export class SiteModule {}