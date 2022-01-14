import React, {FC, useEffect, useState} from "react";
import {ICartGoods, IStore} from "./CartPage";
import {Button, Card, CardActions, CardContent, Grid, Typography} from "@mui/material";
//@ts-ignore
import CounterInput from "react-counter-input";
import config from "../config";
import {useKeycloak} from "@react-keycloak/web";

interface ICartItem {
    item: ICartGoods
    store: IStore
    index: number
    handleChangeCount: (c: number, index: number) => void
    handleRemove: (item: ICartGoods) => void
    avaError: boolean
    handleAvaError: (f: boolean) => void
}

const CartItem: FC<ICartItem> = ({item, store, index, handleChangeCount, handleRemove, avaError, handleAvaError}) => {
    const [ava, setAva] = useState(0)
    const {keycloak} = useKeycloak()

    const fetchAvailablePublic = async () => {
        const pr = new URLSearchParams();
        pr.append("id_store", store.id)
        pr.append("id_goods_label", item.goods.id)
        const url = config.api.HOST + "/api/v1/public/goods/available?" + pr.toString()
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            const json = await response.json();
            console.log(json);
            setAva(json.available_count)
        } catch
            (error) {
            console.log("error", error);
        }
    }

    const fetchAvailableStore = async () => {
        const pr = new URLSearchParams();
        pr.append("id_goods_label", item.goods.id)
        pr.append("id_store", store.id)
        const url = config.api.HOST + "/api/v1/stores/goods/available?" + pr.toString()
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${keycloak.token}`

                },
            });
            const json = await response.json();
            console.log(json);
            setAva(json.available_count)
        } catch
            (error) {
            console.log("error", error);
        }
    }

    useEffect(() => {
        if (keycloak.realmAccess !== undefined) {
            if (keycloak.realmAccess.roles.includes("nds_store_manager")) {
                fetchAvailableStore()
            } else {
                fetchAvailablePublic()
            }
        }

    }, [store])
    return (
        <Card sx={{minWidth: 300, mb: 1.5}}>
            <CardContent>
                <Typography variant="h5" component="div">
                    {item.goods.name}
                </Typography>
                <Typography variant="button" display="block" gutterBottom>
                    Цена: {item.goods.price} у.е.
                </Typography>
                <Typography variant="caption" display="block" gutterBottom
                            color={item.count_goods > ava ? "error" : ""}>
                    В наличии: {ava}
                </Typography>
            </CardContent>

            <CardActions>
                <Grid container item md={6} justifyContent={"left"}>
                    <CounterInput
                        wrapperStyle={{maxHeight: "30px"}}
                        count={item.count_goods}
                        min={1}
                        max={100}
                        onCountChange={(count: number) => handleChangeCount(count, index)}
                    />
                </Grid>
                <Grid container item md={6} justifyContent="right">
                    <Button color="error" onClick={() => handleRemove(item)}>
                        Удалить
                    </Button>
                </Grid>
            </CardActions>
        </Card>
    )
}

export default CartItem