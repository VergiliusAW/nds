const dev = {
    keycloak: {
        CLIENT_ID: "nds_app_dev"
    },
};

const prod = {
    keycloak: {
        CLIENT_ID: "nds_app"
    },
};

const config = process.env.REACT_APP_STAGE === 'production'
    ? prod
    : dev;

export default config