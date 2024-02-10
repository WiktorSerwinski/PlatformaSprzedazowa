import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import BasketSummary from "../basket/BasketSummary";
import { showprice } from "../../app/utils/util";
import { useAppSelector } from "../../app/redux/configureReduxStore";

export default function OrderBasket() {
  const { basket } = useAppSelector((state) => state.basket);

  if (basket == null)
    return <Typography variant="h3">Koszyk jest pusty!</Typography>;

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
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Box display="flex" alignItems="center">
                    <img
                      src={item.pictureURL}
                      alt={item.name}
                      style={{ maxHeight: 50, marginRight: 20 }}
                    ></img>
                    <span>{item.name}</span>
                  </Box>
                </TableCell>

                <TableCell align="right">{showprice(item.price)}</TableCell>

                <TableCell align="center">{item.quantity}</TableCell>
                <TableCell align="right">
                  {showprice(item.price * item.quantity)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Grid container>
        <Grid item xs={12}>
          <BasketSummary basket={basket} />
        </Grid>
      </Grid>
    </>
  );
}
