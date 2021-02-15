import { Component, OnInit } from '@angular/core';
import { AuthService } from './@auth';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.debugUserInfo();
  }

  private debugUserInfo() {
    this.auth.user$.subscribe((user) => {
      console.info(`Firebase user: ', ${user?.displayName} (${user?.email})`);
      console.info('Verified: ', user?.emailVerified);
    });
    this.auth.userInfo$.subscribe((userInfo) => {
      console.log('User detail: ', userInfo);
    });
  }
}
