import { Button, Container, Divider, Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function NotFound()
{
    return(
        <Container component={Paper} sx={{height:200}}>
            <Typography gutterBottom variant='h3'> 404 NOT FOUND</Typography>
            <Divider/>
            <Button fullWidth component={Link} to='/catalog'> Go back to shop</Button>
        </Container>

    )
}