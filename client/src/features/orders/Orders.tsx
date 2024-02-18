import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import apiService from "../../app/api/apiService";
import Loading from "../../app/layout/Loading";
import { showprice } from "../../app/utils/util";
import OrderDetails from "./OrderDetails";
import { useAppSelector } from "../../app/redux/configureReduxStore";

export default function Orders() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState(0);
  const { user } = useAppSelector((state) => state.account);
  useEffect(() => {
    apiService.Orders.list()
      .then((orders) => setOrders(orders))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, [orders]);

  if (loading) return <Loading message="Ładowanie Listy Zamówień" />;
  if (details == 0)
    return (
      <>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Numer Zamówienia</TableCell>
                <TableCell align="right">Kwota</TableCell>
                <TableCell align="right">Data</TableCell>
                <TableCell align="right">Status</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders?.map((order) => (
                <TableRow
                  key={order.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {order.id}
                  </TableCell>
                  <TableCell align="right">{showprice(order.total)}</TableCell>
                  <TableCell align="right">
                    {order.orderDate.split("T")[0]}
                  </TableCell>
                  <TableCell align="right">{order.status}</TableCell>
                  <TableCell align="right">
                    <Button onClick={() => setDetails(order.id)}>
                      Szczegóły
                    </Button>
                    {user?.roles?.includes("Admin") ? (
                      <Button onClick={async () => {await apiService.Admin.changeorderStatus(order.id) }}>
                        Potwierdz
                      </Button>
                    ) : (
                      <></>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  if (details != 0) return <OrderDetails orderId={details} />;
}
