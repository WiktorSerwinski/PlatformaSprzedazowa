import { Button } from "@mui/material";
import { Product } from "../../app/models/product";
import ProductList from "./ProductList";
import { useState, useEffect } from "react";








export default function Catalog() {
  const [products,setProducts]=useState<Product[]>([]);

useEffect(()=>{
  fetch('http://localhost:5000/api/products')
    .then(response=>response.json())
    .then(data=>setProducts(data))
},[])



function addProduct(){
  setProducts(prevstate=>[...prevstate,
    {
      id: prevstate.length+101,
      name:"product"+(prevstate.length+1),
      price:(prevstate.length*100+100),
      brand: "some new brand",
      description: "some new descr",
      pictureUrl: "http://picsum.photos/200"
  }])
}

  
  
  
  
  return (
    <>
      <ProductList products={products}/>
      <Button variant="outlined" onClick={addProduct}>Add product</Button>
    </>
  );
}