import { NgModule } from '@angular/core';
import { ThemeModule } from '../../../../@theme/theme.module';
import { CommonModule } from '@angular/common';
import { SoccerQuerySiteComponent } from './soccer-query-site.component';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
  ],
  declarations: [SoccerQuerySiteComponent],
})
export class SoccerQuerySiteModule { }
