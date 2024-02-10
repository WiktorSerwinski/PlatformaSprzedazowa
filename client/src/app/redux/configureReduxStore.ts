import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { basketSlice } from "../../features/basket/basketSlice";
import { catalogSlice } from "../../features/catalog/catalogSlice";
import { accountSlice } from "../../features/account/accountSlice";



export const reduxStore = configureStore({
    reducer: {
        basket: basketSlice.reducer,
        catalog: catalogSlice.reducer,
        account: accountSlice.reducer
    }
})

export type RootState = ReturnType<typeof reduxStore.getState>;
export type Dispatch = typeof reduxStore.dispatch;

export const useAppDispatch = () => useDispatch<Dispatch>();

export const useAppSelector: TypedUseSelectorHook<RootState>=useSelector;