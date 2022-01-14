import React, {FC} from "react";
import {Button, Stack, TextField, Typography} from "@mui/material";
import config from "../config";
import {useKeycloak} from "@react-keycloak/web";

interface IGoods {
    id?: string
    name: string
    description: string
    price: number
}

interface IAdminAddGoodsLabelComponent {
    setChange: (s: boolean) => void
}

const AdminAddGoodsLabelComponent: FC<IAdminAddGoodsLabelComponent> = ({setChange}) => {
    const {keycloak} = useKeycloak()

    const post = async (url: string, body: string) => {
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
            const json = await response.json();
            console.log(json);
        } catch
            (error) {
            console.log("error", error);
        }
    }

    const addGoods = () => {
        const goods: IGoods = {
            // @ts-ignore
            name: document.getElementById('goods_name').value,
            // @ts-ignore
            description: document.getElementById('goods_description').value,
            // @ts-ignore
            price: document.getElementById('goods_price').value
        }
        const url = config.api.HOST + "/api/v1/admin/goods/add"
        post(url, JSON.stringify(goods))
        setChange(true)
    }

    return (
        <Stack spacing={2}>
            <Typography variant="h6" component="h2">
                Добавление goodsLabel
            </Typography>
            <Stack direction="row" spacing={1}>
                <TextField id="goods_name" label="name" variant="outlined"/>
                <TextField id="goods_description" label="description" variant="outlined"/>
                <TextField id="goods_price" label="price" variant="outlined"/>
            </Stack>

            <Button variant="outlined" onClick={addGoods}>Добавить</Button>
        </Stack>
    )
}

export default AdminAddGoodsLabelComponent