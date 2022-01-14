import React, {FC, useEffect, useState} from "react"
import {Button, Grid, TextField} from "@mui/material";
import config from "../config";
import {useKeycloak} from "@react-keycloak/web";
import {IUserInfo} from "./Settings";

const UserInfoContainer: FC = () => {
    const {keycloak} = useKeycloak()
    const [userInfo, setUserInfo] = useState<IUserInfo>({phone: ""})

    /**
     * Получить информацию о пользователе
     */
    const fetchUserInfo = async () => {
        const url = config.api.HOST + "/api/v1/info/get"
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${keycloak.token}`
                },
            });
            const json: IUserInfo = await response.json();
            console.log(json);
            return json
        } catch
            (error) {
            console.log("error", error);
        }
    }

    /**
     * Установить информацию о пользователе
     */
    const postUserInfo = async (body: string) => {
        const url = config.api.HOST + "/api/v1/info/set"
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${keycloak.token}`
                },
                body: body
            });
            const json = await response.json();
            console.log(json);
            setUserInfo(json)
        } catch
            (error) {
            console.log("error", error);
        }
    }

    const updateUserInfo = () => {
        postUserInfo(JSON.stringify(userInfo))
    }

    useEffect(() => {
        if (keycloak.authenticated)
            fetchUserInfo().then((info) => {
                if (info !== undefined)
                    setUserInfo(info)
            })
    }, [keycloak.authenticated])

    useEffect(() => {
        console.log('new user info', userInfo)
    }, [userInfo])

    return (
        <>
            <Grid container>
                {userInfo.id !== undefined && (
                    <Grid item>
                        <TextField label={"Номер телефона"} defaultValue={userInfo.phone} variant={"outlined"}
                                   onChange={(e) => {
                                       const ui = userInfo
                                       ui.phone = e.target.value
                                       setUserInfo(ui)
                                   }}/>
                    </Grid>
                )}
                <Grid container item md={12} justifyContent={"right"}>
                    <Button onClick={updateUserInfo}>Обновить</Button>
                </Grid>
            </Grid>
        </>
    )
}

export default UserInfoContainer