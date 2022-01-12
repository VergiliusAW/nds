import React, {FC, useEffect} from "react";
import {IconButton} from "@mui/material";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Badge from '@mui/material/Badge';
import {styled} from '@mui/material/styles';
import {useDispatch, useSelector} from "react-redux";
import config from "../config";
import {setState} from "../redux/cartCountSlice";
import {useKeycloak} from "@react-keycloak/web";

/**
 * Отображается только когда клиент вошел в свой аккаунт
 * @constructor
 */
const Cart: FC = () => {
    const {keycloak} = useKeycloak()
    //@ts-ignore
    const count = useSelector((state) => state.cartCounter.value)
    const dispatch = useDispatch()

    const StyledBadge = styled(Badge)(({theme}) => ({
        '& .MuiBadge-badge': {
            right: -3,
            top: 13,
            border: `2px solid ${theme.palette.background.paper}`,
            padding: '0 4px',
        },
    }));
    const handleCart = () => {
        window.location.replace("/cart")
    }

    const fetchCartCount = async () => {
        const url = config.api.HOST + "/api/v1/cart/goods/count"
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
            console.log(json);
            dispatch(setState(json))
        } catch
            (error) {
            console.log("error", error);
        }
    }

    useEffect(() => {
        fetchCartCount()
    }, [count])

    return (
        <IconButton aria-label="cart" onClick={handleCart}>
            <StyledBadge badgeContent={count} color="primary">
                <ShoppingCartIcon/>
            </StyledBadge>
        </IconButton>)
}

export default Cart