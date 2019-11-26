import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by">Created with ♥ by <b><a href="http://www.siiva.com" target="_blank">SIIVA</a></b> 2019-04-15 12:50</span>
  `,
})
export class FooterComponent {
}
