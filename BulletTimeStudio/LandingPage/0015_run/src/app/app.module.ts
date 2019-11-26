import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import {TreadmillComponent } from './treadmill/treadmill.component';
import { AppRoutingModule } from './app-routing.module';
import {VideoListComponent } from './videolist/videolist.component';
import {ResultComponent } from './result/result.component';
import {DownloadComponent } from './download/download.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    TreadmillComponent,
    VideoListComponent,
    ResultComponent,
    DownloadComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
