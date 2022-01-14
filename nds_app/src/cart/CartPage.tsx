import React, {FC, useState} from "react";
import Top from "../components/Top";
import {Goods} from "../app/NdsGoods";
import CartBody from "./CartBody";

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
    return (
        <>
            <Top/>
            {store !== undefined && (
                <CartBody store={store} setStore={setStore}/>
            )}
        </>
    )
}

export default CartPage