import * as fs from 'fs'
import { ServiceProviderSettings } from "samlify/types/src/types";

const serviceProviderSetting: ServiceProviderSettings = {
    //encryptCert: fs.readFileSync('src/auth/certs/crt.pem'),
    //metadata: fs.readFileSync('src/auth/meta/meta-sp.xml'),
    privateKeyPass: 'q9ALNhGT5EhfcRmp8Pg7e9zTQeP2x1bW',
    encPrivateKeyPass: 'q9ALNhGT5EhfcRmp8Pg7e9zTQeP2x1bW',
    privateKey: fs.readFileSync('src/auth/certs/key.pem'),
    entityID: 'http://localhost:3000',

    authnRequestsSigned: true,
    wantAssertionsSigned: true,
    signingCert: fs.readFileSync('src/auth/certs/crt.pem'),
    requestSignatureAlgorithm: 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha512',
    wantLogoutRequestSigned: true,
    assertionConsumerService: [{
        Location: 'http://localhost:3000/assertion',
        Binding: 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST',
    }],
    singleLogoutService: [{
        Location: 'http://localhost:3000',
        Binding: 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST',  //urn:oasis:names:tc:SAML:2.0:bindings:SOAP //urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect
    },
    {
        Location: 'http://localhost:3000',
        Binding: 'urn:oasis:names:tc:SAML:2.0:bindings:SOAP',  //urn:oasis:names:tc:SAML:2.0:bindings:SOAP //urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect
    },
    {
        Location: 'http://localhost:3000',
        Binding: 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect',  //urn:oasis:names:tc:SAML:2.0:bindings:SOAP //urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect
    }],
    nameIDFormat: ['urn:oasis:names:tc:SAML:2.0:nameid-format:transient'],
    loginRequestTemplate: {
        context: fs.readFileSync('src/auth/templates/loginRequestTemplate.xml').toString(),
    },
    logoutRequestTemplate:{
        context: fs.readFileSync('src/auth/templates/logoutRequestTemplate.xml').toString(),
    }
}


export { serviceProviderSetting }