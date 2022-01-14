import React, {FC, useEffect, useState} from "react";
import {IOrder} from "./WarehouseNewOrders";
import {Accordion, AccordionDetails, AccordionSummary, Button, Typography} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import config from "../config";
import {useKeycloak} from "@react-keycloak/web";
import {Goods} from "../app/NdsGoods";

interface IWarehouseOrdersMapItem {
    order: IOrder
    fetchOrdersCallback: () => void
    setState: (s: boolean) => void
    state: boolean
}

interface IGG {
    goodsLabel: Goods
    id: string
}

const WarehouseOrdersMapItem: FC<IWarehouseOrdersMapItem> = ({order, fetchOrdersCallback, setState, state}) => {
    const {keycloak} = useKeycloak()
    const [goods, setGoods] = useState<IGG[]>()

    const fetchOrderGoods = async () => {
        const pr = new URLSearchParams();
        pr.append("id_order", order.id)
        const url = config.api.HOST + "/api/v1/orders/order/goods?" + pr.toString()
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${keycloak.token}`
                }
            });
            const json: IGG[] = await response.json();
            // console.log(json);
            return json
        } catch
            (error) {
            console.log("error", error);
        }
        return
    }

    const markOrderAsReadyToShipment = async (body: string) => {
        const url = config.api.HOST + "/api/v1/main/orders/ready"
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
            const json: IGG[] = await response.json();
            // console.log(json);
            return json
        } catch
            (error) {
            console.log("error", error);
        }
        return
    }

    const markReady = () => {
        markOrderAsReadyToShipment(JSON.stringify(order)).then(() => {
            fetchOrdersCallback()
            setState(!state)
        })
    }

    useEffect(() => {
        if (keycloak.authenticated)
            fetchOrderGoods().then((g) => {
                setGoods(g)
                console.log(g)
            })
    }, [keycloak.authenticated])

    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon/>}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Typography>{order.id}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography variant={"button"}>
                    Состав:
                </Typography>
                {goods !== undefined && goods?.map((g) => {
                    return (
                        <Typography key={g.id}>
                            {g.goodsLabel.name}
                        </Typography>
                    )
                })}
                <Button variant={"outlined"} onClick={markReady}>Готово к отправке</Button>
            </AccordionDetails>
        </Accordion>
    )
}

export default WarehouseOrdersMapItem