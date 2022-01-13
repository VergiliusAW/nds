import React, {FC, useEffect, useState} from "react";
import {Accordion, AccordionDetails, AccordionSummary, Button, Chip, Stack, Typography} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {Goods} from "../app/NdsGoods";
import config from "../config";
import {useKeycloak} from "@react-keycloak/web";
import {IOrder, Status} from "../warehouse/WarehouseNewOrders";

interface IOrdersComponentMapItem {
    order: IOrder
    cancelOrderCallback: (order: IOrder) => void
}

interface IGG {
    goodsLabel: Goods
    id: string
}

const OrdersComponentMapItem: FC<IOrdersComponentMapItem> = ({order, cancelOrderCallback}) => {
    const {keycloak} = useKeycloak()
    const [goods, setGoods] = useState<IGG[]>()
    const [status, setStatus] = useState<Status>()

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
                // console.log(g)
            })
    }, [keycloak.authenticated])

    useEffect(() => {
        setStatus(order.status)
        // if (status !== undefined) {
        //     const a = parseInt(Status[status])
        //     const b = Status.CANCELED
        //     console.log('a',a)
        //     console.log('b',b)
        //     console.log('compare', a === b)
        // }
        // console.log(status)
    }, [order.status, status])

    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon/>}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Stack direction={"row"} spacing={2}>
                    <Chip label={order.status}/>
                    <Typography>Заказ {order.id}</Typography>
                    <Typography>от {order.creation_date}</Typography>
                </Stack>

            </AccordionSummary>
            <AccordionDetails>
                <Stack direction={"row"} spacing={2}>
                    <Stack>
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
                    </Stack>
                    <Stack>
                        <Typography variant={"button"}>
                            Дата последнего редактирования: {order.last_change_date}
                        </Typography>
                    </Stack>
                    <Stack>
                        <Typography variant={"button"}>
                            Id: {order.id}
                        </Typography>
                    </Stack>
                </Stack>
                {status !== undefined &&
                    Status.CANCELED !== parseInt(Status[status]) &&
                    Status.ISSUED !== parseInt(Status[status]) && (
                        <Button
                            variant={"outlined"}
                            color={"warning"}
                            onClick={() => cancelOrderCallback(order)}>
                            Отменить заказ
                        </Button>
                    )}
            </AccordionDetails>
        </Accordion>
    )
}

export default OrdersComponentMapItem