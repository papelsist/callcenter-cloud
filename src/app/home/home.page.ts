import { Component } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { AuthService } from '../@auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  title = 'Callcenter App';
  user$ = this.auth.userInfo$;
  host = location.href;
  constructor(private auth: AuthService, private afm: AngularFireMessaging) {}

  ionViewDidEnter() {}

  requestPermission() {
    this.afm.requestPermission.subscribe(
      () => console.log('Permission granted!'),
      (error) => console.log(error)
    );
  }
}
