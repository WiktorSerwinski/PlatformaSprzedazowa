import { useState } from "react";
import Catalog from "../../features/catalog/Catalog";
import Header from "./Header";
import { Container, CssBaseline, ThemeProvider, createTheme } from "@mui/material";

function App() {
  const [darkMode,setDarkMode]= useState(false);
  const paletteType= darkMode ? 'dark' : 'light';
  
  const theme= createTheme({
    palette:{
      mode: paletteType,
       background: {
         default: paletteType === 'dark' ?  '#121212' : '#eaeaea' 
       }
    }
  })
  function setMode()
  {
    setDarkMode(!darkMode)
  }
  
   

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <Header setDarkMode={setMode} />
      <Container>
        <Catalog/>  
      </Container>
    </ThemeProvider>
  )
}

export default App
