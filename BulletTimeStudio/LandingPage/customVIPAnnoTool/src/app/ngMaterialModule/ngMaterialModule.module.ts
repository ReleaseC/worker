import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatProgressSpinnerModule,
 } from '@angular/material';

@NgModule({
    exports: [
        BrowserAnimationsModule,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        MatOptionModule,
        MatProgressSpinnerModule,
    ]
})
export class NgMaterialModule {}
