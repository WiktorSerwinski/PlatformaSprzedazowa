import { Box, Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Add, Delete, Remove } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import BasketSummary from "./BasketSummary";
import { showprice } from "../../app/utils/util";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { addBasketItemAsync, deleteBasketItemAsync } from "./basketSlice";



export default function BasketPage(){
    
    const dispatch = useAppDispatch();
    const {basket,status} = useAppSelector(state=>state.basket);
        
    if(basket==null) return <Typography variant="h3">Koszyk jest pusty!</Typography>
    
    return (
       <>
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                <TableRow>
                    <TableCell>Produkt</TableCell>
                    <TableCell align="right">Cena</TableCell>
                    <TableCell align="center">Ilość</TableCell>
                    <TableCell align="right">Do zapłaty</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {basket.items.map((item) => (
                    <TableRow
                    key={item.productId}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                    
                    <TableCell component="th" scope="row">
                        <Box display="flex" alignItems='center'>
                            <img src={item.pictureURL} alt={item.name} style={{maxHeight: 50,marginRight: 20}}></img>
                            <span>{item.name}</span>
                        </Box>
                    </TableCell>
                    
                    <TableCell align="right">{showprice(item.price)}</TableCell>
                    
                    <TableCell align="center">
                        <LoadingButton loading={status==='pendingDeleteItem'+item.productId+'one'}
                         
                        onClick={()=>dispatch(deleteBasketItemAsync({productId: item.productId,quantity: 1,type: 'one'}))} 
                        
                        color='error'>
                            <Remove/>
                        </LoadingButton>
                        {item.quantity}
                        <LoadingButton loading={status===('pendindAddItem'+item.productId)} 
                        onClick={()=>dispatch(addBasketItemAsync({productId: item.productId}))} color='success'>
                            <Add/>
                        </LoadingButton>
                    </TableCell>
                    
                    <TableCell align="right">{(showprice(item.price*item.quantity))}</TableCell>
                    
                    <TableCell> 
                    <LoadingButton loading={status==='pendingDeleteItem'+item.productId+'all'} 
                        onClick={()=>dispatch(deleteBasketItemAsync({productId: item.productId,quantity: item.quantity,type: 'all'}))} 
                        color='error'>
                            <Delete></Delete>
                        </LoadingButton>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </TableContainer>
        <Grid container>
           <Grid item xs={6}></Grid>
           <Grid item xs={6}>
                <BasketSummary basket={basket}/>
                <Button
                    component={Link}
                    to='/checkout'
                    variant='contained'
                    size = 'large'
                    fullWidth
                >
                    Przejdz do zapłaty
                </Button>
           </Grid>
        </Grid>

       </>
    );
    
    
}