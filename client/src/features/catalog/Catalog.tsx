import ProductList from "./ProductList";
import { useEffect } from "react";
import Loading from "../../app/layout/Loading";
import {
  useAppDispatch,
  useAppSelector,
} from "../../app/redux/configureReduxStore";
import {
  getProductFilters,
  getProductsAsync,
  productSelectors,
  setPageNumber,
  setProductParams,
} from "./catalogSlice";
import { Grid, Paper, Typography } from "@mui/material";
import SearchComponent from "./SearchComponent";
import ChooseOptionComponent from "../../app/components/ChooseOptionComponent";
import CheckButtonsComponent from "../../app/components/CheckButtonsComponent";
import AppPagination from "../../app/components/AppPagination";

const sortOptions = [
  { value: "name", label: "Alfabetycznie" },
  { value: "highPrice", label: "Cena Malejąca" },
  { value: "lowPrice", label: "Cena Rosnąca" },
  { value: "rate", label: "Ocena - Od Najwyższej" },
];

export default function Catalog() {
  const products = useAppSelector(productSelectors.selectAll);

  const {
    LoadedProducts,
    status,
    LoadedFilters,
    categories,
    types,
    productParams,
    metaData,
  } = useAppSelector((state) => state.catalog);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!LoadedProducts) dispatch(getProductsAsync());
  }, [LoadedProducts, dispatch]);

  useEffect(() => {
    if (!LoadedFilters) dispatch(getProductFilters());
  }, [LoadedFilters]);

  if (status.includes("pending") || !metaData)
    return <Loading message="Ładowanie Katalogu" />;

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <Paper sx={{ marginTop: 1 }}>
            <SearchComponent />
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ marginBottom: 5, padding: 2 }}>
        <Grid container spacing={4}>
          <Grid item xs={4}>
            <Typography variant="h4">Sortowanie</Typography>
            <ChooseOptionComponent
              selectedValue={productParams.orderBy}
              sortOptions={sortOptions}
              onChange={(event) =>
                dispatch(setProductParams({ orderBy: event.target.value }))
              }
            />
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h4">Kategoria:</Typography>
            <CheckButtonsComponent
              items={categories}
              checked={productParams.categories}
              onChange={(items: string[]) =>
                dispatch(setProductParams({ categories: items }))
              }
              cond={productParams.types.length > 0}
            />
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h4">Podkategoria:</Typography>
            <CheckButtonsComponent
              items={types}
              checked={productParams.types}
              onChange={(items: string[]) =>
                dispatch(setProductParams({ types: items }))
              }
              sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
              cond={!(productParams.categories.length > 0)}
            />
          </Grid>
        </Grid>
      </Paper>

      <ProductList products={products} />
      <AppPagination
        metaData={metaData}
        ChangePage={(pageNr: number) =>
          dispatch(setPageNumber({ pageNumber: pageNr }))
        }
      />
    </>
  );
}
