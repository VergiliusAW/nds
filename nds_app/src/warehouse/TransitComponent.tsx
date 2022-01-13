import React, {FC, useEffect, useState} from "react";
import {useKeycloak} from "@react-keycloak/web";
import config from "../config";
import {IOrder} from "./WarehouseNewOrders";
import {IStore} from "../cart/CartPage";
import WarehouseOrdersMapItem from "./WarehouseOrdersMapItem";
import {Button, Stack} from "@mui/material";
import TransitComponentMapItem from "./TransitComponentMapItem";

interface ITransitComponent {
    store: IStore
}

const TransitComponent: FC<ITransitComponent> = ({store}) => {
    const {keycloak} = useKeycloak()
    const [orders, setOrders] = useState<IOrder[]>()
    const fetchReadyOrders = async () => {
        const pr = new URLSearchParams();
        pr.append("id_store", store.id)
        const url = config.api.HOST + "/api/v1/main/orders/store/ready?" + pr.toString()
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${keycloak.token}`
                }
            });
            const json: IOrder[] = await response.json();
            console.log(json);
            return json
        } catch
            (error) {
            console.log("error", error);
        }
        return
    }

    const sendOrdersToStore = async (body: string) => {
        const url = config.api.HOST + "/api/v1/main/orders/transit"
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${keycloak.token}`
                },
                body: body
            });
            const json: IOrder[] = await response.json();
            console.log(json);
            return json
        } catch
            (error) {
            console.log("error", error);
        }
        return
    }

    const ordersToStore = () => {
        sendOrdersToStore(JSON.stringify(store)).then(() => {
            fetchReadyOrders().then((o) => {
                setOrders(o)
            })
        })
    }

    useEffect(() => {
        if (keycloak.authenticated)
            fetchReadyOrders().then((o) => {
                setOrders(o)
            })
    }, [store, keycloak.authenticated])

    return(
        <>
            <Stack spacing={2}>
                {orders?.map((o) => {
                    return (
                        <TransitComponentMapItem key={o.id} order={o}/>
                    )
                })}
                <Button variant={"outlined"} onClick={ordersToStore}>Отправить в магазин</Button>
            </Stack>

        </>
    )
}

export default TransitComponent