import { ShoppingCart } from "@mui/icons-material";
import { AppBar,Badge,Box,IconButton,List,ListItem,Switch, Toolbar, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import { useAppSelector } from "../store/configureStore";
import AccountMenu from "./AccountMenu";


const midLinks=[
    {title: 'Katalog', path: '/catalog'},
    {title: 'Test', path: '/about'},
    {title: 'Kontakt', path: '/contact'},
]

const rightLinks=[
    {title: 'Zaloguj', path: '/login'},
    {title: 'Rejestracja', path: '/register'},
]


interface Props{
    setDarkMode: ()=>void;
    darkMode: boolean;
}
const navStyles=
{
    color:'inherit',
    textDecoration: 'none',
    Typography: 'h6',
    '&:hover':{
        color: 'grey.500'
    },
    '&.active': {
        color: 'text.secondary'
    }
}


export default function Header({setDarkMode,darkMode}:Props){
    const {basket} = useAppSelector(state=>state.basket)
    const {user} = useAppSelector(state => state.account)
    
    const count = basket?.items.reduce((sum,item) => sum+item.quantity,0 )
    
    return(
        <AppBar position="static" sx={{marginBottom:4}} >
            <Toolbar sx={{display: 'flex', justifyContent: 'space-between', allignItems: 'center', backgroundColor: '#8bc34a'}}>

                <Box sx={{display:'flex',allignItems: 'center'}}>
                    <Typography component={NavLink} to='/' variant="h6" sx={navStyles}>
                        Platforma Sprzedażowa SerWik     
                    </Typography>
                    <Switch onChange={setDarkMode} checked={darkMode}/>
                </Box>
                
                
                <Box>
                    <List sx={{display: 'flex'}}>
                        {midLinks.map(({title,path})=>(
                            <ListItem
                                component={NavLink}
                                to={path}
                                key={path}
                                sx={navStyles}
                            >
                            {title.toUpperCase()}
                            </ListItem>
                            ))}
                    </List>
                </Box>
                
                <Box sx={{display:'flex',allignItems: 'center'}}>
                    <IconButton size="large" edge='start' color='inherit' sx={{mr: 2}}>
                        <Badge badgeContent={count} color='secondary' component={NavLink} to='/basket'>
                            <ShoppingCart/>
                        </Badge>
                    </IconButton>
                

                    {user ? (
                        <AccountMenu/>
                    ): (
                        <List sx={{display: 'flex'}}>
                        {rightLinks.map(({title,path})=>(
                            <ListItem
                            component={NavLink}
                            to={path}
                            key={path}
                            sx={navStyles}
                            >
                                {title.toUpperCase()}

                            </ListItem>
                            ))}
                    </List>
                    )}                  
                </Box>
                
            </Toolbar>
        </AppBar>
    )
}