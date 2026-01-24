import { configureStore } from "@reduxjs/toolkit";
import wishlistReducer from "./slices/wishlistSlice";

export const store = configureStore({
  reducer: {
    wishlist: wishlistReducer,
  },
});
