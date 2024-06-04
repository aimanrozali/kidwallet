import { createSelector, createSlice } from "@reduxjs/toolkit";


export interface CartItem {
  mealID: number,
  mealName: string,
  price: number,
  quantity: number,
  vendorID: number,
}

export interface RootState {
  cart: {
    [studentID: string]: CartItem[]
  }
}

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: {} as RootState["cart"],
  },
  reducers: {
    addToCart: (state, action) => {
      const { payload } = action;
      const { studentID } = payload;
      const studentCart = state.cart[studentID] || [];
      const itemInCart = studentCart.find((item) => item.mealID == action.payload.mealID);
      if (itemInCart) {
        itemInCart.quantity++;
      } else {
        studentCart.push({ ...action.payload, quantity: 1 });
      }
      state.cart[studentID] = studentCart; // Update the state with new array
    },
    removeFromCart: (state: RootState, action) => {
      const { payload } = action;
      const { studentID } = payload;
      state.cart[studentID] = (state.cart[studentID] || []).filter((item) => item.mealID !== payload.mealID);
    },
    incrementQuantity: (state, action) => {
      const { payload } = action;
      const { studentID } = payload;
      const itemInCart = (state.cart[studentID] || []).find((item) => item.mealID == action.payload.mealID);
      itemInCart ? itemInCart.quantity++ : null;
    },
    decrementQuantity: (state, action) => {
      const { payload } = action;
      const { studentID } = payload;
      const studentCart = state.cart[studentID] || [];
      const itemInCart = studentCart.find((item) => item.mealID == action.payload.mealID);
      if (itemInCart) {
        if (itemInCart.quantity == 1) {
          state.cart[studentID] = studentCart.filter((item) => item.mealID !== action.payload.mealID);
          // state.cart = removeFromCart;
        } else {
          itemInCart.quantity--;
        }
      }
    },
    clearCart: (state, action) => {
      const { studentID } = action.payload;
      state.cart[studentID] = [];
    },
  }
});

export const selectQuantityById = (mealID: number, studentID: string) => createSelector(
  (state: RootState) => state.cart[studentID],
  (cart: CartItem[] | undefined) => {
    if (!cart) {
      return 0;
    }
    const item = cart.find((item: CartItem) => item.mealID === mealID);
    return item ? item.quantity : 0;
  }
);

export const selectTotalItems = (studentID: string) => createSelector(
  (state: RootState) => state.cart[studentID],
  (cart: CartItem[] | undefined) => {
    if (!cart) {
      return 0;
    }
    return cart.reduce((total, item) => total + item.quantity, 0);
  }
);

export const selectTotalPrice = (studentID: string) => createSelector(
  (state: RootState) => state.cart[studentID],
  (cart: CartItem[] | undefined) => {
    if (!cart) {
      return 0;
    }
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
);



export const { addToCart, removeFromCart, incrementQuantity, decrementQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;