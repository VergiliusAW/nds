import {Grid, Button, CircularProgress, Typography} from "@mui/material";
import React, {FC} from "react";
import LoginButton from "./LoginButton";
import {useKeycloak} from "@react-keycloak/web";
import Cart from "./Cart";

const Top: FC = () => {
    const {keycloak} = useKeycloak()
    return (
        <Grid container spacing={12}>
            <Grid container item xs={8} justifyContent="left">
                <Typography variant="h3" component="h2">
                    NDS
                </Typography>
            </Grid>
            <Grid container item xs={3} justifyContent="right" alignItems="center">
                {!!keycloak.authenticated && (
                    <>
                        <Cart/>
                    </>
                )}
            </Grid>
            <Grid container item xs={1} justifyContent="right" alignItems="center">
                {!!keycloak.authenticated && (
                    <>
                        <LoginButton/>
                    </>
                )}
            </Grid>
            <Grid item xs={4}>
                <Button>xs=4</Button>
            </Grid>
            <Grid item xs={8}>
                <Button>xs=8</Button>
            </Grid>
        </Grid>
    )
}

export default Top;