import { Box, Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Add, Delete, Remove } from "@mui/icons-material";
import { useStoreContext } from "../../app/context/StoreContext";
import { useState } from "react";
import agent from "../../app/api/agent";
import { LoadingButton } from "@mui/lab";
import BasketSummary from "./BasketSummary";
import { showprice } from "../../app/utils/util";
import { Link } from "react-router-dom";



export default function BasketPage(){
    const {basket,setBasket,removeItem} = useStoreContext();
    const [status,setStatus] = useState({
        loading: false,
        name: '',
    })
    

    function handleAddItem(productId: number, name: string)
    {
        setStatus({loading: true, name})
        agent.Basket.addItem(productId)
        .then(basket=>setBasket(basket))
        .catch(error=>console.log(error))
        .finally(()=>setStatus({loading: false, name: ''}))
    }
    function handleDeleteItem(productId: number,quantity=1, name: string)
    {
        setStatus({loading: true, name})
        agent.Basket.deleteItem(productId,quantity)
        .then(()=>removeItem(productId,quantity))
        .catch(error=>console.log(error))
        .finally(()=>setStatus({loading: false, name: ''}))
    }
    
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
                        <LoadingButton loading={status.loading&& status.name==='del'+item.productId} 
                        onClick={()=>handleDeleteItem(item.productId,1,'del'+item.productId)} 
                        color='error'>
                            <Remove/>
                        </LoadingButton>
                        {item.quantity}
                        <LoadingButton loading={status.loading&& status.name==='add'+item.productId} onClick={()=>handleAddItem(item.productId,'add'+item.productId)} color='success'>
                            <Add/>
                        </LoadingButton>
                    </TableCell>
                    
                    <TableCell align="right">{(showprice(item.price*item.quantity))}</TableCell>
                    
                    <TableCell> 
                        <LoadingButton loading={status.loading&& status.name==='delAll'+item.productId}
                        onClick={()=>handleDeleteItem(item.productId,item.quantity,'delAll'+item.productId)} 
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