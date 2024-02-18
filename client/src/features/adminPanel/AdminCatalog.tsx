import { Typography, Button, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Box } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { showprice } from "../../app/utils/util";
import { useEffect, useState } from "react";
import apiService from "../../app/api/apiService";
import { Product } from "../../app/models/product";
import Loading from "../../app/layout/Loading";
import AdminProduct from "./AdminProduct";

export default function AdminCatalog() {
    
    const [products, setProducts] = useState<Product[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [editProduct,setEditProduct] = useState(false);
    const [product,setProduct] = useState<Product | undefined>(undefined);

    function handleSetProduct(product: Product)
    {
        setProduct(product);
        setEditProduct(true);
    }
    function rejectEdit(){
        if(product) setProduct(undefined);
        setEditProduct(false);
    }
    function handleDelete(id: number){
        apiService.Admin.deleteProduct(id)
    }
    useEffect(() => {
        apiService.Catalog.all()
          .then((products) => setProducts(products))
          .catch((error) => console.log(error))
          .finally(() => setLoading(false));
      }, [handleDelete]);
    if (loading) return <Loading message="Ładowanie wszystkich produktów..." />;
    if(editProduct) return (<AdminProduct product={product} rejectEdit={rejectEdit}/>)
    return (
        <>
            <Box display='flex' justifyContent='space-between'>
                <Typography  variant='h3'sx={{ marginBottom: "20px"}} >Obecna Zawartość Katalogu:</Typography>
                <Button onClick={() => setEditProduct(true)} sx={{ marginBottom: "20px", backgroundColor: "#388e3c" }} size='large' variant='contained'>Dodaj Nowy Produkt</Button>
            </Box>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>id</TableCell>
                            <TableCell align="left">Nazwa</TableCell>
                            <TableCell align="right">Cena</TableCell>
                            <TableCell align="center">Kategoria</TableCell>
                            <TableCell align="center">Podkategoria</TableCell>
                            <TableCell align="center">Dostępna Ilość</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products?.map((product) => (
                            <TableRow
                                key={product.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {product.id}
                                </TableCell>
                                <TableCell align="left">
                                    <Box display='flex' alignItems='center'>
                                        <img src={product.pictureUrl} alt={product.name} style={{ height: 50, marginRight: 20 }} />
                                        <span>{product.name}</span>
                                    </Box>
                                </TableCell>
                                <TableCell align="right">{showprice(product.price)}</TableCell>
                                <TableCell align="center">{product.category}</TableCell>
                                <TableCell align="center">{product.type}</TableCell>
                                <TableCell align="center">{product.quantityInStock}</TableCell>
                                <TableCell align="right">
                                    <Button onClick={()=>handleSetProduct(product)} startIcon={<Edit />} />
                                    <Button onClick={()=>handleDelete(product.id)} startIcon={<Delete />} color='error' />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}