import React from "react";
import { useSelector } from "react-redux";
import { CircularProgress, Grid } from '@mui/material';
import Item from "./Item";

const Items = ({ categoryName }) => {
    const products = useSelector((state) => state.products);

    return (
        !products[categoryName].length ? <CircularProgress /> : (
            <Grid container alignItems="center" spacing={3}>
                {products[categoryName].map((product) => (
                    <Grid key={product.id} item xs={3}>
                        <Item product={product} />
                    </Grid>
                ))}
            </Grid>
        )
    );
}

export default Items;