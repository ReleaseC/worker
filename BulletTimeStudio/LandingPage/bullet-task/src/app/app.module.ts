import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatGridListModule,
  MatCardModule,
  MatMenuModule,
  MatIconModule,
  MatButtonModule,
  MatTableModule,
  MatFormFieldModule,
  MatInputModule,
  MatCheckboxModule,
  MatSlideToggleModule,
} from '@angular/material';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { TasklistComponent } from './tasklist/tasklist.component';

@NgModule({
  declarations: [
    AppComponent,
    TasklistComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSlideToggleModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
