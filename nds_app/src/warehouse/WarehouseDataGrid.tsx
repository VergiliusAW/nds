import React, {FC, useEffect, useState} from "react";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import {useKeycloak} from "@react-keycloak/web";
import config from "../config";
import {Goods} from "../app/NdsGoods";
import {Button, IconButton, Paper, Stack, Typography} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

const options = ['Option 1', 'Option 2'];

interface AG {
    goods: Goods
    count: number
}

interface AC {
    goodsLabel: Goods
}

const WarehouseDataGrid: FC = () => {
    const {keycloak} = useKeycloak()
    const [auth, setAuth] = useState(false)
    const [goods, setGoods] = useState<string[]>([])
    const [goodsLabels, setGoodsLabels] = useState<Goods[]>([])
    const [newGoods, setNewGoods] = useState<AG[]>([])
    const [value, setValue] = useState<number>(0);

    const [inputValue, setInputValue] = React.useState('');

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

    const postGoods = async (body: string) => {
        const url = config.api.HOST + "/api/v1/main/accept"
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
     *
     */
    const handleAdd = () => {
        const s = inputValue.split("|")
        //index
        const i = parseInt(s[0])
        const item: AG = {
            goods: goodsLabels[i],
            count: value
        }
        setNewGoods((prev) => [...prev, item])
    }

    /**
     *
     * @param idx
     */
    const handleDel = (idx: number) => {
        const cat = [...newGoods]
        if (idx > -1) {
            cat.splice(idx, 1);
        }
        setNewGoods(cat)
    }

    /**
     *
     */
    const handleAccept = async () => {
        const d: AC[] = []
        newGoods.forEach((g) => {
            for (let i = 0; i < g.count; i++) {
                d.push({goodsLabel: g.goods})
            }
        })
        await postGoods(JSON.stringify(d))
        setNewGoods([])
        setInputValue("")
        setValue(0)
    }

    /**
     * fetch data 1 time
     */
    useEffect(() => {
        if (auth)
            fetchGoods().then((res) => {
                if (res) {
                    setGoodsLabels(res)
                    const gl = res.map<string>((g, index) => {
                        return index + "|" + g.name
                    })
                    setGoods(gl)
                }
            })
    }, [auth])

    /**
     *
     */
    useEffect(() => {
        if (keycloak.authenticated !== undefined)
            setAuth(keycloak.authenticated)
    }, [keycloak.authenticated])

    return (
        <>
            <Paper elevation={3} sx={{p: 2, mb:2}}>
                <Stack direction={"row"} spacing={2}>
                    <Autocomplete
                        inputValue={inputValue}
                        onInputChange={(event, newInputValue) => {
                            setInputValue(newInputValue);
                        }}
                        options={goods}
                        sx={{width: 300}}
                        renderInput={(params) => <TextField {...params} label="Товар"/>}
                    />
                    <TextField type="number" label={"Количество"} InputProps={{inputProps: {min: 0}}} onChange={(e) => {
                        let v = parseInt(e.target.value, 10);
                        if (v < 0) v = 0;
                        e.target.value = String(v)
                        setValue(v)
                    }}/>
                    <Button onClick={handleAdd}>Добавить</Button>
                </Stack>
            </Paper>
            <Stack spacing={2}>
                {newGoods.map((g, index) => {
                    return (
                        <Stack direction={"row"} spacing={2} justifyContent={"left"} alignItems={"center"}>
                            <IconButton aria-label="delete" color={"error"} onClick={() => handleDel(index)}>
                                <DeleteIcon/>
                            </IconButton>
                            <Stack spacing={2}>
                                <Typography variant="h5" component="div">
                                    Название: {g.goods.name}
                                </Typography>
                                <Typography variant="button" display="block" gutterBottom>
                                    Количество: {g.count}
                                </Typography>
                            </Stack>

                        </Stack>
                    )
                })}
                {newGoods.length > 0 && (
                    <Button onClick={handleAccept}>Принять товары</Button>
                )}
            </Stack>

        </>
    )
}

export default WarehouseDataGrid