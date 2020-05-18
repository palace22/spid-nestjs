import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  isVerified: boolean
  segment: string
  userInfo: User
  request: string
  response: string

  constructor(private authService: AuthService, private activatedRoute: ActivatedRoute) { }

  async ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.authService.getCredential(params.SAMLResponse).then((user: any) => {
        if (user) {
          this.userInfo = user.attributes
          this.request = user.request
          this.response = user.response
        }
      })
    })
  }

  segmentChanged($event) {
    this.segment = $event
  }

  async logout() {
    await this.authService.login()
  }
}

class User {
  email: string;
  spidCode?: string;
  familyName?: string;
  fiscalNumber?: string;
  name: string;
}
