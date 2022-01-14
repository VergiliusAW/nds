import React, {FC} from "react";
import {useKeycloak} from "@react-keycloak/web";
import config from "../config";
import {Button, Stack, TextField, Typography} from "@mui/material";

interface IWarehouse {
    id: string
}

interface IStore {
    id?: string
    id_nds_manager: string
    address: string
    warehouse: IWarehouse
}


const AdminAddStoreComponent: FC = () => {
    const {keycloak} = useKeycloak()

    const postAddStore = async (body: string) => {
        const url = config.api.HOST + "/api/v1/admin/store/add"
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
        } catch
            (error) {
            console.log("error", error);
        }
    }

    const postAddWarehouse = async (body: string) => {
        const url = config.api.HOST + "/api/v1/admin/warehouse/add"
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
            const json: IWarehouse = await response.json();
            console.log(json);
            return json
        } catch
            (error) {
            console.log("error", error);
        }
    }

    const addStoreAndWarehouse = () => {
        const warehouse: IWarehouse = {
            id: uuidv4()
        }
        postAddWarehouse(JSON.stringify(warehouse)).then((w) => {
            if (w !== undefined) {
                const store: IStore = {
                    // @ts-ignore
                    id_nds_manager: document.getElementById('id_nds_manager').value,
                    // @ts-ignore
                    address: document.getElementById('address').value,
                    warehouse: w
                }
                postAddStore(JSON.stringify(store))
            }
        })
    }

    function uuidv4() {
        // @ts-ignore
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }

    return (
        <Stack spacing={2}>
            <Typography variant="h6" component="h2">
                Добавление store
            </Typography>
            <Stack direction={"row"} spacing={1}>
                <TextField id="id_nds_manager" label="id_nds_manager" variant="outlined"/>
                <TextField id="address" label="address" variant="outlined"/>
            </Stack>

            <Button variant="outlined" onClick={addStoreAndWarehouse}>Добавить</Button>
        </Stack>
    )
}

export default AdminAddStoreComponent