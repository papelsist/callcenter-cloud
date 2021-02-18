import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './@auth';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private auth: AuthService, private router: Router) {}

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

  signOut() {
    this.auth.singOut();
    this.router.navigate(['/login']);
  }
}
