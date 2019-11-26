import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteBasketballComponent } from './site-basketball.component'
import { BasketballManageSiteModule } from './basketball-manage-site/basketball-manage-site.module'
import { SiteBasketballRoutingModule } from './site-basketball-routing.module'

@NgModule({
  imports: [
    CommonModule,
    BasketballManageSiteModule,
    SiteBasketballRoutingModule,
  ],
  declarations: [SiteBasketballComponent],
})
export class SiteBasketballModule { }
