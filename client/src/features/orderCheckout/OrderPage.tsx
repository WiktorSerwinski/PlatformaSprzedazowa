import {
  Box,
  Button,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import OrderAddress from "./OrderAddress";
import OrderSummary from "./OrderSummary";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { validationSchema } from "./yupValidation";
import apiService from "../../app/api/apiService";
import {
  useAppDispatch,
  useAppSelector,
} from "../../app/redux/configureReduxStore";
import { clearBasket } from "../basket/basketSlice";
import { LoadingButton } from "@mui/lab";
import { fetchCurrentUser } from "../account/accountSlice";

const steps = ["Adres Zamówienia:", "Przegląd zamówienia:", "Gotowe!!!"];

function getStepContent(step: number) {
  switch (step) {
    case 0:
      return <OrderAddress />;
    case 1:
      return <OrderSummary />;
    default:
      throw new Error("Unknown step");
  }
}

export default function OrderPage() {
  const [activeStep, setActiveStep] = useState(0);

  const [orderNumber, setOrderNumber] = useState(0);

  const [loading, setLoading] = useState(false);
  useAppSelector((state) => state.account);

  const dispatch = useAppDispatch();

  const methods = useForm({
    mode: "onTouched",
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    apiService.Account.fetchAddress().then((response) => {
      if (response) {
        methods.reset({
          ...methods.getValues(),
          ...response,
          saveAddres: false,
        });
      }
    });
  }, [methods]);

  const handleNext = async (data: FieldValues) => {
    const { saveAddres, ...orderAddress } = data;
    if (activeStep === steps.length - 2) {
      setLoading(true);
      try {
        const orderNumber = await apiService.Orders.create({
          saveAddres,
          orderAddress,
        });
        setOrderNumber(orderNumber);
        setActiveStep(activeStep + 1);
        dispatch(clearBasket());
        dispatch(fetchCurrentUser());
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <FormProvider {...methods}>
      <Paper
        variant="outlined"
        sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
      >
        <Typography component="h1" variant="h4" align="center">
          Zamówienie
        </Typography>
        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <>
          {activeStep === steps.length - 1 ? (
            <>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ display: "flex", justifyContent: "center" }}
              >
                Dziękujemy Zamówienie Udane:
              </Typography>
              <Typography variant="subtitle1">
                Zrealizowano zamówienie o numerze {orderNumber}. Opłata została
                pomyślnie pobrana z Twojego konta. Dziękujemy za zaufanie i
                życzymy satysfakcji z dokonanych zakupów. Szczegóły dokonanych
                zamówień dostępne w zakładce moje zamówienia w panelu klienta.
              </Typography>
            </>
          ) : (
            <form onSubmit={methods.handleSubmit(handleNext)}>
              {getStepContent(activeStep)}
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                    Cofnij
                  </Button>
                )}
                <LoadingButton
                  loading={loading}
                  disabled={!methods.formState.isValid}
                  variant="contained"
                  type="submit"
                  sx={{ mt: 3, ml: 1 }}
                >
                  {activeStep === steps.length - 2
                    ? "złóż zamówienie"
                    : "Dalej"}
                </LoadingButton>
              </Box>
            </form>
          )}
        </>
      </Paper>
    </FormProvider>
  );
}
