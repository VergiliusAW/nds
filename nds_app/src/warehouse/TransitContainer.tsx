import React, {FC, useState} from "react";
import {IStore} from "../cart/CartPage";
import StoreChoose from "../cart/StoreChoose";
import TransitComponent from "./TransitComponent";

interface ITransitContainer {
    setState: (s: boolean) => void
    state: boolean
}

const TransitContainer: FC<ITransitContainer> = ({setState, state}) => {
    const [store, setStore] = useState<IStore>()
    return (
        <>
            <StoreChoose setStore={setStore}/>
            <TransitComponent store={store} setState={setState} state={state}/>
        </>
    )
}

export default TransitContainer