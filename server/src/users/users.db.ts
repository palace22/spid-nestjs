import { SamlParsedResponse } from "src/models/samlParsedIdpResponse.model";

let users = new Map<string, User>()


class User {
    id: string;
    signature?: string;
    request: string;
    response: string;
    attributes?: {};
    idpResponse?: SamlParsedResponse;
    sessionIndex?: string;
    nameID?: string;
}

export { User, users }