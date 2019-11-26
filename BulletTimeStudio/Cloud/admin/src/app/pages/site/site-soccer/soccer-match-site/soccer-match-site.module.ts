import { NgModule } from '@angular/core';
import { ThemeModule } from '../../../../@theme/theme.module';
import { CommonModule } from '@angular/common';
import { SoccerMatchSiteComponent } from './soccer-match-site.component';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
  ],
  declarations: [SoccerMatchSiteComponent],
})
export class SoccerMatchSiteModule { }
