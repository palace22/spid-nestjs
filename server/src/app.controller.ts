import { Controller, Get, Post, Body, Res, Query, UseGuards, Req, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { users, User } from './users/users.db';
import { SamlParsedResponse } from './models/samlParsedIdpResponse.model'
import { verify } from 'crypto';
@Controller()
export class AppController {

  data

  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService) { }

  @Get()
  getHello(): string {
    console.log('HELLO')
    return this.appService.getHello();
  }

  @Get('v1')
  get(@Body() body: any, @Res() res) {
    console.log(body)
    res.redirect('http://localhost:8100/home?SAML=2222')
  }

  @Get('metadata')
  getSpMetadata() {
    return this.authService.getMetadata()
  }

  @Get('sso')
  getLogin(@Res() res: Response) {
    let authenticationSpid = this.authService.authenticate()
    users[authenticationSpid.id] = {}
    users[authenticationSpid.id].request = authenticationSpid.request
    res.send(authenticationSpid)
  }

  @Post(`getUser`)
  getUser(@Body() body: any): User {
    if (this.authService.verify(body.id))
      return users[body.id]
    else
      return undefined
  }

  @Post('assertion')
  async test1(@Body() body, @Query() query, @Res() res) {
    let parsed = await this.authService.parse({ query: query, body: body }) as any
    users[parsed.extract.response.inResponseTo].attributes = parsed.extract.attributes
    users[parsed.extract.response.inResponseTo].response = parsed.samlContent
    users[parsed.extract.response.inResponseTo].idpResponse = parsed
    res.redirect(`http://localhost:3000/home/?SAMLResponse=${parsed.extract.response.inResponseTo}`)
  }

  @Get('logout')
  logoutRequest() {
    this.authService.logout()
  }
}