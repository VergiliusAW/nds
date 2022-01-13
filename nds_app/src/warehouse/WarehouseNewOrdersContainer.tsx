import React, {FC, useState} from "react";
import {Grid} from "@mui/material";
import {IStore} from "../cart/CartPage";
import StoreChoose from "../cart/StoreChoose";
import WarehouseNewOrders from "./WarehouseNewOrders";

const WarehouseNewOrdersContainer:FC = () => {
    const [store, setStore] = useState<IStore>({id: "", address: ""})
    return(
        <>
            <StoreChoose setStore={setStore}/>
            <WarehouseNewOrders store={store}/>
        </>
    )
}

export default WarehouseNewOrdersContainer
