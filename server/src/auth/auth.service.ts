import { Injectable } from '@nestjs/common';
import { SpidStrategy } from './spid.strategy';

@Injectable()
export class AuthService {

    constructor(private spidStrategy: SpidStrategy) { }

    getMetadata() {
        return this.spidStrategy.generateServiceProviderMetadata()
    }

    authenticate() {
        return this.spidStrategy.authenticate()
    }

    parse(toParse) {
        return this.spidStrategy.parseResponse(toParse)
    }

    red(url) {
        this.spidStrategy.redirect(url)
    }

    logout() {
        this.spidStrategy.logout()
    }

    verify(id: string): boolean {
        return this.spidStrategy.verify(id)
    }
}
