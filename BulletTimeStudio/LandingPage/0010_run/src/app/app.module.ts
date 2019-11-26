import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
import {Location} from '@angular/common';
import { SearchComponent } from './search/search.component';
import { FailComponent } from './fail/fail.component';
import { ResultComponent } from './result/result.component';
import { AppRoutingModule } from './app-routing.module';
import { WaitingComponent } from './waiting/waiting.component';
@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    FailComponent,
    ResultComponent,
    WaitingComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
