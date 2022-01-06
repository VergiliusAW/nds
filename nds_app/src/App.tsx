import React, {FC} from 'react';
import {useKeycloak} from "@react-keycloak/web";

const App: FC = () => {
    const {keycloak} = useKeycloak()
    return (
        <div className="App">
            {!keycloak.authenticated && (
                <button
                    type="button"
                    onClick={() => keycloak.login()}
                >
                    Login
                </button>
            )}

            {!!keycloak.authenticated && (
                <button
                    type="button"
                    onClick={() => keycloak.logout()}
                >
                    Logout (
                    {
                        // @ts-ignore
                        keycloak.tokenParsed.given_name
                    } {

                })
                </button>
            )}
        </div>
    );
}


export default App;
