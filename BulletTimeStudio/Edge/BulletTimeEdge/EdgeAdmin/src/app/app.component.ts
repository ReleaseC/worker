import { Component, OnInit } from '@angular/core';
import { SocketService } from './shared/socket.service';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'app';
  connectMsg: string;

  constructor(private socketService: SocketService, private swUpdate: SwUpdate) { }
  ngOnInit() {
    this.socketService.connect((res) => {
      this.connectMsg = res;
    });
    // service worker update
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(() => {
        if (confirm('New version available. Load New Version?')) {
          window.location.reload();
        }
      });
    }
  }
}
