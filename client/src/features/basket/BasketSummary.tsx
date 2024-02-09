import { TableContainer, Paper, Table, TableBody, TableRow, TableCell} from "@mui/material";
import { Basket } from "../../app/models/basket";
import { showprice } from "../../app/utils/util";

interface Props {
    basket: Basket|null;
  }
export default function BasketSummary({basket}:Props) {
    
    if(basket)
    {
        const subtotal= basket.items.reduce((sum,item) => sum+item.price*item.quantity,0 )
        var deliveryFee = 10000;
        if((subtotal/100)>=1000) deliveryFee=0
        return (
            <>
                <TableContainer component={Paper} variant={'outlined'}>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={2}>Opłata za produkty</TableCell>
                                <TableCell align="right">{showprice(subtotal)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={2}>Opłata za dostarczenie:</TableCell>
                                <TableCell align="right">{showprice(deliveryFee)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={2}>Opłata:</TableCell>
                                <TableCell align="right">{showprice(deliveryFee+subtotal)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <span style={{fontStyle: 'italic',color: 'lime'}}>Opłata za dostarczenie przy zamówieniu powyżej 1000 ® wynosi 0 !!!</span>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </>
        )

    }
   
}