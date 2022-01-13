import React, {FC} from "react";
import StoreIssueComponent from "./StoreIssueComponent";
import {Grid, Paper} from "@mui/material";

const StoreBody: FC = () => {
    return (
        <>
            <Grid container sx={{mt: "80px"}}>
                <Grid item md={1}/>
                <Grid item md={10}>
                    <Paper elevation={3} sx={{p: 2}}>
                        <StoreIssueComponent/>
                    </Paper>
                </Grid>
                <Grid item md={1}/>
            </Grid>
        </>
    )
}

export default StoreBody