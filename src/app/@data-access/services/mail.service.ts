import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

import { MailJet } from '@papx/models';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class MailService {
  // apiUrl = 'https://api.mailjet.com/v3.1/send';
  apiUrl = 'mail';
  publicKey = 'dda57c6f1b05ba91716ad671cac123da';
  privateKey = 'adf9d2d63f72f3ae1aca7c83ceb01855';
  constructor(private http: HttpClient) {}

  sendMail(payload: MailJet.SendParams): Observable<MailJet.PostResponse> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append(
        'Authorization',
        'Basic ' +
          btoa(
            'dda57c6f1b05ba91716ad671cac123da:adf9d2d63f72f3ae1aca7c83ceb01855'
          )
      );
    console.log('Headers: ', headers);
    return this.http
      .post<MailJet.PostResponse>(this.apiUrl, payload, { headers })
      .pipe(catchError((err) => throwError(err)));
  }
}
