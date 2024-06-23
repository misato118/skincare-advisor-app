import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Container, Box, Grid, Paper } from '@mui/material';
import Copilot from "../components/Copilot";
import { getProducts } from "../actions/products";
import reducers from '../reducers';
import Basic from "./categories/Basic";
import Sunscreen from "./categories/Sunscreen";
import Makeup from "./categories/Makeup";
import Bodycare from "./categories/Bodycare";

const mainCategoryName = ["Basic", "Sunscreen", "Makeup", "Bodycare"];

const Home = ({ productPageName }) => {
    const dispatch = useDispatch();
    const [basicProduct, setBasicProduct] = useState([]);

    useEffect(() => {
        dispatch(getProducts());
    }, [dispatch]);

    return (
        <Grid container sx={{ height: "100vh" }}>
            <Grid item spacing={3} xs={true} sx={{ mx: "10px", my: "5px" }}>
                <Paper sx={{ bgcolor: "#ECC9C7", height: "100%", overflowY: "scroll", p: "30px" }}>
                    {
                        productPageName === mainCategoryName[0] ? <Basic />
                            : productPageName === mainCategoryName[1] ? <Sunscreen />
                            : productPageName === mainCategoryName[2] ? <Makeup />
                            : productPageName === mainCategoryName[2] ? <Bodycare />
                            : ""
                    }
                </Paper>
            </Grid>
            <Grid item xs={3} sx={{ mr: "10px", my: "5px" }}>
                <Paper sx={{ bgcolor: "#D9E3DA", height: "100%" }}><Copilot /></Paper>
            </Grid>
        </Grid>
    );
}

export default Home;