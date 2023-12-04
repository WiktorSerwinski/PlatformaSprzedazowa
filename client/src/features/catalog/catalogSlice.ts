import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { Product } from "../../app/models/product";
import agent from "../../app/api/agent";
import { RootState } from "../../app/store/configureStore";

const productsAdapter = createEntityAdapter<Product>();

export const getProductsAsync = createAsyncThunk<Product[]>(
    'catalog/getProductsAsync',
    async (_,thunkAPI) => {
        try {
            return await agent.Catalog.list()
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

export const getProductAsync = createAsyncThunk<Product,number>(
    'catalog/getProductAsync',
    async (productId,thunkAPI) => {
        try {
            return await agent.Catalog.details(productId)
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

export const getProductFilters = createAsyncThunk(
    'catalog/getFilters',
    async (_,thunkAPI)=>{
        try {
            return await agent.Catalog.filters()
        } catch (error:any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }

)





export const catalogSlice = createSlice({
    name: 'catalog',
    initialState: productsAdapter.getInitialState({
        LoadedProducts: false,
        LoadedFilters: false,
        categories: [],
        types: [],
        status: 'idle',

    }),
    reducers: {},
    extraReducers: (builder => {
        
        
        builder.addCase(getProductsAsync.pending, (state) =>{
            state.status = 'pendingFetchProducts';
        }),
        builder.addCase(getProductsAsync.fulfilled, (state,action) =>{
            productsAdapter.setAll(state,action.payload);
            state.status = 'idle';
            state.LoadedProducts=true;
        }),
        builder.addCase(getProductsAsync.rejected, (state,action) =>{
            state.status = 'idle';
            console.log(action.payload)
        }),




        
        builder.addCase(getProductAsync.pending, (state) =>{
            state.status = 'pendingFetchProduct';
        }),

        builder.addCase(getProductAsync.fulfilled, (state,action) =>{
            productsAdapter.upsertOne(state,action.payload);
            state.status = 'idle';
        }),

        builder.addCase(getProductAsync.rejected, (state) =>{
            state.status = 'idle';
        }),



        builder.addCase(getProductFilters.pending,(state)=>{
            state.status = 'pendingAddFilters'
        }),
        builder.addCase(getProductFilters.fulfilled,(state,action)=>{
            state.categories = action.payload.categories;
            state.types = action.payload.types;
            state.LoadedFilters=true;
            state.status='idle';
        }),
        builder.addCase(getProductFilters.rejected,(state,action)=>{
            state.status = 'idle';
            console.log(action.payload);
        })




    })
})



export const productSelectors = productsAdapter.getSelectors((state: RootState) => state.catalog)