import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomePageComponent } from './homepage/homepage.component';
import {ResultComponent } from './result/result.component';
import {HK_HomePageComponent } from './HK_homepage/HK_homepage.component';
import {HK_ResultComponent } from './HK_result/HK_result.component';
import {DownloadComponent } from './download/download.component';
import {UploadPhotoComponent } from './uploadphoto/uploadphoto.component';
import {FaceRecognitionFailComponent } from './faceRecognitionFail/face_recognition_fail.component';
import {FirstPageComponent } from './firstpage/firstpage.component';
import {Horizontal_ResultComponent } from './Horizontal_result/Horizontal_result.component';
import {ScancodeComponent } from './scancode/scancode.component';
import {HK_DownloadComponent } from './HK_download/HK_download.component';
import {Single_ResultComponent } from './Single_result/Single_result.component';
import {GYM_HomePageComponent } from './GYM_homepage/GYM_homepage.component';
import {GYMHorizontal_ResultComponent } from './GYMHorizontal_result/GYMHorizontal_result.component';
import {GYMVertical_ResultComponent } from './GYMVertical_result/GYMVertical_result.component';
import {AdvertiseComponent } from './advertise/advertise.component';
import {PayComponent } from './pay/pay.component';
import {Local_HomePageComponent } from './Local_homepage/Local_homepage.component';
import {Advertise_carComponent } from './advertise_car/advertise_car.component';
import {Advertise_bullettimeComponent } from './advertise_bullettime/advertise_bullettime.component';
const routes: Routes = [
    {
        path: '',
        redirectTo: '/homepage',
        pathMatch: 'full',
    },
    { path: 'firstpage', component: FirstPageComponent},
    { path: 'homepage', component: HomePageComponent},
    { path: 'result', component: ResultComponent},
    { path: 'HK_homepage', component: HK_HomePageComponent},
    { path: 'GYM_homepage', component: GYM_HomePageComponent},
    { path: 'GYMHorizontal_result', component: GYMHorizontal_ResultComponent},
    { path: 'GYMVertical_result', component: GYMVertical_ResultComponent},
    { path: 'HK_result', component: HK_ResultComponent},
    { path: 'HK_download', component: HK_DownloadComponent},
    { path: 'Horizontal_result', component: Horizontal_ResultComponent},
    { path: 'uploadphoto', component: UploadPhotoComponent},
    { path: 'download', component: DownloadComponent},
    { path: 'recognitionFail', component: FaceRecognitionFailComponent},
    { path: 'scancode', component: ScancodeComponent},
    { path: 'Single_result', component: Single_ResultComponent},
    { path: 'advertise', component: AdvertiseComponent},
    { path: 'advertise_car', component: Advertise_carComponent},
    { path: 'pay', component: PayComponent},
    { path: 'Local_homepage', component: Local_HomePageComponent},
    { path: 'advertise_bullettime', component: Advertise_bullettimeComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes,{ useHash: true })],
    exports: [RouterModule]
})

export class AppRoutingModule {}
