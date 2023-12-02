import { Button } from "@mui/material";
import { Product } from "../../app/models/product";
import ProductList from "./ProductList";
import { useState, useEffect } from "react";
import agent from "../../app/api/agent";
import Loading from "../../app/layout/Loading";

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    agent.Catalog.list()
      .then((products) => setProducts(products))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, []);
  
  if (loading) return <Loading message="Ładowanie Katalogu" />;

  function addProduct() {
    setProducts((prevstate) => [
      ...prevstate,
      {
        id: prevstate.length + 101,
        name: "product" + (prevstate.length + 1),
        price: prevstate.length * 100 + 100,
        category: "some new brand",
        description: "some new descr",
        pictureUrl: "http://picsum.photos/200",
      },
    ]);
  }

  return (
    <>
      <ProductList products={products} />
      <Button variant="outlined" onClick={addProduct}>
        Add product
      </Button>
    </>
  );
}
