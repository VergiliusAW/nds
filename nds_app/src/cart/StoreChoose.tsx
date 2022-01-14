import React, {FC, useEffect, useState} from "react";
import config from "../config";
import {IStore} from "./CartPage";
import {Container, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup} from "@mui/material";
import keycloak from "../keycloak";

interface IStoreChoose {
    store?: IStore
    setStore: (store: IStore) => void
}

const StoreChoose: FC<IStoreChoose> = ({setStore}) => {
    const [stores, setStores] = useState<IStore[]>()
    const [value, setValue] = useState<string>("");

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const v = (event.target as HTMLInputElement).value
        setValue(v);
    };

    const fetchStores = async () => {
        const url = config.api.HOST + "/api/v1/public/stores/all"
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
            setStores(json)
        } catch
            (error) {
            console.log("error", error);
        }
    }

    // const fetchStore = async () => {
    //     const url = config.api.HOST + "/api/v1/stores/store"
    //     try {
    //         const response = await fetch(url, {
    //             method: 'GET',
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${keycloak.token}`
    //             },
    //         });
    //         const json = await response.json();
    //         console.log(json);
    //         setStore(json)
    //         // setStores((prev) => [[],json])
    //     } catch
    //         (error) {
    //         console.log("error", error);
    //     }
    // }

    useEffect(() => {
        fetchStores()
    }, [])

    useEffect(() => {
        if (stores && value==="") {
            setValue(stores[0].id)
        }   else {
            setStore({id: value, address: ""})
            console.log(value)
        }
    }, [stores, value])

    return (
        <>
            {stores !== undefined && value !== "" && (
                <FormControl component="fieldset">
                    <FormLabel component="legend">Магазин</FormLabel>
                    <RadioGroup
                        aria-label="store"
                        name="controlled-radio-buttons-group"
                        value={value}
                        onChange={handleChange}
                    >
                        {stores.map((s) => {
                            return (
                                <FormControlLabel key={s.id} value={s.id} control={<Radio/>} label={s.address}/>
                            )
                        })}
                    </RadioGroup>
                </FormControl>
            )}

        </>
    )
}

export default StoreChoose