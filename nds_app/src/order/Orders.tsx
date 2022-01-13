import React, {FC} from "react";
import Top from "../components/Top";
import OrdersBody from "./OrdersBody";

const Orders: FC = () => {
    return (
        <div>
            <Top/>
            <OrdersBody/>
        </div>
    )
}

export default Orders