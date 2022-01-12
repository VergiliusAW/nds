import React, {FC, useEffect, useState} from 'react'
import {Avatar, Button, Chip, Grid, ListItemIcon, Menu, MenuItem} from "@mui/material";
import {useKeycloak} from "@react-keycloak/web";
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import {LocalAtm} from "@mui/icons-material";
import LocationCityIcon from '@mui/icons-material/LocationCity';
import WarehouseIcon from '@mui/icons-material/Warehouse';

interface IUser {
    givenName: string
    familyName: string
}

const LoginButton: FC = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const {keycloak} = useKeycloak()
    const [user, setUser] = useState<IUser>({givenName: "", familyName: ""})
    useEffect(() => {
        if (keycloak.tokenParsed !== undefined) {
            const user: IUser = {
                givenName: keycloak.tokenParsed.given_name,
                familyName: keycloak.tokenParsed.family_name
            }
            setUser(user)
            console.log(keycloak.tokenParsed)
        }
    }, [keycloak.authenticated])

    const settingsHandle = () => {
        window.location.replace("/settings")
    }

    const adminHandle = () => {
        window.location.replace("/admin")
    }

    const warehouseHandle = () => {
        window.location.replace("/warehouse")
    }

    const storeHandle = () => {
        window.location.replace("/store")
    }

    const ordersHandle = () => {
        window.location.replace("/orders")
    }
    return (
        <div>
            {!keycloak.authenticated && (
                < Button
                    variant="contained"
                    onClick={() => keycloak.login()}
                >
                    Войти
                </Button>
            )}
            {!!keycloak.authenticated && (user !== undefined) && (
                <Grid container>
                    <Chip
                        onClick={handleClick}
                        avatar={<Avatar alt={user.givenName} src=""/>}
                        label={
                            user.givenName.concat(" ").concat(user.familyName)
                        }
                        variant="outlined"
                    />
                    <Menu
                        anchorEl={anchorEl}
                        id="account-menu"
                        open={open}
                        onClose={handleClose}
                        onClick={handleClose}
                        PaperProps={{
                            elevation: 0,
                            sx: {
                                overflow: 'visible',
                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                mt: 1.5,
                                '& .MuiAvatar-root': {
                                    width: 32,
                                    height: 32,
                                    ml: -0.5,
                                    mr: 1,
                                },
                                '&:before': {
                                    content: '""',
                                    display: 'block',
                                    position: 'absolute',
                                    top: 0,
                                    right: 14,
                                    width: 10,
                                    height: 10,
                                    bgcolor: 'background.paper',
                                    transform: 'translateY(-50%) rotate(45deg)',
                                    zIndex: 0,
                                },
                            },
                        }}
                        transformOrigin={{horizontal: 'right', vertical: 'top'}}
                        anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                    >
                        {   //@ts-ignore
                            (!keycloak.tokenParsed.realm_access.roles.includes("nds_god")
                                //@ts-ignore
                                && !keycloak.tokenParsed.realm_access.roles.includes("nds_store_manager")
                                //@ts-ignore
                                && !keycloak.tokenParsed.realm_access.roles.includes("nds_warehouse_manager")) && (
                                <MenuItem onClick={ordersHandle}>
                                    <ListItemIcon>
                                        <LocalAtm fontSize="small"/>
                                    </ListItemIcon>
                                    Заказы
                                </MenuItem>

                            )
                        }
                        {   //@ts-ignore
                            (!keycloak.tokenParsed.realm_access.roles.includes("nds_god")
                                //@ts-ignore
                                && !keycloak.tokenParsed.realm_access.roles.includes("nds_store_manager")
                                //@ts-ignore
                                && !keycloak.tokenParsed.realm_access.roles.includes("nds_warehouse_manager")) && (
                                <MenuItem onClick={settingsHandle}>
                                    <ListItemIcon>
                                        <Settings fontSize="small"/>
                                    </ListItemIcon>
                                    Настройки
                                </MenuItem>
                            )
                        }
                        {   //@ts-ignore
                            keycloak.tokenParsed.realm_access.roles.includes("nds_god") && (
                                <MenuItem onClick={adminHandle}>
                                    <ListItemIcon>
                                        <LocalAtm fontSize="small"/>
                                    </ListItemIcon>
                                    Админка
                                </MenuItem>
                            )
                        }
                        {   //@ts-ignore
                            keycloak.tokenParsed.realm_access.roles.includes("nds_store_manager") && (
                                <MenuItem onClick={storeHandle}>
                                    <ListItemIcon>
                                        <LocationCityIcon fontSize="small"/>
                                    </ListItemIcon>
                                    Магазин
                                </MenuItem>
                            )
                        }
                        {   //@ts-ignore
                            keycloak.tokenParsed.realm_access.roles.includes("nds_warehouse_manager") && (
                                <MenuItem onClick={warehouseHandle}>
                                    <ListItemIcon>
                                        <WarehouseIcon fontSize="small"/>
                                    </ListItemIcon>
                                    Склад
                                </MenuItem>
                            )
                        }
                        <MenuItem onClick={() => keycloak.logout()}>
                            <ListItemIcon>
                                <Logout fontSize="small"/>
                            </ListItemIcon>
                            Выйти
                        </MenuItem>
                    </Menu>
                </Grid>
            )}
        </div>
    )
}

export default LoginButton;