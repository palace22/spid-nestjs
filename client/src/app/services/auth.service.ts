import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserSpid } from '../home/home.page';

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
      .post('http://localhost:3000/verify', { id: id }).pipe(first())
      .toPromise()
  }

  getCredential(id: string): Observable<UserSpid> {
    return this.httpClient.post('http://localhost:3000/getUser', { id: id })
      .pipe(first()) as Observable<UserSpid>
  }

  logout(id: string) {
    this.httpClient
      .post('http://localhost:3000/logout', { id: id }).pipe(first())
      .toPromise().then(logoutSpid => logoutSpid as any)
      .then(logoutSpid => {
        window.location.href = logoutSpid.context
      })
      .catch(e => { console.log(e) })
  }

}
