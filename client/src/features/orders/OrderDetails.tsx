import { useEffect, useState } from "react";
import apiService from "../../app/api/apiService";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Grid,
  Button,
} from "@mui/material";
import { showprice } from "../../app/utils/util";
import Loading from "../../app/layout/Loading";
import Orders from "./Orders";

interface Props {
  orderId: number;
}

export default function OrderDetails({ orderId }: Props) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.Orders.fetch(orderId)
      .then((order) => setOrder(order))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading message="Ładowanie Zamówienia"></Loading>;
  if (order)
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
              {order?.orderedProducts.map((item) => (
                <TableRow
                  key={item.productId}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Box display="flex" alignItems="center">
                      <img
                        src={item.pictureUrl}
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
            <>
              <TableContainer component={Paper} variant={"outlined"}>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={2}>Opłata za produkty</TableCell>
                      <TableCell align="left">
                        {showprice(order?.subtotal)}
                      </TableCell>
                      <Table>
                        <TableRow>
                          <TableCell>Imię: {order.address.name}</TableCell>
                          <TableCell>
                            Nazwisko: {order.address.lastName}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Miasto: {order.address.city}</TableCell>
                          <TableCell>
                            Kod Pocztowy: {order.address.zipCode}
                          </TableCell>
                          <TableCell>Adres: {order.address.adress}</TableCell>
                        </TableRow>
                      </Table>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={2}>Opłata za dostarczenie:</TableCell>
                      <TableCell align="left">
                        {showprice(order?.deliveryFee)}
                      </TableCell>
                      <TableCell>Status: {order.status}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={2}>Opłata:</TableCell>
                      <TableCell align="left">
                        {showprice(order?.total)}
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          variant="contained"
                          sx={{ marginTop: "10px", backgroundColor: "#388e3c" }}
                          onClick={() => setOrder(null)}
                        >
                          Cofnij
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          </Grid>
        </Grid>
      </>
    );
  if (order == null) return <Orders />;
}
