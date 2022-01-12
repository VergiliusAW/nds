import React, {FC, useEffect, useState} from 'react';
import {useKeycloak} from "@react-keycloak/web";
import config from "../config";
import Top from "../components/Top";
import NdsGoods from "./NdsGoods";

interface IData {
    name: string
    surname: string
}

const App: FC = () => {
    const {keycloak} = useKeycloak()

    const [data, setData] = useState<IData>()

    const req = async () => {
        const url = "http://api.aquarel.ru" + "/api/demo"
        // const token = keycloak.token
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${keycloak.token}`
                },
                // new Headers({
                //     'Authorization': `Bearer ${keycloak.token}`
                // })
            });
            const json = await response.json();
            console.log(json);
            setData(json)
            console.log(keycloak.idTokenParsed);
        } catch
            (error) {
            console.log("error", error);
        }
    };
    // useEffect(() => {
    //     if (keycloak.token !== undefined)
    //         req()
    // },[keycloak.token])


    return (
        <div>
            <Top/>
            <NdsGoods/>
        </div>
    );
}


export default App;
