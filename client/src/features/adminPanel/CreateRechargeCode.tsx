import { useState } from "react";
import { Paper, Typography, TextField, Button, Box } from "@mui/material";
import apiService from "../../app/api/apiService";
import { toast } from "react-toastify";
import { showprice } from "../../app/utils/util";

export default function CreateRechargeCode() {
  const [RechargeCode, setRechargeCode] = useState("");
  const [RechargeAmount, setRechargeAmount] = useState<number | string>(10000);

  const handleCreateRechargeCode = async () => {
    try {
      const amountAsNumber =  Number(RechargeAmount);
      
      await apiService.Admin.createPrepCode(
        amountAsNumber,
        RechargeCode
      );
      toast.success(`Udało się utworzyć kod doładowania na kwote ${showprice(amountAsNumber)}`);
      } 
    catch (error) {
      toast.error(`Błąd podczas tworzenia kodu. Podany kod juz istnieje.`);
    }
  };

  const handleButtonClick = () => {
    handleCreateRechargeCode();
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
        Utwórz kod doładowania
      </Typography>
      <TextField
        label="Podaj 6-znakowy kod doładowania"
        variant="outlined"
        fullWidth
        value={RechargeCode}
        onChange={(e) => setRechargeCode(e.target.value)}
        sx={{ marginTop: "20px" }}
      />
      <TextField
        label="Podaj kwotę doładowania"
        variant="outlined"
        fullWidth
        type="number"
        inputProps={{ min: 10000, step: 100 }}
        value={RechargeAmount}
        onChange={(e) => setRechargeAmount(e.target.value)}
        sx={{ marginTop: "20px" }}
      />
      <Box sx={{ marginTop: "20px", textAlign: "center" }}>
        <Button
          variant="contained"
          onClick={handleButtonClick}
          sx={{ backgroundColor: "#388e3c" }}
          disabled={RechargeCode.length !== 6 || RechargeAmount === ""}
        >
          Utwórz kod doładowania
        </Button>
      </Box>
    </Paper>
  );
}
