import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { User } from '@papx/models';
import { take } from 'rxjs/operators';

import { AuthService } from '../auth.service';

@Component({
  selector: 'papx-pending',
  templateUrl: './pending.page.html',
  styleUrls: ['./pending.page.scss'],
})
export class PendingPage implements OnInit {
  user$ = this.service.user$;

  constructor(
    private service: AuthService,
    private toast: ToastController,
    private router: Router
  ) {}

  async sendVerifiactionMail(user: User) {
    await this.service.sendEmailVerification(user);
    const tos = await this.toast.create({
      message: 'Mensje enviado',
      position: 'bottom',
      animated: true,
      color: 'success',
      duration: 5000,
      buttons: [
        {
          side: 'end',
          icon: 'close',
          text: 'Cerrar',
          handler: () => {
            tos.dismiss();
          },
        },
      ],
    });
    tos.present();
  }

  ngOnInit() {
    this.user$.pipe(take(1)).subscribe((u) => {
      if (u && u.emailVerified) {
        this.router.navigate(['/']);
      }
    });
  }
}
