import React, {FC, useEffect, useState} from "react";
import {Accordion, AccordionDetails, AccordionSummary, Button, Typography} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {Goods} from "../app/NdsGoods";
import {IOrder} from "./WarehouseNewOrders";
import config from "../config";
import {useKeycloak} from "@react-keycloak/web";

interface ITransitComponentMapItem {
    order: IOrder
}

interface IGG {
    goodsLabel: Goods
    id: string
}

const TransitComponentMapItem: FC<ITransitComponentMapItem> = ({order}) => {
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

    useEffect(() => {
        if (keycloak.authenticated)
            fetchOrderGoods().then((g) => {
                setGoods(g)
                console.log(g)
            })
    }, [keycloak.authenticated])

    return(
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
            </AccordionDetails>
        </Accordion>
    )
}

export default TransitComponentMapItem