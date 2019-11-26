import { NgModule } from '@angular/core';


import { ThemeModule } from '../../@theme/theme.module';
import { TasklistComponent } from './tasklist.component';
import { SoccerListComponent } from './soccer/soccer.component';
import { BullettimeListComponent } from './bullettime/bullettime.component';



@NgModule({
    imports: [
        ThemeModule,
    ],
    declarations: [
        TasklistComponent,
        SoccerListComponent,
        BullettimeListComponent,
    ],
})
export class TasklistModule { }
