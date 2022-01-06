import Keycloak from "keycloak-js";
const keycloak = Keycloak({
    url: "http://keycloak.aquarel.ru/auth",
    realm: "nds_realm",
    clientId: "nds_app_dev",
});

export default keycloak;