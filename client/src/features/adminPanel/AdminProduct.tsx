import { Typography, Grid, Paper, Box, Button } from "@mui/material";
import { FieldValues, useForm } from "react-hook-form";
import TextInputComponent from "../../app/components/TextInput";
import { Product } from "../../app/models/product";
import { useEffect } from "react";
import ImageDropZone from "../../app/components/ImageDropZone";
import { yupResolver } from "@hookform/resolvers/yup";
import { validationSchema } from "./YupProdcutValidation";
import apiService from "../../app/api/apiService";

interface Props {
  product?: Product;
  rejectEdit: () => void;
}

export default function AdminProduct({ product, rejectEdit }: Props) {
  const {
    control,
    reset,
    handleSubmit,
    watch,
  } = useForm({
    resolver: yupResolver<any>(validationSchema),
  });
  const watchPicture = watch("picture", null);
  useEffect(() => {
    if (product) reset(product);
  }, [product, reset]);

  async function handleSubmitProduct(data: FieldValues) {
    try {
      let resp: Product;
      if (product) {
        resp = await apiService.Admin.updateProduct(data, product.id);
      } else {
        resp = await apiService.Admin.createProduct(data);
        rejectEdit();
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Box component={Paper} sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Szczegóły Produktu:
      </Typography>
      <form onSubmit={handleSubmit(handleSubmitProduct)}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12}>
            <TextInputComponent
              control={control}
              name="name"
              label="Nazwa Produktu"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextInputComponent
              control={control}
              name="category"
              label="Kategoria"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextInputComponent
              control={control}
              name="type"
              label="Podkategoria"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextInputComponent
              type="number"
              control={control}
              name="price"
              label="Cena"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextInputComponent
              type="number"
              control={control}
              name="quantityInStock"
              label="Dostępna ilość"
            />
          </Grid>
          <Grid item xs={12}>
            <TextInputComponent
              multiline={true}
              rows={6}
              control={control}
              name="description"
              label="Opis"
            />
          </Grid>
          <Grid item xs={12}>
            <Box display={"flex"}>
              <ImageDropZone control={control} name="picture" />
              {watchPicture ? (
                <img
                  src={watchPicture.preview}
                  alt="preview"
                  style={{ maxHeight: 200 }}
                />
              ) : (
                <img
                  src={product?.pictureUrl}
                  alt={product?.name}
                  style={{ maxHeight: 200 }}
                />
              )}
            </Box>
          </Grid>
        </Grid>
        <Box display="flex" justifyContent="space-between" sx={{ mt: 3 }}>
          <Button onClick={rejectEdit} variant="contained" color="inherit">
            Cofnij
          </Button>
          <Button type="submit" variant="contained" color="success">
            Zatwierdz zmiany
          </Button>
        </Box>
      </form>
    </Box>
  );
}
