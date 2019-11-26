import {Module} from '@nestjs/common';
import {WeparkController} from './wepark.controller';
import {DatabaseModule} from "../database/database.module";
import {ActivityController} from "../activity/activity.controller";
import {WeparkService} from "./wepark.service";

@Module({
    imports: [],
    controllers: [WeparkController],
    components: [
        WeparkService
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

export class WeparkModule {
}
