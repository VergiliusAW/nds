import Keycloak from "keycloak-js";
import config from "./config";
const keycloak = Keycloak({
    url: "http://keycloak.aquarel.ru/auth",
    realm: "nds_realm",
    clientId: config.keycloak.CLIENT_ID,
});

export default keycloak;