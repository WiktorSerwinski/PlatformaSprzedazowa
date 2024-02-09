import { useState } from "react";
import { Paper, Typography, TextField, Button, Box } from "@mui/material";
import apiService from "../../app/api/apiService";
import { useAppDispatch } from "../../app/redux/configureStore";
import { fetchCurrentUser } from "../account/accountSlice";
import { toast } from "react-toastify";

export default function AccountRecharge() {
  const [RechargeCode, setTopUpCode] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const dispatch = useAppDispatch();

  const handleRechargeAccount = async (code: string) => {
    try {
      const response = await apiService.Recharge.use(code);
      if (response.success) {
        setResponseMessage(`Success: ${response.message}.`);
        dispatch(fetchCurrentUser());
        console.log(responseMessage);
        toast.success("Udało ci się Doładować konto");
      } else {
        setResponseMessage(`Error: ${response.message}`);
        console.log(responseMessage);
      }
    } catch (error) {
      console.error("Error while processing the request:", error);
      setResponseMessage("Error while processing the request.");
    }
  };

  const handleButtonClick = () => {
    handleRechargeAccount(RechargeCode);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        padding: "20px",
        maxWidth: "400px",
        margin: "auto",
        marginTop: "20px",
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Doładuj konto
      </Typography>
      <TextField
        label="Podaj kod 6-znakowy doładowania"
        variant="outlined"
        fullWidth
        value={RechargeCode}
        onChange={(e) => setTopUpCode(e.target.value)}
        sx={{ marginTop: "20px" }}
      />
      <Box sx={{ marginTop: "20px", textAlign: "center" }}>
        <Button
          variant="contained"
          onClick={handleButtonClick}
          sx={{ backgroundColor: "#388e3c" }}
          disabled={RechargeCode.length != 6}
        >
          Doładuj konto
        </Button>
      </Box>
    </Paper>
  );
}
