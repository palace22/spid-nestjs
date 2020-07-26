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

  @Post()
  getHello(@Body() body, @Res() res) {
    console.log(body)
    res.redirect(`http://localhost:3000`)
  }

  @Get('metadata')
  getSpMetadata() {
    return this.authService.getMetadata()
  }

  @Get('sso')
  getLogin() {
    let authenticationSpid = this.authService.authenticate()
    users[authenticationSpid.id] = {}
    users[authenticationSpid.id].request = authenticationSpid.request
    return authenticationSpid
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
    try {

      let parsed = await this.authService.parse({ query: query, body: body }) as any
      console.log(parsed)
      users[parsed.extract.response.inResponseTo].attributes = parsed.extract.attributes
      users[parsed.extract.response.inResponseTo].response = parsed.samlContent
      users[parsed.extract.response.inResponseTo].idpResponse = parsed
      users[parsed.extract.response.inResponseTo].sessionIndex = parsed.extract.sessionIndex.sessionIndex
      users[parsed.extract.response.inResponseTo].nameID = parsed.extract.nameID
      res.redirect(`http://localhost:3000/home/?SAMLResponse=${parsed.extract.response.inResponseTo}`)
    } catch (e) {
      console.log(e)
    }
  }

  @Post('logout')
  logoutRequest(@Body() body: any) {
    console.log(body)
    const logoutRequest = this.authService.logout(body.id)
    console.log(logoutRequest)
    return logoutRequest
  }
}