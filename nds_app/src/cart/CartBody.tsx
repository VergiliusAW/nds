import React, {FC, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useKeycloak} from "@react-keycloak/web";
import config from "../config";
import {ICartGoods, IStore} from "./CartPage";
import {Button, Grid, Paper, Stack, TextField, Typography} from "@mui/material";
import CartItem from "./CartItem";
import {IUserInfo} from "../settings/Settings";
import StoreChoose from "./StoreChoose";
import {decrementByAmount, setState} from "../redux/cartCountSlice";

interface IUser {
    givenName: string
    familyName: string
}

interface ICartBody {
    store: IStore
    setStore: (store: IStore) => void
}

interface NewOrder {
    id_store: string
    cartGoods: ICartGoods[]
}

const CartBody: FC<ICartBody> = ({store, setStore}) => {
    //@ts-ignore
    const count = useSelector((state) => state.cartCounter.value)
    const dispatch = useDispatch()
    const {keycloak} = useKeycloak()
    const [avaError, setAvaError] = useState(false)
    const [cart, setCart] = useState<ICartGoods[]>()
    const [userInfo, setUserInfo] = useState<IUserInfo>()
    const [user, setUser] = useState<IUser>({givenName: "", familyName: ""})
    const [phoneError, setPhoneError] = useState(false)
    const [nds, setNds] = useState<IStore>()
    const [show, setShow] = useState(false)

    /**
     * Получить магазин для администратора
     */
    const fetchStore = async () => {
        const url = config.api.HOST + "/api/v1/stores/store"
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${keycloak.token}`
                },
            });
            const json: IStore = await response.json();
            // console.log(json);
            return json
        } catch
            (error) {
            console.log("error", error);
        }
    }

    /**
     * Получить содержимое корзины
     */
    const fetchCart = async () => {
        const url = config.api.HOST + "/api/v1/cart/all"
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${keycloak.token}`
                },
            });
            const json = await response.json();
            // console.log(json);
            setCart(json)
        } catch
            (error) {
            console.log("error", error);
        }
    }

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
            const json = await response.json();
            // console.log(json);
            setUserInfo(json)
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
            // console.log(json);
            setUserInfo(json)
        } catch
            (error) {
            console.log("error", error);
        }
    }

    /**
     * Удалить
     * @param item
     */
    const handleRemove = async (item: ICartGoods) => {
        const url = config.api.HOST + "/api/v1/cart/remove"
        await post(url, JSON.stringify(item.goods))
        await dispatch(decrementByAmount(item.count_goods))
        if (cart !== undefined) {
            var filtered = cart.filter(function (value, index, arr) {
                return value !== item;
            });
            setCart(filtered)
        }
    }

    const [auth, setAuth] = useState(false)
    useEffect(() => {
        if (keycloak.authenticated)
            setAuth(true)
    }, [keycloak.authenticated])

    useEffect(() => {
        if (auth) {
            if (keycloak.tokenParsed !== undefined) {
                const user: IUser = {
                    givenName: keycloak.tokenParsed.given_name,
                    familyName: keycloak.tokenParsed.family_name
                }
                setUser(user)
                // console.log(user)
            }
            fetchCart()
            fetchUserInfo()
            //@ts-ignore
            if (keycloak.realmAccess.roles.includes("nds_store_manager")) {
                fetchStore().then((s) => {
                    if (s)
                        setNds(s)
                })
            }
        }
    }, [auth])

    useEffect(() => {
        if (auth)
            //@ts-ignore
            if (keycloak.realmAccess.roles.includes("nds_store_manager")) {
                fetchStore().then((s) => {
                    setShow(false)
                    if (s)
                        if (s.id === store.id) {
                            setNds(s)
                            setShow(true)
                        }
                })
            }
    }, [store])

    const [no, setNo] = useState(false)

    useEffect(() => {
        fetchCart()
        console.log("hello there")
    }, [no])

    /**
     * Новый заказ
     */
    const newOrder = async (body: string) => {
        const url = config.api.HOST + "/api/v1/orders/new"
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

    /**
     * Новый заказ
     */
    const sell = async (body: string) => {
        const url = config.api.HOST + "/api/v1/stores/sell"
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


    /**
     * Оформить заказ
     */
    const handleOrder = async () => {
        const id_s = store.id

        if (keycloak.realmAccess !== undefined && !keycloak.realmAccess.roles.includes("nds_store_manager")) {
            //@ts-ignore
            if (document.getElementById("phone").value !== "") {
                //@ts-ignore
                const phone = document.getElementById("phone").value
                const info: IUserInfo = {
                    phone: phone
                }
                await postUserInfo(JSON.stringify(info))
            } else {
                if (userInfo?.phone === null) {
                    setPhoneError(true)
                    return
                }
            }
            if (cart !== undefined) {
                const order: NewOrder = {
                    id_store: id_s,
                    cartGoods: cart
                }
                console.log("Новый заказ")
                console.log(order)
                await newOrder(JSON.stringify(order))
                cart.map(async (c) => {
                    await handleRemove(c)
                })
                setNo(true)
            }
        } else if (keycloak.realmAccess !== undefined && keycloak.realmAccess.roles.includes("nds_store_manager")) {
            if (cart !== undefined) {
                const order: NewOrder = {
                    id_store: id_s,
                    cartGoods: cart
                }
                console.log("Новый заказ")
                console.log(order)
                await sell(JSON.stringify(order))
                cart.map(async (c) => {
                    await handleRemove(c)
                })
                setNo(true)
            }
        }

    }


    /**
     * Изменить количество товара в корзине
     * @param count количество
     * @param item товар
     */
    const postChangeCount = async (count: number, item: string) => {
        const url = config.api.HOST + "/api/v1/cart/change?count=" + count
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${keycloak.token}`
                },
                body: item
            });
            const json = await response.json();
            console.log(json);
        } catch
            (error) {
            console.log("error", error);
        }
    }

    /**
     * Изменение количетсва товара
     */
    const handleChangeCount = async (c: number, index: number) => {
        if (cart !== undefined) {
            const ca = [...cart]
            const ce = ca[index]
            if (ce.count_goods === c)
                return
            ce.count_goods = c
            ca[index] = ce
            setCart(ca)
            await postChangeCount(c, JSON.stringify(ce.goods))
            await dispatch(setState(c))
        }
    }

    /**
     * post запрос с токеном
     * @param url
     * @param body
     */
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

    return (
        <>
            <Grid container sx={{mt: "64px"}}>
                <Grid item md={2}>
                    <Paper elevation={3} sx={{p: 2}}>
                        <StoreChoose setStore={setStore}/>
                    </Paper>
                </Grid>
                <Grid item md={1}/>
                <Grid item md={6}>
                    {cart?.map((c, index) => {
                        return (
                            <CartItem key={index} item={c} store={store} index={index}
                                      handleChangeCount={handleChangeCount} handleRemove={handleRemove}
                                      avaError={avaError} handleAvaError={setAvaError}/>
                        )
                    })}
                </Grid>
                <Grid item md={1}/>
                <Grid item md={2}>
                    <Paper elevation={3} sx={{p: 2}}>
                        <Grid container sx={{mt: "10px"}}>
                            <Grid item md={1}/>
                            <Grid item md={10}>
                                <Stack spacing={1}>
                                    {keycloak.authenticated && user != undefined && (
                                        <TextField
                                            disabled
                                            label={user.givenName.concat(" ").concat(user.familyName)}
                                            variant="standard"
                                        />
                                    )}
                                    {userInfo?.phone === null && keycloak.realmAccess !== undefined && !keycloak.realmAccess.roles.includes("nds_store_manager") && (
                                        <>
                                            <TextField id="phone" label="Номер телефона" variant="standard"
                                                       error={phoneError} required onClick={() => {
                                                setPhoneError(false)
                                            }}/>
                                            <Typography variant="caption" gutterBottom component="div"
                                                        sx={{mt: "1px", pt: "1px"}}>
                                                Для оформления заказа необходим номер телефона
                                            </Typography>
                                        </>
                                    )}
                                    {userInfo?.phone !== null && (
                                        <TextField id="phone" label={userInfo?.phone} variant="standard" disabled/>
                                    )}
                                    {!nds && (
                                        <Button onClick={handleOrder}>Оформить заказ</Button>
                                    )}
                                    {nds && show && (
                                        <Button onClick={handleOrder}>Продать</Button>
                                    )}
                                </Stack>
                            </Grid>
                            <Grid item md={1}/>
                        </Grid>

                    </Paper>
                </Grid>
            </Grid>

        </>
    )
}

export default CartBody