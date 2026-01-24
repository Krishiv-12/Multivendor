import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Get Wishlist
export const fetchWishlist = createAsyncThunk("wishlist/fetch", async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get("http://localhost:5000/api/wishlist", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
});

// Add to Wishlist
export const addToWishlist = createAsyncThunk("wishlist/add", async (productId) => {
  const token = localStorage.getItem("token");
  const res = await axios.post(
    "http://localhost:5000/api/wishlist/add",
    { productId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data.wishlistItem;
});

// Remove from Wishlist
export const removeFromWishlist = createAsyncThunk("wishlist/remove", async (wishlistId) => {
  const token = localStorage.getItem("token");
  await axios.delete(`http://localhost:5000/api/wishlist/remove/${wishlistId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return wishlistId;
});

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { items: [], status: "idle" },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      });
  },
});

export default wishlistSlice.reducer;
