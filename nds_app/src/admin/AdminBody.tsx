import React, {FC, useState} from "react";
import {Grid, Paper} from "@mui/material";
import AdminAddStoreComponent from "./AdminAddStoreComponent";
import AdminAddGoodsLabelComponent from "./AdminAddGoodsLabelComponent";
import AdminAddCategoriesComponent from "./AdminAddCategoriesComponent";
import AdminAddCategoriesToGoodsLabelComponent from "./AdminAddCategoriesToGoodsLabelComponent";

const AdminBody: FC = () => {
    const [change, setChange] = useState(false)
    return (
        <>
            <Grid container sx={{mt: "80px"}}>
                <Grid item md={1}/>
                <Grid item md={10}>
                    <Paper elevation={3} sx={{p: 2}}>
                        <AdminAddStoreComponent/>
                    </Paper>
                </Grid>
                <Grid item md={1}/>
            </Grid>
            <Grid container sx={{mt: "80px"}}>
                <Grid item md={1}/>
                <Grid item md={10}>
                    <Paper elevation={3} sx={{p: 2}}>
                        <AdminAddGoodsLabelComponent setChange={setChange}/>
                    </Paper>
                </Grid>
                <Grid item md={1}/>
            </Grid>
            <Grid container sx={{mt: "80px"}}>
                <Grid item md={1}/>
                <Grid item md={10}>
                    <Paper elevation={3} sx={{p: 2}}>
                        <AdminAddCategoriesComponent setChange={setChange}/>
                    </Paper>
                </Grid>
                <Grid item md={1}/>
            </Grid>
            <Grid container sx={{mt: "80px"}}>
                <Grid item md={1}/>
                <Grid item md={10}>
                    <Paper elevation={3} sx={{p: 2}}>
                        <AdminAddCategoriesToGoodsLabelComponent change={change} setChange={setChange}/>
                    </Paper>
                </Grid>
                <Grid item md={1}/>
            </Grid>
        </>
    )
}

export default AdminBody