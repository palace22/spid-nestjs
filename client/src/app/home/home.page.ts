import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';

export class UserSpid { attributes: User; response: string; request: string }
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  userSpidObs: Observable<UserSpid>
  userSpid: UserSpid
  isVerified: boolean
  segment: string = 'profile'
  id: string

  constructor(private authService: AuthService, private activatedRoute: ActivatedRoute) { }

  async ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.id = params.SAMLResponse
      this.userSpidObs = this.authService.getCredential(this.id)
    })
    this.userSpidObs.subscribe((userSpid: UserSpid) => {
      this.userSpid = userSpid
    })
  }

  segmentChanged($event) {
    this.segment = $event
  }

  async logout() {
    await this.authService.logout(this.id)
  }
}

class User {
  email: string;
  spidCode?: string;
  familyName?: string;
  fiscalNumber?: string;
  name: string;
}
