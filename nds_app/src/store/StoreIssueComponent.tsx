import React, {FC, useState} from "react";
import {Button, Stack, TextField, Typography} from "@mui/material";
import {IOrder, Status} from "../warehouse/WarehouseNewOrders";
import config from "../config";
import {useKeycloak} from "@react-keycloak/web";
import {Goods} from "../app/NdsGoods";

interface IGG {
    goodsLabel: Goods
    id: string
}

const StoreIssueComponent: FC = () => {
    const {keycloak} = useKeycloak()
    const [id_order, setId_order] = useState("")
    const [goods, setGoods] = useState<IGG[]>()
    const [order, setOrder] = useState<IOrder>()
    const [visible, setVisible] = useState(true)

    /**
     * Получить заказ(со статусом новый)
     * @param id_o id заказа
     */
    const getOrder = async (id_o: string) => {
        const pr = new URLSearchParams();
        pr.append("id_order", id_o)
        const url = config.api.HOST + "/api/v1/stores/order/get?" + pr.toString()
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${keycloak.token}`
                }
            });
            const json: IOrder = await response.json();
            console.log(json);
            return json
        } catch
            (error) {
            console.log("error", error);
        }
        return
    }

    /**
     * Получить содержимое заказа
     * @param id_o id  заказа
     */
    const getGoods = async (id_o: string) => {
        const pr = new URLSearchParams();
        pr.append("id_order", id_o)
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
            console.log(json);
            return json
        } catch
            (error) {
            console.log("error", error);
        }
        return
    }

    /**
     * Выдать заказ
     * @param body заказ
     */
    const issueAnOrder = async (body: string) => {
        const url = config.api.HOST + "/api/v1/stores/issue"
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
            const json: IOrder = await response.json();
            console.log(json);
            return json
        } catch
            (error) {
            console.log("error", error);
        }
        return
    }

    /**
     * Показать заказ
     */
    const show = async () => {
        getOrder(id_order).then((o) => {
            if (o !== undefined)
                if (parseInt(Status[o?.status]) === Status.READY_TO_ISSUE) {
                    setOrder(o)
                    getGoods(id_order).then((g) => {
                        setGoods(g)
                        setVisible(false)
                    })
                } else
                    alert("Ошибка при получении заказа")
        })
    }

    /**
     * Выдать заказ
     */
    const issue = async () => {
        issueAnOrder(JSON.stringify(order)).then((o) => {
            console.log(o)
            setVisible(true)
            setGoods([])
            setId_order("")
        })
    }

    return (
        <Stack justifyContent={"center"} spacing={2}>
            <TextField id="standard-basic" label="uuid заказа" variant="standard" value={id_order} onChange={(e) => {
                setId_order(e.target.value)
                setVisible(true)
            }}/>
            {visible && (
                <Button variant={"outlined"} onClick={show}>Показать заказ</Button>
            )}
            {!visible && goods?.map((g) => {
                return (
                    <Typography key={g.id}>
                        {g.goodsLabel.name}
                    </Typography>
                )
            })}
            {!visible && (
                <Button onClick={issue}>Выдать заказ</Button>
            )}

        </Stack>
    )
}

export default StoreIssueComponent