import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { Basket } from "../../app/models/basket";
import apiService from "../../app/api/apiService";
import { getCookie } from "../../app/utils/util";

interface BasketState{
    basket: Basket | null,
    status: string;
    
}

const initialState: BasketState = {
    basket: null,
    status:'idle'
}

export const fetchBasketAsync = createAsyncThunk<Basket>(
    'basket/fetchBasketItemAsync',
    async(_,thunkAPI) =>
    {
        try {
            return await apiService.Basket.get();
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    },
    {
        condition: () => {
            if(!getCookie('buyerId')) return false;
        }
    }

)


export const addBasketItemAsync = createAsyncThunk<Basket,{productId: number,quantity?: number}>(
    'basket/addBasketItemAsync',
    async({productId,quantity},thunkAPI)=>{
        try {
            return await apiService.Basket.addItem(productId,quantity);
            
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

export const deleteBasketItemAsync = createAsyncThunk<void,{productId: number,quantity: number,type?: string}>(
    'basket/deleteBasketItemAsync',
    async({productId,quantity},thunkAPI)=>{
        try {
            await apiService.Basket.deleteItem(productId,quantity);
            
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)



export const basketSlice = createSlice({
    name: 'basket',
    initialState,
    reducers: {
        setBasket: (state,action) => {
            state.basket= action.payload
        },
        clearBasket: (state) => {
            state.basket = null;
        }
            
    },
    extraReducers: (builder => {
        builder.addCase(addBasketItemAsync.pending,(state,action)=>{
            state.status = 'pendindAddItem' + action.meta.arg.productId
            
        }),
        builder.addCase(deleteBasketItemAsync.pending,(state,action)=>{
            if(action.meta.arg.quantity==1)
            state.status = 'pendingDeleteItem' + action.meta.arg.productId + action.meta.arg.type

        }),
        builder.addCase(deleteBasketItemAsync.fulfilled, (state,action)=>{
            const productId = action.meta.arg.productId;
            const quantity = action.meta.arg.quantity;
            const itemIndex =  state.basket?.items.findIndex(i => i.productId === productId)
            if(itemIndex===-1 || itemIndex === undefined) return;
            state.basket!.items[itemIndex].quantity-=quantity;
            if (state.basket?.items[itemIndex].quantity === 0) state.basket.items.splice(itemIndex,1);
            state.status = 'idle';         
        }),
        builder.addCase(deleteBasketItemAsync.rejected,(state,action)=>{
            state.status = 'idle'
            console.log(action.payload);
        }),
        builder.addMatcher(isAnyOf(addBasketItemAsync.fulfilled,fetchBasketAsync.fulfilled),(state,action)=>{
            state.basket = action.payload;
            state.status = 'idle'
        }),
        builder.addMatcher(isAnyOf(addBasketItemAsync.rejected,fetchBasketAsync.rejected),(state,action)=>{
            state.status = 'idle'
            console.log(action.payload);

        })
    })    
    
})


export const {setBasket,clearBasket} = basketSlice.actions;