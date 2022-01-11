import React, {FC} from "react";
import {IconButton} from "@mui/material";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Badge from '@mui/material/Badge';
import {styled} from '@mui/material/styles';

/**
 * Отображается только когда клиент вошел в свой аккаунт
 * @constructor
 */
const Cart: FC = () => {
    const StyledBadge = styled(Badge)(({theme}) => ({
        '& .MuiBadge-badge': {
            right: -3,
            top: 13,
            border: `2px solid ${theme.palette.background.paper}`,
            padding: '0 4px',
        },
    }));

    return (
        // <Button size="medium" startIcon={<ShoppingCart/>}>Корзина</Button>

        <IconButton aria-label="cart">
            <StyledBadge badgeContent={4} color="primary">
                <ShoppingCartIcon/>
            </StyledBadge>
        </IconButton>)
}

export default Cart