import React from "react";
import { Link } from "react-router-dom";
import { Box, Tabs, Tab, Paper, InputBase, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import "./Navbar.css";

const Navbar = () => {
    return (
        <Box sx={{ bgcolor: "#ECC9C7", p: "5px 0px" }}>
            <Tabs centered>
                <Tab label="HOME" aria-label="home" component={Link} to="/" value="0" />
                <Paper
                    component="form"
                    sx={{ p: "1px 2px", m: "10px 0px", display: "flex", alignItems: "center", width: 300 }}
                >
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Search Products"
                        inputProps={{ "aria-label": "search products" }}
                    />
                    <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
                        <SearchIcon />
                    </IconButton>
                </Paper>
                <Tab label="PROFILE" aria-label="profile" component={Link} to="/profile" value="1" />
            </Tabs>
        </Box>
    );
}

export default Navbar;