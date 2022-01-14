import {AppBar, Grid, Toolbar} from "@mui/material";
import React, {FC} from "react";
import LoginButton from "./LoginButton";
import {useKeycloak} from "@react-keycloak/web";
import Cart from "./Cart";
import {Link} from "react-router-dom";

const Top: FC = () => {
    const {keycloak} = useKeycloak()

    return (
        <AppBar color="inherit">
            <Toolbar>
                <Grid container item xs={1} justifyContent="right" alignItems="center">
                </Grid>
                <Grid container item xs={1} justifyContent="right" alignItems="center"
                      sx={{cursor: "pointer"}}>
                    <Link to={"/"}>
                        <img src="https://cloud.krista.ru/index.php/s/w5NX0e4zbXXhDZS/download" alt="logo"
                             style={{width: "100%"}}/>
                    </Link>
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