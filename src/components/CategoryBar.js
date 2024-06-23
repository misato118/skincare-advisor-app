import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Box, Tabs, Tab } from '@mui/material';
import "./CategoryBar.css";

const CategoryBar = () => {

    return (
        <Box>
            <Tabs centered>
                <Tab label="BASIC" aria-label="basic" component={Link} to="/basic" value="0" />
                <Tab label="SUNSCREEN" aria-label="sunscreen" component={Link} to="/sunscreen" value="1" />
                <Tab label="MAKEUP" aria-label="makeup" component={Link} to="/makeup" value="2" />
                <Tab label="BODYCARE" aria-label="bodycare" component={Link} to="/bodycare" value="3" />
                <Tab label="OTHERS" aria-label="others" component={Link} to="/others" value="4" />
            </Tabs>
        </Box>
    );
}

export default CategoryBar;

/*
        <Box sx={{ maxWidth: { xs: 320, sm: 480 } }}>
            <Tabs
                value={category}
                onChange={handleCategoryVal}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="scrollable auto tabs"
            >
                <Tab label="TONER" aria-label="toner" component={Link} to="/toner" value="0" />
                <Tab label="CLEANSING" aria-label="cleansing" component={Link} to="/cleansing" value="1" />
                <Tab label="FACEWASH" aria-label="facewash" component={Link} to="/facewash" value="2" />
                <Tab label="FACEMASK" aria-label="facemask" component={Link} to="/facemask" value="3" />
                <Tab label="ESSENCE" aria-label="essence" component={Link} to="/essence" value="4" />
                <Tab label="EYECARE" aria-label="eyecare" component={Link} to="/eyecare" value="5" />
                <Tab label="OTHERS" aria-label="others" component={Link} to="/others" value="6" />
            </Tabs>
        </Box>


*/