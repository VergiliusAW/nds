import React, {FC, useEffect, useState} from 'react'
import {Avatar, Button, Chip, Grid, ListItemIcon, Menu, MenuItem} from "@mui/material";
import {useKeycloak} from "@react-keycloak/web";
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import {LocalAtm} from "@mui/icons-material";

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
        }
    }, [keycloak.authenticated])
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
                        <MenuItem>
                            <ListItemIcon>
                                <LocalAtm fontSize="small"/>
                            </ListItemIcon>
                            Заказы
                        </MenuItem>
                        <MenuItem>
                            <ListItemIcon>
                                <Settings fontSize="small"/>
                            </ListItemIcon>
                            Настройки
                        </MenuItem>
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