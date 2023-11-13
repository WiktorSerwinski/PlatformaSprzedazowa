import { AppBar,Switch, Toolbar, Typography } from "@mui/material";

interface Props{
    setDarkMode: ()=>void;
}


export default function Header({setDarkMode}:Props){
    return(
        <AppBar position="static" sx={{marginBottom:4}} >
            <Toolbar>
                <Typography variant="h6">Platforma Sprzedżaowa WIK     </Typography>
                <Switch onChange={setDarkMode}/>
            </Toolbar>
        </AppBar>
    )
}