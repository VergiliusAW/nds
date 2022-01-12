import React, {FC, useEffect, useState} from "react";
import {useSelector, useDispatch} from 'react-redux'
import Top from "../components/Top";
import {decrement, increment, incrementByAmount, setState} from "../redux/cartCountSlice";
import {Container} from "@mui/material";
import config from "../config";
import {useKeycloak} from "@react-keycloak/web";
import {Goods} from "../app/NdsGoods";

interface ICartGoods {
    cart: {
        id: number
    }
    cartGoodsId: {
        cart_id: number
        goods_id: string
        count_goods: number
    }
    goods: Goods
}

const CartPage: FC = () => {
    //@ts-ignore
    const count = useSelector((state) => state.cartCounter.value)
    const dispatch = useDispatch()
    const {keycloak} = useKeycloak()
    const [cart, setCart] = useState<ICartGoods[]>()
    const fetchCart = async () => {
        const url = config.api.HOST + "/api/v1/cart/all"
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
            setCart(json)
        } catch
            (error) {
            console.log("error", error);
        }
    }

    useEffect(() => {
        fetchCart()
    }, [keycloak.authenticated])

    return (
        <>
            <Top/>
            
        </>
    )
}

export default CartPage