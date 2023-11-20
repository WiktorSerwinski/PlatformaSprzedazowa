import { ShoppingCart } from "@mui/icons-material";
import { AppBar,Badge,Box,IconButton,List,ListItem,Switch, Toolbar, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";


const midLinks=[
    {title: 'catalog', path: '/catalog'},
    {title: 'about', path: '/about'},
    {title: 'contact', path: '/contact'},
]

const rightLinks=[
    {title: 'login', path: '/login'},
    {title: 'register', path: '/register'},
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
    return(
        <AppBar position="static" sx={{marginBottom:4}} >
            <Toolbar sx={{display: 'flex', justifyContent: 'space-between', allignItems: 'center'}}>

                <Box sx={{display:'flex',allignItems: 'center'}}>
                    <Typography component={NavLink} to='/' variant="h6" sx={navStyles}>
                        Platforma Sprzedażowa WIK     
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
                        <Badge badgeContent='0' color='secondary'>
                            <ShoppingCart/>
                        </Badge>
                    </IconButton>



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
                </Box>
                
            </Toolbar>
        </AppBar>
    )
}