import React, {FC} from "react";
import {Grid, Paper} from "@mui/material";
import UserInfoContainer from "./UserInfoContainer";

const SettingsBody: FC = () => {
    return (
        <>
            <Grid container sx={{mt: "80px"}}>
                <Grid item md={1}/>
                <Grid item md={10}>
                    <Paper elevation={3} sx={{p: 2}}>
                        <UserInfoContainer/>
                    </Paper>
                </Grid>
                <Grid item md={1}/>
            </Grid>
        </>
    )
}

export default SettingsBody