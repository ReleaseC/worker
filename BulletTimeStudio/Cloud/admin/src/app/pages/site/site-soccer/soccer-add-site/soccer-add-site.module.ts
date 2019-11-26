import { NgModule, OnInit } from '@angular/core';
import { ThemeModule } from '../../../../@theme/theme.module';
import { CommonModule } from '@angular/common';
import { SoccerAddSiteComponent } from './soccer-add-site.component';


@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
  ],
  declarations: [SoccerAddSiteComponent],
})
export class SoccerAddSiteModule {
}
