export class SamlParsedResponse {
    samlContent: string;
    extract: {
        conditions: {
            notOnOrAfter: string;
            notBefore: string
        },
        response: {
            issueInstant: string;
            id: string;
            inResponseTo: string;
            destination: string;
        },
        audience: string;
        issuer: string;
        nameID: string;
        sessionIndex: {
            sessionIndex: string;
            authnInstant: string;
        },
        attributes: {
            familyName: string;
            name: string;
            spidCode: string;
            email: string;
            fiscalNumber: [];
        }
    }
}