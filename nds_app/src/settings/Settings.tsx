import React, {FC} from "react";
import {Button, Container} from "@mui/material";
import Top from "../components/Top";

export interface IUserInfo {
    id?:number
    phone: string
}

const Settings: FC = () => {
    return (
        <div>
            <Top/>
        </div>
    )
}

export default Settings