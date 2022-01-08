import Keycloak from "keycloak-js";
import config from "./config";
const keycloak = Keycloak({
    url: config.keycloak.URL,
    realm: config.keycloak.REALM,
    clientId: config.keycloak.CLIENT_ID,
});

export default keycloak;