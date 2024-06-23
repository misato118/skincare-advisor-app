import React from "react";
import { Grid, Paper } from '@mui/material';
import Copilot from "../../components/Copilot";

const Others = () => {
    return (
        <Grid container sx={{ height: "100vh" }}>
            <Grid item spacing={3} xs={true} sx={{ mx: "10px", my: "5px" }}>
                <Paper sx={{ bgcolor: "#ECC9C7", height: "100%" }}>Others</Paper>
            </Grid>
            <Grid item xs={3} sx={{ mr: "10px", my: "5px" }}>
                <Paper sx={{ bgcolor: "#D9E3DA", height: "100%" }}><Copilot /></Paper>
            </Grid>
        </Grid>
    );
}

export default Others;