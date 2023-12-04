import { useEffect, useState } from "react";
import Header from "./Header";
import {
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import agent from "../api/agent";
import Loading from "./Loading";
import { getCookie } from "../utils/util";
import { useAppDispatch } from "../store/configureStore";
import { setBasket } from "../../features/basket/basketSlice";


function App() {
  // const {setBasket} = useStoreContext();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  
  
  useEffect(() => {
    const buyerId=getCookie("buyerId")
    if(buyerId){
      agent.Basket.get()
        .then(basket => dispatch(setBasket(basket)))
        .catch(error => console.log(error))
        .finally(() => setLoading(false));}
    else setLoading(false)
    }, [dispatch]);



  const [darkMode, setDarkMode] = useState(false);
  const paletteType = darkMode ? "dark" : "light";

  const theme = createTheme({
    palette: {
      mode: paletteType,
      background: {
        default: paletteType === "dark" ? "#121212" : "#cddc39",
      },
    },
  });

  function setMode() {
    setDarkMode(!darkMode);
  }

  if(loading) return <Loading message='Ładowanie Sklepu ...'></Loading>
  
  return (
    <ThemeProvider theme={theme}>
      <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
      <CssBaseline />
      <Header darkMode={darkMode} setDarkMode={setMode} />
      <Container>
        <Outlet></Outlet>
      </Container>
    </ThemeProvider>
  );
}

export default App;
