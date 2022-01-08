interface IConfig {
    keycloak: {
        URL: string
        REALM: string
        CLIENT_ID: string
    }
    api: {
        HOST: string
    }
}

const dev: IConfig = {
    keycloak: {
        URL: "http://keycloak.aquarel.ru/auth",
        REALM: "nds_realm",
        CLIENT_ID: "nds_app_dev"
    },
    api: {
        HOST: "http://api.aquarel.ru"
    }
};

const prod: IConfig = {
    keycloak: {
        URL: "http://keycloak.aquarel.ru/auth",
        REALM: "nds_realm",
        CLIENT_ID: "nds_app"
    },
    api: {
        HOST: "http://api.aquarel.ru"
    }
};

const config = process.env.REACT_APP_STAGE === 'production'
    ? prod
    : dev;

export default config