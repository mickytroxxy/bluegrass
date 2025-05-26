import { createSlice } from "@reduxjs/toolkit";

export type Product = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strTags?: string;
  price?: number;
}

export type CartItem = {
  product: Product;
  quantity: number;
}

const initialState = {
  cart: [],
  selectedCategory: 'Beef',
  products: [],
  loading: false,
  currentPage: 1,
  hasMoreProducts: true,
};

const productsSlice = createSlice({
  name: "productsSlice",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    addProducts: (state, action) => {
      state.products = [...state.products, ...action.payload];
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    addToCart: (state, action) => {
      const existingItem = state.cart.find(item => item.product.idMeal === action.payload.idMeal);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cart.push({ product: action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(item => item.product.idMeal !== action.payload);
    },
    updateCartQuantity: (state, action) => {
      const item = state.cart.find(item => item.product.idMeal === action.payload.id);
      if (item) {
        if (action.payload.quantity <= 0) {
          state.cart = state.cart.filter(item => item.product.idMeal !== action.payload.id);
        } else {
          item.quantity = action.payload.quantity;
        }
      }
    },
    clearCart: (state) => {
      state.cart = [];
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
      state.currentPage = 1;
      state.hasMoreProducts = true;
      state.products = [];
    },
    incrementPage: (state) => {
      state.currentPage += 1;
    },
    setHasMoreProducts: (state, action) => {
      state.hasMoreProducts = action.payload;
    },
  },
});

export const {
  setProducts,
  addProducts,
  setLoading,
  addToCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
  setSelectedCategory,
  incrementPage,
  setHasMoreProducts
} = productsSlice.actions;

export default productsSlice.reducer;
