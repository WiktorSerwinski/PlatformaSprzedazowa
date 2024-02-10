import { Button, Menu, Fade, MenuItem, Typography } from "@mui/material";
import React, {  } from "react";
import { useAppDispatch, useAppSelector } from "../redux/configureReduxStore";
import { signOut } from "../../features/account/accountSlice";
import { showprice } from "../utils/util";
import { clearBasket } from "../../features/basket/basketSlice";
import { Link } from "react-router-dom";

export default function AccountMenu() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.account);


 

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
      <Button color="inherit" onClick={handleClick} sx={{ typography: "h6" }}>
        {user?.email}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <MenuItem component={Link} to="/profil">
          Profil
        </MenuItem>
        <MenuItem component={Link} to="/historia-zamowien">
          {" "}
          Historia Zamówień
        </MenuItem>
        <MenuItem
          onClick={() => {
            dispatch(signOut());
            dispatch(clearBasket());
          }}
        >
          Wyloguj
        </MenuItem>
      </Menu>
      <Typography
        color="inherit"
        variant="h6"
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        Stan Konta: {showprice(user!.accountStatus)}
      </Typography>
    </>
  );
}
