import {Module} from '@nestjs/common';
import {PartnerController} from './partner.controller';
import {PartnerService} from "./partner.service";

@Module({
    imports: [],
    controllers: [PartnerController],
    components: [
        PartnerService
    ],
    exports: []
})


// @Module({
//     imports: [DatabaseModule],
//     controllers: [ActivityController],
//     components: [
//         ActivityService,
//         ...activityProviders,
//     ],
// })

export class PartnerModule {
}
