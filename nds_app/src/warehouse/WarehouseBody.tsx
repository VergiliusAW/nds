import React, {FC, useState} from "react";
import {Grid, Paper, Stack} from "@mui/material";
import WarehouseDataGrid from "./WarehouseDataGrid";
import WarehouseNewOrdersContainer from "./WarehouseNewOrdersContainer";
import TransitContainer from "./TransitContainer";

const WarehouseBody: FC = () => {
    const [state, setState] = useState(false)
    return (
        <Stack>
            <Grid container sx={{mt: "80px"}}>
                <Grid item md={1}/>
                <Grid item md={10}>
                    <Paper elevation={3} sx={{p: 2}}>
                        <WarehouseDataGrid/>
                    </Paper>
                </Grid>
                <Grid item md={1}/>
            </Grid>
            <Grid container sx={{mt: "80px"}}>
                <Grid item md={1}/>
                <Grid item md={10}>
                    <Paper elevation={3} sx={{p: 2}}>
                        <WarehouseNewOrdersContainer state={state} setState={setState}/>
                    </Paper>
                </Grid>
                <Grid item md={1}/>
            </Grid>
            <Grid container sx={{mt: "80px"}}>
                <Grid item md={1}/>
                <Grid item md={10}>
                    <Paper elevation={3} sx={{p: 2}}>
                        <TransitContainer setState={setState} state={state}/>
                    </Paper>
                </Grid>
                <Grid item md={1}/>
            </Grid>
        </Stack>

    )
}

export default WarehouseBody