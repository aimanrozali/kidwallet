import { configureStore } from "@reduxjs/toolkit";
import CartReducer from "@/hooks/CardReducer";
import DateReducer from "@/hooks/DateReducer";
import NameReducer from "@/hooks/NameReducer";
import PaymentReducer from "@/hooks/PaymentReducer";

export const store = configureStore({
  reducer: {
    cart: CartReducer,
    date: DateReducer,
    name: NameReducer,
    wallet: PaymentReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch