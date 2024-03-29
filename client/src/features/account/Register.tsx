import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Paper } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import apiService from "../../app/api/apiService";
import { toast } from "react-toastify";

export default function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors, isValid },
  } = useForm({
    mode: "all",
  });

  function handleAPIErrors(errors: any) {
    if (errors) {
      errors.forEach((error: string) => {
        if (error.includes("Password")) {
          setError("password", { message: error });
        } else if (error.includes("Email")) {
          setError("Email", { message: "Istnieje juz konto o podanym Emailu" });
        } else if (error.includes("Username")) {
          setError("username", { message: "Nazwa użytkownika zajęta" });
        }
      });
    }
    console.log(errors);
  }

  return (
    <Container
      component={Paper}
      maxWidth="xs"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 4,
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: "#388e3c" }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Rejestracja
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit((data) =>
          apiService.Account.register(data)
            .then(() => {
              toast.success("Rejestracja Udana");
              navigate("/logowanie");
            })
            .catch((error) => handleAPIErrors(error))
        )}
        noValidate
        sx={{ mt: 1 }}
      >
        <TextField
          margin="normal"
          fullWidth
          label="Nazwa Użytkownika"
          {...register("username", { required: "Podaj nazwe" })}
          error={!!errors.username}
          helperText={errors?.username?.message as string}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Email"
          {...register("Email", {
            required: "Podaj Email",
            pattern: {
              value: /^\w+[\w-\.]*\@\w+((-\w+)|(\w*))\.[a-z]{2,3}$/,
              message: "Niepoprawny format email",
            },
          })}
          error={!!errors.Email}
          helperText={errors?.Email?.message as string}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Hasło"
          type="password"
          {...register("password", {
            required: "Podaj Hasło",
            pattern: {
              value:
                /(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/,
              message: "Hasło nie spełnia wymagań",
            },
          })}
          error={!!errors.password}
          helperText={errors?.password?.message as string}
        />
        <LoadingButton
          disabled={!isValid}
          loading={isSubmitting}
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Zarejestruj się
        </LoadingButton>
        <Grid container>
          <Grid item>
            <Link to="/logowanie">{"Masz juz konto? Zaloguj się"}</Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
