import {
    Grid,
    Button,
    CircularProgress,
    Typography,
    AppBar,
    Toolbar,
    Container,
    MenuItem,
    ListItemIcon
} from "@mui/material";
import React, {FC} from "react";
import LoginButton from "./LoginButton";
import {useKeycloak} from "@react-keycloak/web";
import Cart from "./Cart";
import Settings from "@mui/icons-material/Settings";

const Top: FC = () => {
    const {keycloak} = useKeycloak()
    const handleLogo = () => {
        window.location.replace("/")
    }
    return (
        <AppBar color="inherit">
            <Toolbar>
                <Grid container item xs={1} justifyContent="right" alignItems="center">
                </Grid>
                <Grid container item xs={1} justifyContent="right" alignItems="center" onClick={handleLogo}
                      sx={{cursor: "pointer"}}>
                    <img src="https://cloud.krista.ru/index.php/s/w5NX0e4zbXXhDZS/download" alt="logo"
                         style={{width: "100%"}}/>
                </Grid>
                <Grid container item xs={7} justifyContent="right" alignItems="center">
                </Grid>
                <Grid container item xs={1} justifyContent="center" alignItems="center">
                    {(!!keycloak.authenticated &&
                        //@ts-ignore
                        !keycloak.tokenParsed.realm_access.roles.includes("nds_god")
                        //@ts-ignore
                        && !keycloak.tokenParsed.realm_access.roles.includes("nds_warehouse_manager") && (
                            <Cart/>
                        )
                    )}
                </Grid>
                <Grid container item xs={1} justifyContent="left" alignItems="center">
                    <>
                        <LoginButton/>
                    </>
                </Grid>
                <Grid container item xs={1} justifyContent="right" alignItems="center">

                </Grid>
            </Toolbar>
        </AppBar>
    )
}

export default Top;