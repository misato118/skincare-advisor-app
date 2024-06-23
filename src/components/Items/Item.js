import React from 'react';
import { Card, CardMedia, CardContent, Typography } from "@mui/material"
import pic1 from "../../pictures/pic1.jpg";
import pic2 from "../../pictures/pic2.jpg";
import pic3 from "../../pictures/pic3.jpg";
import pic4 from "../../pictures/pic4.jpg";
import pic5 from "../../pictures/pic5.jpg";
import pic6 from "../../pictures/pic6.jpg";

const pictures = [pic1, pic2, pic3, pic4, pic5, pic6];

const Item = ({ product }) => {
    return (
        <Card>
            <CardMedia
                component="img"
                image={pictures[Math.floor(Math.random() * pictures.length)]}
                alt="Temp Picture"
                height="150"
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {product.name}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    ${product.price}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {product.description}
                </Typography>
            </CardContent>
        </Card>
    );
}

export default Item;