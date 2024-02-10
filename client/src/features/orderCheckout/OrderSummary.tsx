import { Typography } from "@mui/material";
import OrderBasket from "./OrderBasket";

export default function OrderSummary() {
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Podsumowanie Zamówienia 
      </Typography>
      <OrderBasket />
    </>
  );
}
