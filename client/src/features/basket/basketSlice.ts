import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Basket } from "../../app/models/basket";
import agent from "../../app/api/agent";

interface BasketState{
    basket: Basket | null,
    status: string;
    
}

const initialState: BasketState = {
    basket: null,
    status:'idle'
}


export const addBasketItemAsync = createAsyncThunk<Basket,{productId: number,quantity?: number}>(
    'basket/addBasketItemAsync',
    async({productId,quantity},thunkAPI)=>{
        try {
            return await agent.Basket.addItem(productId,quantity);
            
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

export const deleteBasketItemAsync = createAsyncThunk<void,{productId: number,quantity: number,type?: string}>(
    'basket/deleteBasketItemAsync',
    async({productId,quantity},thunkAPI)=>{
        try {
            await agent.Basket.deleteItem(productId,quantity);
            
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
        // removeItem: (state,action) =>{
        //     const {productId,quantity} = action.payload;
        //     const itemIndex =  state.basket?.items.findIndex(i => i.productId === productId)
        //     if(itemIndex===-1 || itemIndex === undefined) return;
        //     state.basket!.items[itemIndex].quantity-=quantity;
        //     if (state.basket?.items[itemIndex].quantity === 0) state.basket.items.splice(itemIndex,1);          
        // }
            
    },
    extraReducers: (builder => {
        builder.addCase(addBasketItemAsync.pending,(state,action)=>{
            state.status = 'pendindAddItem' + action.meta.arg.productId
            
        }),
        builder.addCase(addBasketItemAsync.fulfilled,(state,action)=>{
            state.basket = action.payload;
            state.status = 'idle'
        }),
        builder.addCase(addBasketItemAsync.rejected,(state,action)=>{
            state.status = 'idle'
            console.log(action.payload);

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
        })
    })    
    
})


export const {setBasket} = basketSlice.actions;