import { TextField, debounce } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { setProductParams } from "./catalogSlice";
import { useState } from "react";

export default function SearchComponent() {
    const {productParams} = useAppSelector(state => state.catalog)

    const [searchTerm,setSearchTerm] = useState(productParams.searchTerm)
    
    const dispatch = useAppDispatch();

    const debouncedSearch = debounce((event: any)=>{
        dispatch(setProductParams({searchTerm: event.target.value}))
    },2000)

    



    return (
        <TextField
            fullWidth
            label='Znajdz produkt'
            value = {searchTerm || ''}
            onChange={(event: any) =>{
                setSearchTerm(event?.target.value);
                debouncedSearch(event);}
            }              
        />
    )
}