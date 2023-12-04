import {
  Divider,
  Grid,
  Rating,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NotFound from "../../app/errors/NotFound";
import Loading from "../../app/layout/Loading";
import { LoadingButton } from "@mui/lab";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { addBasketItemAsync, deleteBasketItemAsync} from "../basket/basketSlice";
import { getProductAsync,productSelectors } from "./catalogSlice";

export default function ProductDetails() {
  const dispatch = useAppDispatch();
  const {basket,status} = useAppSelector(state=>state.basket);
  const {id} = useParams<{ id: string }>();
  
  const product = useAppSelector(state => productSelectors.selectById(state,id!)); 
  
  const [value, setValue] = useState<number | null>(4);
  const {status: productStatus} = useAppSelector(state=> state.catalog)
  const [quantity,setQuantity] = useState(0);
  const item=basket?.items.find(i=>i.productId===product?.id)


  useEffect(() => {
    if(item) setQuantity(item.quantity)
    if(!product && id) dispatch(getProductAsync(parseInt(id)))
  }, [id,item,dispatch,product]);


  function handleInput(event: any)
  {
    if(event.target.value>=0){
      setQuantity(event.target.value)
    }
  }

  function handleUpdateCart(){
    if(!item || quantity > item.quantity){
      const newQuantity=item ? quantity - item.quantity : quantity;
      dispatch(addBasketItemAsync({productId: product?.id!,quantity: newQuantity}))
    }
    else{
      const newQuantity = item.quantity - quantity;
      dispatch(deleteBasketItemAsync({productId: product?.id!,quantity: newQuantity}))
    }
  }

  if (productStatus.includes('pending')) return <Loading message="Ładowanie Produktu" />;

  if (!product) return <NotFound />;

  return (
    <Grid container spacing={6}>
      <Grid item xs={6}>
        <img
          src={product.pictureUrl}
          alt={product.name}
          style={{ width: "100%" }}
        />
      </Grid>
      <Grid item xs={6}>
        <Typography variant="h3">{product.name}</Typography>
        <Divider sx={{ marginbottom: 2 }} />
        <Typography variant="h4" color="#388e3c">
          {(product.price / 100).toFixed(2)} ®
        </Typography>
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Nazwa</TableCell>
                <TableCell>{product.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Opis: </TableCell>
                <TableCell>{product.description}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Kategoria: </TableCell>
                <TableCell>{product.category}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Typ: </TableCell>
                <TableCell>{product.type}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Dostepna ilość</TableCell>
                <TableCell>{product.quantityInStock}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography component="legend">Ocena</Typography>
                </TableCell>
                <TableCell>
                  <Rating
                    name="simple-controlled"
                    value={value}
                    onChange={(_, newValue: number | null) => {
                      setValue(newValue);
                    }}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Grid container spacing={2} sx={{marginTop: '10px'}}>
          <Grid item xs={6}>         
            <TextField
              onChange={handleInput}
              variant='outlined'
              type ='number'
              label='Ilość w koszyku'
              fullWidth
              value={quantity}
            />                     
          </Grid>
          <Grid item xs={6}>
            <LoadingButton 
            sx={{height: '60px'}}
            color='success'
            size='large'
            variant='contained'
            fullWidth
            onClick={handleUpdateCart}
            loading={status.includes('pending')}
            disabled={item?.quantity===quantity || !item && quantity===0}
            >
              {item ? 'Zmień ilość w koszyku' : 'Dodaj do koszyka'}
            </LoadingButton>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
