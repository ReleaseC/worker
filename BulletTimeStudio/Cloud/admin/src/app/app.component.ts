/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './@core/utils/analytics.service';
import { NavigationEnd, Router } from '@angular/router';
import { distinctUntilChanged } from 'rxjs/operators';

declare let gtag: Function;

@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {

  constructor(
    private analytics: AnalyticsService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.analytics.trackPageViews();

    this.router.events
      .pipe(distinctUntilChanged((previous: any, current: any) => {
        if (current instanceof NavigationEnd) {
          return previous.url === current.url;
        }
        return true;
      }))
      .subscribe(
        (x: any) => { gtag('event', 'page_view', { 'page_path': x.url }); });
  }

  
}
