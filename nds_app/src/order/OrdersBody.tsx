import React, {FC} from "react";
import {Grid, Paper} from "@mui/material";
import OrdersContainer from "./OrdersContainer";

const OrdersBody: FC = () => {
    return(
        <>
            <Grid container sx={{mt: "80px"}}>
                <Grid item md={1}></Grid>
                <Grid item md={10}>
                    <Paper elevation={3} sx={{p: 2}}>
                        <OrdersContainer/>
                    </Paper>
                </Grid>
                <Grid item md={1}></Grid>
            </Grid>
        </>
    )
}

export default OrdersBody