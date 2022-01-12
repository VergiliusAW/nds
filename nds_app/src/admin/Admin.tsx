import React, {FC, useState} from "react";
import {Button, Grid, TextField, Typography, Box, Stack} from "@mui/material";
import config from "../config";
import keycloak from "../keycloak";
import {useKeycloak} from "@react-keycloak/web";

interface IWarehouse {
    id: string
}

interface IStore {
    id?: string
    id_nds_manager: string
    address: string
    warehouse: IWarehouse
}

interface IGoods {
    id?: string
    name: string
    description: string
    price: number
}

interface ICategories {
    id?: number
    name: string
}

interface IGoodsCategories {
    id_goods: string
    id_category: number
}

const Admin: FC = () => {
    const {keycloak} = useKeycloak()

    const post = async (url: string, body:string) => {
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

    const addWarehouse = () => {
        const warehouse: IWarehouse = {
            // @ts-ignore
            id: document.getElementById('id_warehouse').value
        }
        const url = config.api.HOST + "/api/v1/admin/warehouse/add"
        post(url, JSON.stringify(warehouse))
    }

    const addStore = async () => {
        const store: IStore = {
            // @ts-ignore
            id_nds_manager: document.getElementById('id_nds_manager').value,
            // @ts-ignore
            address: document.getElementById('address').value,
            // @ts-ignore
            warehouse: {
                // @ts-ignore
                id: document.getElementById('warehouse').value
            }
        }
        const url = config.api.HOST + "/api/v1/admin/store/add"
        post(url, JSON.stringify(store))
    }

    const addGoods = () => {
        const goods:IGoods = {
            // @ts-ignore
            name: document.getElementById('goods_name').value,
            // @ts-ignore
            description: document.getElementById('goods_description').value,
            // @ts-ignore
            price: document.getElementById('goods_price').value
        }
        const url = config.api.HOST + "/api/v1/admin/goods/add"
        post(url, JSON.stringify(goods))
    }

    const addCategory = () => {
        const category: ICategories = {
            // @ts-ignore
            name: document.getElementById('category_name').value
        }
        const url = config.api.HOST + "/api/v1/admin/category/add"
        post(url, JSON.stringify(category))
    }

    const goodsCategories = () => {
        const gc: IGoodsCategories = {
            // @ts-ignore
            id_goods: document.getElementById('id_goods').value,
            // @ts-ignore
            id_category: document.getElementById('id_category').value
        }
        const url = config.api.HOST + "/api/v1/admin/goods/category"
        post(url, JSON.stringify(gc))
    }

    return (
        <Box>
            <Grid container>
                <Stack spacing={1}>
                    <Typography variant="h6" component="h2">
                        Добавление warehouse
                    </Typography>
                    <Stack direction="row" spacing={1}>
                        <TextField id="id_warehouse" label="id_warehouse" variant="outlined"/>
                    </Stack>

                    <Button variant="outlined" onClick={addWarehouse}>Добавить</Button>
                </Stack>
            </Grid>
            <Grid container>
                <Stack>
                    <Typography variant="h6" component="h2">
                        Добавление store
                    </Typography>
                    <Stack direction={"row"} spacing={1}>
                        <TextField id="id_nds_manager" label="id_nds_manager" variant="outlined"/>
                        <TextField id="address" label="address" variant="outlined"/>
                        <TextField id="warehouse" label="warehouse" variant="outlined"/>
                    </Stack>

                    <Button variant="outlined" onClick={addStore}>Добавить</Button>
                </Stack>
            </Grid>
            <Grid container>
                <Stack spacing={1}>
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
            </Grid>
            <Grid container>
                <Stack spacing={1}>
                    <Typography variant="h6" component="h2">
                        Добавление categories
                    </Typography>
                    <Stack direction="row" spacing={1}>
                        <TextField id="category_name" label="name" variant="outlined"/>
                    </Stack>

                    <Button variant="outlined" onClick={addCategory}>Добавить</Button>
                </Stack>
            </Grid>
            <Grid container>
                <Stack spacing={1}>
                    <Typography variant="h6" component="h2">
                        Добавление category для goods
                    </Typography>
                    <Stack direction="row" spacing={1}>
                        <TextField id="id_goods" label="id_goods" variant="outlined"/>
                        <TextField id="id_category" label="id_category" variant="outlined"/>
                    </Stack>

                    <Button variant="outlined" onClick={goodsCategories}>Добавить</Button>
                </Stack>
            </Grid>
        </Box>
    )
}

export default Admin