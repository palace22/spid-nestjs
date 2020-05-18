import * as validator from '@authenio/samlify-xsd-schema-validator';
import { Injectable, Req } from "@nestjs/common";
import * as fs from 'fs';
import * as saml from "samlify";
import { IdentityProvider } from "samlify/src/entity-idp";
import { ServiceProvider } from "samlify/src/entity-sp";
import { ServiceProviderSettings } from "samlify/types/src/types";
import * as uuid from 'uuid';
import { serviceProviderSetting } from './spid-config/service-provider-config.model';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-saml';
import { SamlParsedResponse } from '../models/samlParsedIdpResponse.model'
import { users } from 'src/users/users.db';

@Injectable()
export class SpidStrategy extends PassportStrategy(Strategy, 'spid') {
    private acs: string = 'http://localhost:3000/assertion'
    private serviceProvider: ServiceProvider
    private identityServiceProvider: IdentityProvider
    private spidServiceProviderMetadataOrder: string[] = ['KeyDescriptor', 'SingleLogoutService', 'NameIDFormat', 'AssertionConsumerService', 'AttributeConsumingService']
    private serviceProviderSetting: ServiceProviderSettings = serviceProviderSetting

    constructor() {
        super()
        saml.setSchemaValidator(validator);

        this.identityServiceProvider = saml.IdentityProvider(
            {
                metadata: fs.readFileSync('src/auth/meta/meta-idp.xml'),
                requestSignatureAlgorithm: 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha512',
                wantLogoutRequestSigned: true,
            }
        )
        this.serviceProvider = saml.ServiceProvider(Object.assign({}, this.serviceProviderSetting,
            {
                elementsOrder: this.spidServiceProviderMetadataOrder,
            })
        )

    }

    generateServiceProviderMetadata() {
        let metadata: string = this.serviceProvider.getMetadata()
        metadata = this.addAttributeConsumingService(metadata, 0, 'it', "Set0", ['name', 'familyName', 'fiscalNumber', 'email', 'spidCode'])
        return metadata
    }

    authenticate() {
        let request
        const { id, context } = this.serviceProvider.createLoginRequest(this.identityServiceProvider, 'redirect', loginRequestTemplate => {

            const nameIDFormat = this.serviceProvider.getEntitySetting().nameIDFormat;
            const id = '_' + uuid.v4()
            let a = loginRequestTemplate as any
            const context = this.replaceTagFromTemplate(a.context, {
                ID: id,
                Destination: this.identityServiceProvider.entityMeta.getSingleSignOnService('redirect'),
                Issuer: this.serviceProvider.entityMeta.getEntityID(),
                IssueInstant: new Date().toISOString(),
                NameIDFormat: Array.isArray(nameIDFormat) ? nameIDFormat[0] : nameIDFormat,
                AssertionConsumerServiceURL: this.serviceProvider.entityMeta.getAssertionConsumerService('post'),
                EntityID: this.serviceProvider.entityMeta.getEntityID(),
                AttributeConsumingServiceIndex: "0",
            })
            request = context
            return { id: id, context: context };
        })
        //this.redirect(context)
        return { id: id, context: context, request: request }
    }

    logout() {
        let a: any = this.serviceProvider.createLogoutRequest(this.identityServiceProvider, 'redirect', { logoutNameID: '11111', sessionIndex: '2' })
        console.log(a)
    }

    async parseResponse(idpResponse) {
        return await this.serviceProvider.parseLoginResponse(this.identityServiceProvider, 'post', idpResponse)
    }

    verify(id) {
        let parsedResponse: SamlParsedResponse = users[id].idpResponse
        if (parsedResponse) {
            if (parsedResponse.extract.response.destination === this.acs) {
                if (parsedResponse.extract.response.inResponseTo === id)
                    if (parsedResponse.extract.conditions.notOnOrAfter > (new Date()).toISOString())
                        return true
            }
        }
        return false
    }
    private addAttributeConsumingService(metadata: string, index: number, lang: string, groupName: string, attributes: string[]) {
        let attributesIndex = metadata.indexOf('</SPSSODescriptor>')
        let attributeConsumingService = '<AttributeConsumingService index="' + index + '"><ServiceName xml:lang="' + lang + '">' + groupName + '</ServiceName>'
        attributes.forEach(attribute => attributeConsumingService += '<RequestedAttribute Name="' + attribute + '"/>')
        attributeConsumingService += '</AttributeConsumingService>'
        return [metadata.slice(0, attributesIndex), attributeConsumingService, metadata.slice(attributesIndex)].join('')
    }

    private replaceTagFromTemplate(rawXML: string, tagValues: any): string {
        Object.keys(tagValues).forEach(t => {
            rawXML = rawXML.replace(new RegExp(`{${t}}`, 'g'), tagValues[t]);
        });
        return rawXML;
    }
}