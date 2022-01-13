import React from 'react';
import ReactDOM from 'react-dom';
import App from './app/App';
import reportWebVitals from './reportWebVitals';
import {ReactKeycloakProvider} from "@react-keycloak/web";
import keycloak from "./keycloak";
import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";
import Settings from "./settings/Settings";
import Admin from "./admin/Admin";
import Store from "./store/Store";
import Orders from "./order/Orders";
import Warehouse from "./warehouse/Warehouse";
import CartPage from "./cart/CartPage";
import {Provider} from "react-redux";
import store from "./redux/store";

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <ReactKeycloakProvider authClient={keycloak}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<App/>}/>
                        <Route path="settings" element={<Settings/>}/>
                        <Route path="admin" element={<Admin/>}/>
                        <Route path="store" element={<Store/>}/>
                        <Route path="orders" element={<Orders/>}/>
                        <Route path="warehouse" element={<Warehouse/>}/>
                        <Route path="cart" element={<CartPage/>}/>
                    </Routes>
                </BrowserRouter>
            </ReactKeycloakProvider>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
