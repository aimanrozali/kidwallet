import { configureStore } from "@reduxjs/toolkit";
import CartReducer from "@/hooks/CardReducer";
import DateReducer from "@/hooks/DateReducer";
import NameReducer from "@/hooks/NameReducer";

export const store = configureStore({
  reducer: {
    cart: CartReducer,
    date: DateReducer,
    name: NameReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch