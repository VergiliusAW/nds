import React, {FC, useState} from "react";
import {IStore} from "../cart/CartPage";
import StoreChoose from "../cart/StoreChoose";
import TransitComponent from "./TransitComponent";

const TransitContainer:FC = () => {
    const [store, setStore] = useState<IStore>({id: "", address: ""})
    return(
        <>
            <StoreChoose setStore={setStore}/>
            <TransitComponent store={store}/>
        </>
    )
}

export default TransitContainer