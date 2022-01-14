import React, {FC, useEffect, useRef, useState} from "react";
import {Goods} from "./NdsGoods";
import {Button, Card, CardActions, CardContent, Collapse, Grid, Typography} from "@mui/material";
import {styled} from "@mui/material/styles";
import {useKeycloak} from "@react-keycloak/web";
import config from "../config";
import {useDispatch} from "react-redux";
import {increment} from "../redux/cartCountSlice";

interface IGoodsMapItem {
    g: Goods
}

const Div = styled('div')(({theme}) => ({
    ...theme.typography.button,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1),
}));


/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideAlerter(ref: any, callback: () => void) {
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event: Event) {
            if (ref.current && !ref.current.contains(event.target)) {
                callback()
            }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);
}

const GoodsMapItem: FC<IGoodsMapItem> = ({g}) => {
    const dispatch = useDispatch()
    const [expanded, setExpanded] = useState(false)
    const handleExpand = () => {
        setExpanded(true)
    }
    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, () => setExpanded(false));
    const {keycloak} = useKeycloak()
    /**
     * Отправка запроса на добавление в корзину
     */
    const handleBuy = () => {
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
                dispatch(increment())
            } catch
                (error) {
                console.log("error", error);
            }
        }
        const url = config.api.HOST + "/api/v1/cart/add"
        post(url, JSON.stringify(g))
    }

    return (
        <Grid item ref={wrapperRef}>
            <Card key={g.id} sx={{minWidth: 300, mb: 1.5}} onClick={handleExpand}>
                <CardContent>
                    <Typography variant="h5" component="div">
                        {g.name}
                    </Typography>
                    {/*TODO: сюда можно вставить все категории товара*/}
                    <Typography variant="body2">
                        {g.description}
                    </Typography>
                </CardContent>
                <CardActions>
                </CardActions>
                <Collapse in={expanded} unmountOnExit>
                    <CardContent>
                        <Div>{"Цена: " + g.price + " у.е."}</Div>
                    </CardContent>
                    {(!!keycloak.authenticated &&
                        //@ts-ignore
                        !keycloak.tokenParsed.realm_access.roles.includes("nds_god")
                        //@ts-ignore
                        && !keycloak.tokenParsed.realm_access.roles.includes("nds_warehouse_manager") && (
                            <CardActions>
                                <Button size="small" onClick={handleBuy}>Купить</Button>
                            </CardActions>
                        )
                    )}
                </Collapse>
            </Card>
        </Grid>
    )
}

export default GoodsMapItem