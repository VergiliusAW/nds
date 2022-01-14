import React, {FC} from "react";
import Top from "../components/Top";
import SettingsBody from "./SettingsBody";

export interface IUserInfo {
    id?: number
    phone: string
}

const Settings: FC = () => {
    return (
        <div>
            <Top/>
            <SettingsBody/>
        </div>
    )
}

export default Settings