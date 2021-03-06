import React, {FC, useEffect, useState} from "react";
import {useKeycloak} from "@react-keycloak/web";
import config from "../config";
import {IOrder} from "./WarehouseNewOrders";
import {IStore} from "../cart/CartPage";
import {Button, Stack} from "@mui/material";
import TransitComponentMapItem from "./TransitComponentMapItem";

interface ITransitComponent {
    store?: IStore
    setState: (s: boolean) => void
    state: boolean
}

const TransitComponent: FC<ITransitComponent> = ({store, setState, state}) => {
    const {keycloak} = useKeycloak()
    const [orders, setOrders] = useState<IOrder[]>()

    /**
     * Получить заказы со статусом "Готов в отправке" для магазина
     */
    const fetchReadyOrders = async () => {
        const pr = new URLSearchParams();
        if (store === undefined)
            return
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

    /**
     * Отправить заказы в магазин
     * @param body магазин
     */
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

    /**
     * Отправить заказы в магазин
     */
    const ordersToStore = () => {
        sendOrdersToStore(JSON.stringify(store)).then(() => {
            fetchReadyOrders().then((o) => {
                setOrders(o)
            })
        })
    }

    useEffect(() => {
        if (!!keycloak.authenticated && store !== undefined)
            fetchReadyOrders().then((o) => {
                setOrders(o)
            })
    }, [state, store])

    return (
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