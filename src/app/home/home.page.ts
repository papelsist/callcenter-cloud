import { Component } from '@angular/core';

import { AuthService } from '../@auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  title = 'SX-CALLCENTER2';
  user$ = this.auth.userInfo$;
  host = location.href;
  constructor(private auth: AuthService) {}

  ionViewDidEnter() {}
}
