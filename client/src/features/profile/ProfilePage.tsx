import {
  Avatar,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import {User} from "../../app/models/user"

interface Props{
  user: User,
  address: Address | null
}


export default function ProfilePage({user,address}: Props) {
  
  return (
    <>
      <TableContainer component={Paper} sx={{ marginTop: "20px" }}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center" colSpan={2}>
                <Typography variant="h4">Przegląd profilu</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell align="center">
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    backgroundColor: "#388e3c",
                    marginBottom: "10px",
                    fontSize: "3rem",
                  }}
                >
                  {user?.email.charAt(0).toUpperCase()}
                </Avatar>
              </TableCell>
              <TableCell>
                <Typography variant="h5" sx={{ marginBottom: "10px" }}>
                  Email: {user?.email}
                </Typography>
                {address && (
                  <>
                    <Typography variant="body1">
                      Imię: {address.name}
                    </Typography>
                    <Typography variant="body1">
                      Nazwisko: {address.lastName}
                    </Typography>
                    <Typography variant="body1">
                      Adres: {address.adress}
                    </Typography>
                  </>
                )}
              </TableCell>
              <TableCell>
                {address && (
                  <>
                    <Typography variant="body1">
                      Miasto: {address.city}
                    </Typography>
                    <Typography variant="body1">
                      Kod pocztowy: {address.zipCode}
                    </Typography>
                  </>
                )}
                <Button
                  variant="contained"
                  component={NavLink}
                  to={"/doladowanie-konta"}
                  sx={{ marginTop: "10px", backgroundColor: "#388e3c" }}
                >
                  Doładuj konto
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
