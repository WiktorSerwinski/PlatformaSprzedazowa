import { Button, ButtonGroup, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { decrement, increment } from "./counterSlice";

export default function ContactPage(){
    const dispatch = useAppDispatch();
    const {data,title} = useAppSelector(state => state.counter)
    return(
        <>
            <Typography variant="h2">
                {title}
            </Typography>
            <Typography variant="h2">
                {data}
            </Typography>
            <ButtonGroup>
                <Button variant ='contained' onClick={()=>dispatch(decrement(1))}>
                    -
                </Button>
                <Button variant ='contained' onClick={()=>dispatch(increment(1))}>
                    +
                </Button>
                <Button variant ='contained' onClick={()=>dispatch(increment(5))}>
                    +5
                </Button>
            </ButtonGroup>
        </>
    )
}