import { createSlice } from "@reduxjs/toolkit";


export interface DateItem {
  orderDate: Date,
}

export interface initialState {
  date: DateItem | null;
}

export const dateSlice = createSlice({
  name: "date",
  initialState: {
    date: {} as initialState["date"],
  },
  reducers: {
    setDates: (state, action) => {
      state.date = action.payload;
    },
  }
});

export const { setDates } = dateSlice.actions;
export default dateSlice.reducer;