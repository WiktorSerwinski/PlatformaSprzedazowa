import { Typography, Grid } from "@mui/material";
import { useFormContext } from "react-hook-form";
import TextInputComponent from "../../app/components/TextInput";
import CheckboxInput from "../../app/components/CheckBoxInput";

export default function OrderAddress() {
  const { control } = useFormContext();

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Dane Kupującego:
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextInputComponent control={control} name="name" label="Imię" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextInputComponent
            control={control}
            name="lastName"
            label="Nazwisko"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextInputComponent control={control} name="city" label="Miasto" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextInputComponent
            control={control}
            name="zipCode"
            label="Kod Pocztowy"
          />
        </Grid>
        <Grid item xs={12}>
          <TextInputComponent control={control} name="adress" label="Adres" />
        </Grid>
        <Grid item xs={12}>
          <CheckboxInput
            name="saveAddres"
            label="Zapisz adres"
            control={control}
          />
        </Grid>
      </Grid>
    </>
  );
}
