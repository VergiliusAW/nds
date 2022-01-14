import React, {FC, useEffect, useState} from "react"
import {Button, Stack, TextField, Typography} from "@mui/material";
import config from "../config";
import {useKeycloak} from "@react-keycloak/web";
import {Goods} from "../app/NdsGoods";
import Autocomplete from "@mui/material/Autocomplete";

interface IGoodsCategories {
    id_goods: string
    id_category: number
}

interface ICategories {
    id: number
    name: string
    select: boolean
}

interface IAdminAddCategoriesToGoodsLabelComponent {
    change: boolean
    setChange: (s :boolean) => void
}

const AdminAddCategoriesToGoodsLabelComponent: FC<IAdminAddCategoriesToGoodsLabelComponent> = ({change, setChange}) => {
    const {keycloak} = useKeycloak()
    const [goodsLabels, setGoodsLabels] = useState<Goods[]>([])
    const [categories, setCategories] = useState<ICategories[]>([])

    const [inputValue, setInputValue] = useState<Goods>();
    const [cat, setCat] = useState<ICategories>();

    /**
     * Получить все товары
     */
    const fetchGoods = async () => {
        const url = config.api.HOST + "/api/v1/public/goods/all"
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${keycloak.token}`
                },
            });
            const json: Goods[] = await response.json();
            console.log(json);
            return json
        } catch
            (error) {
            console.log("error", error);
        }
        return
    }

    /**
     * Получить категории
     */
    const fetchCategories = async () => {
        const url = config.api.HOST + "/api/v1/public/categories/all"
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            const json: ICategories[] = await response.json();
            console.log(json);
            return json
        } catch
            (error) {
            console.log("error", error);
        }
    }

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

    const goodsCategories = () => {
        if (inputValue !== undefined && cat !== undefined) {
            const gc: IGoodsCategories = {
                id_goods: inputValue?.id,
                id_category: cat?.id
            }
            const url = config.api.HOST + "/api/v1/admin/goods/category"
            post(url, JSON.stringify(gc))
        }
    }

    useEffect(() => {
        fetchGoods().then((g) => {
            if (g)
                setGoodsLabels(g)
            setChange(false)
        })
        fetchCategories().then((c) => {
            if (c)
                setCategories(c)
            setChange(false)
        })
    }, [change])

    return (
        <Stack spacing={2}>
            <Typography variant="h6" component="h2">
                Добавление category для goods
            </Typography>
            <Stack direction="row" spacing={1}>
                <Autocomplete
                    onChange={(event, newInputValue) => {
                        console.log(newInputValue)
                        if (newInputValue !== null)
                            setInputValue(newInputValue);
                    }}
                    options={goodsLabels}
                    getOptionLabel={option => option.name}
                    sx={{width: 300}}
                    renderInput={(params) => <TextField {...params} label="Товар"/>}
                />
                <Autocomplete
                    onChange={(event, newInputValue) => {
                        console.log(newInputValue)
                        if (newInputValue !== null)
                            setCat(newInputValue);
                    }}
                    options={categories}
                    getOptionLabel={option => option.name}
                    sx={{width: 300}}
                    renderInput={(params) => <TextField {...params} label="Категория"/>}
                />
            </Stack>

            <Button variant="outlined" onClick={goodsCategories}>Добавить</Button>
        </Stack>
    )
}

export default AdminAddCategoriesToGoodsLabelComponent