import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable()
export class LoadingService {
  constructor(public controller: LoadingController) {}

  async startLoading(message: string = 'Procesando') {
    const loading = await this.controller.create({
      message,
    });
    await loading.present();
  }

  async stopLoading(data?: any, role?: string, id?: string) {
    await this.controller.dismiss(data, role, id);
  }
}
