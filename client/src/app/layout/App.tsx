import { useState } from "react";
import Header from "./Header";
import { Container, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { Outlet } from "react-router-dom";



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
      <Header darkMode={darkMode} setDarkMode={setMode} />
      <Container>
        <Outlet></Outlet>
      </Container>
    </ThemeProvider>
  )
}

export default App
