import React, {FC} from "react";
import config from "../config";
import {Button, Stack, TextField, Typography} from "@mui/material";
import {useKeycloak} from "@react-keycloak/web";

interface ICategories {
    id?: number
    name: string
}

interface IAdminAddCategoriesComponent {
    setChange: (s: boolean) => void
}

const AdminAddCategoriesComponent: FC<IAdminAddCategoriesComponent> = ({setChange}) => {
    const {keycloak} = useKeycloak()

    const post = async (url: string, body: string) => {
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

    const addCategory = () => {
        const category: ICategories = {
            // @ts-ignore
            name: document.getElementById('category_name').value
        }
        const url = config.api.HOST + "/api/v1/admin/category/add"
        post(url, JSON.stringify(category))
        setChange(true)
    }

    return (
        <Stack spacing={2}>
            <Typography variant="h6" component="h2">
                Добавление categories
            </Typography>
            <Stack direction="row" spacing={1}>
                <TextField id="category_name" label="name" variant="outlined"/>
            </Stack>

            <Button variant="outlined" onClick={addCategory}>Добавить</Button>
        </Stack>
    )
}

export default AdminAddCategoriesComponent