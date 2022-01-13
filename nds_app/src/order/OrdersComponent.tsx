import React, {FC, useEffect, useState} from "react";
import {useKeycloak} from "@react-keycloak/web";
import {IOrder} from "../warehouse/WarehouseNewOrders";
import config from "../config";
import TransitComponentMapItem from "../warehouse/TransitComponentMapItem";
import {Button, Stack} from "@mui/material";
import OrdersComponentMapItem from "./OrdersComponentMapItem";

const OrdersComponent: FC = () => {
    const {keycloak} = useKeycloak()
    const [orders, setOrders] = useState<IOrder[]>()
    const fetchOrders = async () => {
        const url = config.api.HOST + "/api/v1/orders/all"
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

    const cancelOrderRequest = async (body: string) => {
        const url = config.api.HOST + "/api/v1/orders/order/cancel"
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

    const cancelOrder = (order: IOrder) => {
        cancelOrderRequest(JSON.stringify(order)).then(() => {
            fetchOrders().then((o) => {
                setOrders(o)
            })
        })
    }

    useEffect(() => {
        if (keycloak.authenticated)
            fetchOrders().then((o) => {
                setOrders(o)
            })
    }, [keycloak.authenticated])
    return(
        <>
            <Stack spacing={2}>
                {orders?.map((o) => {
                    return (
                        <OrdersComponentMapItem key={o.id} order={o} cancelOrderCallback={cancelOrder}/>
                    )
                })}
            </Stack>
        </>
    )
}

export default OrdersComponent