import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) { }

  login() {
    this.httpClient
      .get('http://localhost:3000/sso')
      .toPromise().then(authenticationSpid => authenticationSpid as { id: string, context: string })
      .then(authenticationSpid => {
        window.location.href = authenticationSpid.context
      })
      .catch(e => { console.log(e) })
  }

  async verify(id: string) {
    console.log(id)
    return await this.httpClient
      .post('http://localhost:3000/verify', { id: id }).pipe(map(a => a))
      .toPromise()
  }

  getCredential(id: string) {
    return this.httpClient.post('http://localhost:3000/getUser', { id: id })
      .pipe(map(a => a))
      .toPromise()
  }

}
