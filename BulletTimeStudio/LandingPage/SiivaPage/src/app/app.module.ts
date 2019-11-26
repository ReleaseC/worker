import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {HomePageComponent } from './homepage/homepage.component';
import {ResultComponent } from './result/result.component';
import {DownloadComponent } from './download/download.component';
import {FaceRecognitionFailComponent } from './faceRecognitionFail/face_recognition_fail.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app.routing';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
// import {FormsModule, ReactiveFormsModule } from '@angular/forms';
import {UploadPhotoComponent } from './uploadphoto/uploadphoto.component';
import{ShareService}from './share/share.service';
import{LoggerService}from './share/logger.service';
import { UploadImageService } from './share/upload-image.service';
import {FirstPageComponent } from './firstpage/firstpage.component';
import {Horizontal_ResultComponent } from './Horizontal_result/Horizontal_result.component';
import {HK_HomePageComponent } from './HK_homepage/HK_homepage.component';
import {HK_ResultComponent } from './HK_result/HK_result.component';
import {ScancodeComponent } from './scancode/scancode.component';
import {HK_DownloadComponent } from './HK_download/HK_download.component';
import {NguiInViewComponent } from './homepage/ngui-in-view.component';
import {Single_ResultComponent } from './Single_result/Single_result.component';
import {GYM_HomePageComponent } from './GYM_homepage/GYM_homepage.component';
import {GYMHorizontal_ResultComponent } from './GYMHorizontal_result/GYMHorizontal_result.component';
import {GYMVertical_ResultComponent } from './GYMVertical_result/GYMVertical_result.component';
import {AdvertiseComponent } from './advertise/advertise.component';
import { QRCodeModule } from 'angularx-qrcode';
import {PayComponent } from './pay/pay.component';
import {Advertise_carComponent } from './advertise_car/advertise_car.component';
import {Local_HomePageComponent } from './Local_homepage/Local_homepage.component';
import {Advertise_bullettimeComponent } from './advertise_bullettime/advertise_bullettime.component';
@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    ResultComponent,
    UploadPhotoComponent,
    DownloadComponent,
    FaceRecognitionFailComponent,
    FirstPageComponent,
    Horizontal_ResultComponent,
    HK_HomePageComponent,
    HK_ResultComponent,
    ScancodeComponent,
    HK_DownloadComponent,
    NguiInViewComponent,
    Single_ResultComponent,
    GYM_HomePageComponent,
    GYMHorizontal_ResultComponent,
    GYMVertical_ResultComponent,
    AdvertiseComponent,
    PayComponent,
    Local_HomePageComponent,
    Advertise_carComponent,
    Advertise_bullettimeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    QRCodeModule
    // ReactiveFormsModule
  ],
  providers: [ShareService,LoggerService,UploadImageService],
  bootstrap: [AppComponent]
})
export class AppModule {}
