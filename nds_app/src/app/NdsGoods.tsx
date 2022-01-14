import React, {FC, useEffect, useState} from "react";
import {Chip, Grid, Stack} from "@mui/material";
import config from "../config";
import GoodsMapItem from "./GoodsMapItem";

export interface Goods {
    id: string
    name: string
    description: string
    price: number
}

interface ICategories {
    id: number
    name: string
    select: boolean
}

const NdsGoods: FC = () => {
    const [goods, setGoods] = useState<Goods[]>()
    const [categories, setCategories] = useState<ICategories[]>()
    /**
     * Получение все видов товаров с сервера
     */
    const fetchGoods = async () => {
        const pr = new URLSearchParams();
        if (categories !== undefined) {
            for (let i = 0; i < categories?.length; i++) {
                if (categories[i].select)
                    pr.append("categories", categories[i].name)
            }
        }

        console.log(pr.toString());
        let url = config.api.HOST + "/api/v1/public/goods/all"
        if (pr.toString().length > 1)
            url = config.api.HOST + "/api/v1/public/goods/filter?" + pr.toString()
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',

                },
            });
            const json = await response.json();
            console.log(json);
            setGoods(json)
        } catch
            (error) {
            console.log("error", error);
        }
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
            const json = await response.json();
            console.log(json);
            setCategories(json)
        } catch
            (error) {
            console.log("error", error);
        }
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    useEffect(() => {
        fetchGoods()
    }, [categories])

    /**
     * выбрать категорию
     * @param c категория
     */
    const addCategory = (c: ICategories) => {
        if (categories !== undefined) {
            const idx = categories?.indexOf(c)
            const cat = [...categories]
            const sc = cat[idx]
            sc.select = true
            cat[idx] = sc
            setCategories(cat)
        }
    }

    /**
     * ве-селект категрии
     * @param c категория
     */
    const rmCategory = (c: ICategories) => {
        if (categories !== undefined) {
            const idx = categories?.indexOf(c)
            const cat = [...categories]
            const sc = cat[idx]
            sc.select = false
            cat[idx] = sc
            setCategories(cat)
        }
    }

    return (

        <Grid container sx={{mt: "64px"}} spacing={2}>
            <Grid item xs={1}/>
            {
                //Категории товаров
            }
            <Grid item xs={2} justifyContent="right" alignItems="center">
                <Grid container spacing={1}>
                    {categories?.map((c, index) => {
                        return (
                            <Grid key={c.id} item>
                                {!categories[index].select && (
                                    <Chip label={c.name} variant="outlined" size="small" sx={{
                                        bgcolor: "#FFF",
                                        border: "none",
                                        boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;"
                                    }}
                                          onClick={() => addCategory(c)}/>
                                )}
                                {!!categories[index].select && (
                                    <Chip label={c.name} size="small"
                                          sx={{boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;"}}
                                          onDelete={() => rmCategory(c)}/>
                                )}
                            </Grid>
                        )
                    })}
                </Grid>
            </Grid>
            {
                //Первый столбец товаров
            }
            <Grid item md={4}>
                <Stack>
                    {goods?.map((g, index) => {
                        return (index % 2 === 0 ?
                                <GoodsMapItem key={g.id} g={g}/>
                                : null
                        )

                    })}
                </Stack>
            </Grid>
            {
                //Второй столбец товаров
            }
            <Grid item md={4}>
                <Stack>
                    {goods?.map((g, index) => {
                        return (index % 2 !== 0 ?
                                <GoodsMapItem key={g.id} g={g}/>
                                : null
                        )

                    })}
                </Stack>
            </Grid>
            <Grid item xs={1}/>
        </Grid>
    )
}

export default NdsGoods