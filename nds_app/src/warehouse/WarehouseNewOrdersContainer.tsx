import React, {FC, useState} from "react";
import {IStore} from "../cart/CartPage";
import StoreChoose from "../cart/StoreChoose";
import WarehouseNewOrders from "./WarehouseNewOrders";

interface IWarehouseNewOrdersContainer {
    setState: (s: boolean) => void
}

const WarehouseNewOrdersContainer: FC<IWarehouseNewOrdersContainer> = ({setState}) => {
    const [store, setStore] = useState<IStore>()
    return (
        <>
            <StoreChoose setStore={setStore}/>
            <WarehouseNewOrders store={store} setState={setState}/>
        </>
    )
}

export default WarehouseNewOrdersContainer
