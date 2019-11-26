import { NgModule } from '@angular/core';
import { ThemeModule } from '../../../../@theme/theme.module';
import { CommonModule } from '@angular/common';
import { SoccerManageSiteComponent } from './soccer-manage-site.component';
import { MatRadioModule, MatCheckboxModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    MatRadioModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [SoccerManageSiteComponent],
})
export class SoccerManageSiteModule { }
