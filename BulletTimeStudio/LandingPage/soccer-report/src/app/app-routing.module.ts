import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportComponent } from './report/report.component';

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '', component: ReportComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
