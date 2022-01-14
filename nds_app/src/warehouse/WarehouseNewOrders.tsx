import React, {FC, useEffect, useState} from "react";
import {IStore} from "../cart/CartPage";
import config from "../config";
import {useKeycloak} from "@react-keycloak/web";
import {Stack} from "@mui/material";
import WarehouseOrdersMapItem from "./WarehouseOrdersMapItem";

interface IWarehouseNewOrders {
    store?: IStore
    setState: (s: boolean) => void
}

export enum Status {
    /**
     * Новый заказ
     */
    NEW,

    /**
     * Готов к отправке
     */
    READY_TO_SHIPMENT,

    /**
     * В пути
     */
    IN_TRANSIT,

    /**
     * Готов к выдаче
     */
    READY_TO_ISSUE,

    /**
     * Выдан
     */
    ISSUED,

    /**
     * Отменён
     */
    CANCELED
}

export interface IOrder {
    id: string
    id_nds_user: string
    status: Status
    creation_date: Date
    last_change_date: Date
}

const WarehouseNewOrders: FC<IWarehouseNewOrders> = ({store, setState}) => {
    const {keycloak} = useKeycloak()
    const [orders, setOrders] = useState<IOrder[]>()
    /**
     * Получить новые заказы
     */
    const fetchNewOrders = async () => {
        const pr = new URLSearchParams();
        if (store === undefined)
            return
        pr.append("id_store", store.id)
        const url = config.api.HOST + "/api/v1/main/orders/store/new?" + pr.toString()
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
     * callback на получение новых заказов
     */
    const fetchOrdersCallback = () => {
        fetchNewOrders().then((o) => {
            setOrders(o)
        })
    }

    useEffect(() => {
        if (keycloak.authenticated && store !== undefined)
            fetchNewOrders().then((o) => {
                setOrders(o)
            })
    }, [store, keycloak.authenticated])

    return (
        <>
            <Stack spacing={2}>
                {orders?.map((o) => {
                    return (
                        <WarehouseOrdersMapItem key={o.id} order={o} fetchOrdersCallback={fetchOrdersCallback}
                                                setState={setState}/>
                    )
                })}
            </Stack>
        </>
    )
}

export default WarehouseNewOrders