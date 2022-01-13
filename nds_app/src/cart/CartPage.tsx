import React, {FC, useEffect, useState} from "react";
import {useSelector, useDispatch} from 'react-redux'
import Top from "../components/Top";
import {decrement, increment, setState} from "../redux/cartCountSlice";
import {Button, Container, Grid, Stack} from "@mui/material";
import config from "../config";
import {useKeycloak} from "@react-keycloak/web";
import {Goods} from "../app/NdsGoods";
import CartBody from "./CartBody";
import StoreChoose from "./StoreChoose";

export interface ICartGoods {
    cart: {
        id: number
    }
    cartGoodsId: {
        cart_id: number
        goods_id: string
    }
    count_goods: number
    goods: Goods
}

export interface IStore {
    address: string
    id: string
}

const CartPage: FC = () => {
    const [store, setStore] = useState<IStore>({id: "", address: ""})
    // const [f, setF] = useState(false)
    // const chooseHandle = () => {
    //     setF(true)
    // }
    return (
        <>
            <Top/>
            {store !== undefined && (
                <CartBody store={store} setStore={setStore}/>
            )}
            {/*{!f && (*/}
            {/*    <Stack>*/}
            {/*        <Grid container item md={12} justifyContent={"center"} sx={{mt:"64px"}}>*/}
            {/*            <StoreChoose setStore={setStore}/>*/}
            {/*        </Grid>*/}
            {/*        <Button onClick={chooseHandle}>Выбрать</Button>*/}
            {/*    </Stack>*/}

            {/*)}*/}
        </>
    )
}

export default CartPage