import { Button, Menu, Fade, MenuItem, Typography } from "@mui/material";
import React from "react";
import { useAppDispatch, useAppSelector } from "../store/configureStore";
import { signOut } from "../../features/account/AccountSlice";
import { showprice } from "../utils/util";
import { clearBasket } from "../../features/basket/basketSlice";

export default function AccountMenu()
{
    const dispatch = useAppDispatch();
    const {user} = useAppSelector(state => state.account);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
    <>
        <Button
            color = 'inherit'
            onClick={handleClick}
            sx={{typography: 'h6'}}
        >
        {user?.email}
        </Button>
        <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
        >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My orders</MenuItem>
        <MenuItem onClick={() => {
            dispatch(signOut()) 
            dispatch(clearBasket())                     
        }}>Logout</MenuItem>
        </Menu>
        <Typography color='inherit' variant="h6" sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            Stan Konta: {showprice(user!.accountStatus)}
        </Typography>
    </>
    );
}