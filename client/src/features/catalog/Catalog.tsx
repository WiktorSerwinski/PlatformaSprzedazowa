import ProductList from "./ProductList";
import { useEffect } from "react";
import Loading from "../../app/layout/Loading";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { getProductFilters, getProductsAsync, productSelectors } from "./catalogSlice";
import { Box, Checkbox, FormControl, FormControlLabel, FormGroup, Grid, Pagination, Paper, Radio, RadioGroup, TextField, Typography } from "@mui/material";

const sortOptions = [
  {value: 'name' , label: 'Alfabetycznie'},
  {value: 'highPrice' , label: 'Cena Malejąca'},
  {value: 'lowPrice' , label: 'Cena Rosnąca'}
]


export default function Catalog() {
  const products = useAppSelector(productSelectors.selectAll);

  const {LoadedProducts, status,LoadedFilters,categories,types} = useAppSelector(
    (state) => state.catalog
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!LoadedProducts) dispatch(getProductsAsync());
    
  }, [LoadedProducts, dispatch]);

  useEffect(()=>{
    if (!LoadedFilters) dispatch(getProductFilters());
  },[LoadedFilters])



  if (status.includes("pending"))
    return <Loading message="Ładowanie Katalogu" />;

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <Paper sx={{marginTop:1}}>
            <TextField
            fullWidth
              label='Znajdz produkt'
            />
          </Paper>                        
        </Grid>
      </Grid>

      <Paper sx={{marginBottom:5,padding:2}}>
        <Grid container spacing={4}>
          <Grid item xs={4}>          
              <Typography variant="h4">Sortowanie</Typography>
              <FormControl component={'fieldset'}>
                  <RadioGroup>
                    {sortOptions.map(({value,label})=>(
                      <FormControlLabel value={value} control={<Radio />} label={label} />    
                    ))}
                  </RadioGroup>
              </FormControl>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h4">Kategoria:</Typography>
            <FormGroup>
              {categories.map(category=>(
                  <FormControlLabel control={<Checkbox />} label={category} key={category} />
              ))}
            </FormGroup>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h4">Podkategoria:</Typography>
            <Grid>
                <FormGroup sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                  {types.map(type=>(
                      <FormControlLabel control={<Checkbox />} label={type} key={type} />
                  ))}
                </FormGroup>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      
      <ProductList products={products} />



      <Box display='flex' justifyContent={'space-between'} alignItems={'center'}>
        {/* <Typography>
          Displaying 1-5 Page
        </Typography> */}
        <Pagination
          color="standard"
          size = 'large'
          count={10}
          page = {2}
        />
      </Box>

    </>
  );
}
