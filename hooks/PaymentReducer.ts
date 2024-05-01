import { createSlice } from "@reduxjs/toolkit";


export interface WalletItem {
  WalletID: string,
  Email: string,
  Amount: number,
}

export interface initialState {
  WalletState: WalletItem | null;
}

export const nameSlice = createSlice({
  name: "WalletID",
  initialState: {
    wallet: {} as initialState["WalletState"],
  },
  reducers: {
    setWallet: (state, action) => {
      state.wallet!.WalletID = action.payload;
    },
    setEmail: (state, action) => {
      state.wallet!.Email = action.payload;
    },
    setPayAmount: (state, action) => {
      state.wallet!.Amount = action.payload;
    },
  }
});

export const { setWallet, setEmail, setPayAmount } = nameSlice.actions;
export default nameSlice.reducer;