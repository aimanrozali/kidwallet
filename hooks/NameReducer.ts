import { createSlice } from "@reduxjs/toolkit";


export interface NameItem {
  orderName: string,
}

export interface initialState {
  name: NameItem | null;
}

export const nameSlice = createSlice({
  name: "name",
  initialState: {
    name: {} as initialState["name"],
  },
  reducers: {
    setName: (state, action) => {
      state.name = action.payload;
    },
  }
});

export const { setName } = nameSlice.actions;
export default nameSlice.reducer;