import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Typography,
} from "@mui/material";
import { Product } from "../../app/models/product";
import { Link } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import {
  useAppDispatch,
  useAppSelector,
} from "../../app/redux/configureReduxStore";
import { addBasketItemAsync } from "../basket/basketSlice";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  // const[loading,setLoading]=useState(false)
  const { status } = useAppSelector((state) => state.basket);
  const dispatch = useAppDispatch();

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ backgroundColor: "#388e3c" }}>
            {product.name.charAt(0).toUpperCase()}
          </Avatar>
        }
        title={product.name}
        titleTypographyProps={{
          sx: { fontWeight: "bold", color: "#388e3c" },
        }}
      />
      <CardMedia
        sx={{
          height: 140,
          backgroundSize: "contain",
          backgroundColor: "#8bc34a",
        }}
        image={product.pictureUrl}
        title={product.name}
      />
      <CardContent>
        <Typography gutterBottom color="#388e3c" variant="h5">
          {(product.price / 100).toFixed(2)}®
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.category} - {product.type}
        </Typography>
      </CardContent>
      <CardActions>
        <LoadingButton
          color="primary"
          loading={status === "pendindAddItem" + product.id}
          size="small"
          onClick={() =>
            dispatch(addBasketItemAsync({ productId: product.id }))
          }
        >
          Do koszyka
        </LoadingButton>

        <Button component={Link} to={`/katalog/${product.id}`} size="small">
          Szczegóły
        </Button>
      </CardActions>
    </Card>

    // <ListItem key={product.id}>
    //     <ListItemAvatar>
    //       <Avatar src={product.pictureUrl}/>
    //     </ListItemAvatar>
    //     <ListItemText>{product.name} - {product.price} - {product.brand}</ListItemText>
    // </ListItem>
  );
}
