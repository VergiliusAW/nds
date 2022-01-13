import React, {FC} from "react";
import Top from "../components/Top";
import WarehouseBody from "./WarehouseBody";

const Warehouse: FC = () => {
    return (
        <div>
            <Top/>
            <WarehouseBody/>
        </div>
    )
}

export default Warehouse