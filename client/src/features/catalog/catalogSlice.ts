import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { Product, ProductParams } from "../../app/models/product";
import apiService from "../../app/api/apiService";
import { RootState } from "../../app/redux/configureReduxStore";
import { MetaData } from "../../app/models/pagination";

interface CatalogState{
    LoadedProducts: boolean,
    LoadedFilters: boolean,
    status: string,
    categories: string[],
    types: string[],
    productParams: ProductParams,
    metaData: MetaData | null

}


const productsAdapter = createEntityAdapter<Product>();

function catalogAxiosParams(productParams: ProductParams){
    
    const params = new URLSearchParams();
    
    params.append('pageNumber',productParams.pageNumber.toString());
    params.append('pageSize',productParams.pageSize.toString());
    params.append('orderBy',productParams.orderBy.toString());
    
    if(productParams.searchTerm)params.append('searchWith',productParams.searchTerm);
    if(productParams.categories.length>0)params.append('categories',productParams.categories.toString());
    if(productParams.types.length>0)params.append('types',productParams.types.toString());

    return params;
}


export const getProductsAsync = createAsyncThunk<Product[],void,{state: RootState}>(
    'catalog/getProductsAsync',
    async (_,thunkAPI) => {
        const params = catalogAxiosParams(thunkAPI.getState().catalog.productParams);
        try {
            const response = await apiService.Catalog.list(params)
            
             thunkAPI.dispatch(setMetaData(response.metadata))
            
            return response.items;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

export const getProductAsync = createAsyncThunk<Product,number>(
    'catalog/getProductAsync',
    async (productId,thunkAPI) => {
        try {
            return await apiService.Catalog.details(productId)
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

export const getProductFilters = createAsyncThunk(
    'catalog/getFilters',
    async (_,thunkAPI)=>{
        try {
            return await apiService.Catalog.filters()
        } catch (error:any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }

)


function initProductParams(){
    return{
        pageNumber:1,
        pageSize: 6,
        orderBy: "name",
        categories: [],
        types: []
    }
}





export const catalogSlice = createSlice({
    name: 'catalog',
    initialState: productsAdapter.getInitialState<CatalogState>({
        LoadedProducts: false,
        LoadedFilters: false,
        categories: [],
        types: [],
        status: 'idle',
        productParams: initProductParams(),
        metaData: null

    }),
    reducers: {
        setProductParams: (state,action)=> {
            state.LoadedProducts=false;
            state.productParams = {...state.productParams, ...action.payload, pageNumber:1};
        },
        
        setMetaData: (state,action) => {
            state.metaData = action.payload;
        },
        
        setPageNumber: (state,action)=> {
            state.LoadedProducts=false;
            state.productParams = {...state.productParams, ...action.payload};
        },
        
        
        
        resetProductParams: (state)=> {
            state.productParams = initProductParams()
        },

        setProduct: (state,action)=>{
            productsAdapter.upsertOne(state,action.payload);
        }
    },
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



export const productSelectors = productsAdapter.getSelectors((state: RootState) => state.catalog);


export const {setProductParams,resetProductParams,setMetaData,setPageNumber, setProduct} = catalogSlice.actions;