import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import mongoose from "mongoose";

interface IGrocery {
  _id?: mongoose.Types.ObjectId;
  name: string;
  category: string;
  price: string;
  unit: string;
  quantity: number;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ICartSlice {
  cartData: IGrocery[];
  subTotal: number;
  deliveryFee: number;
  total: number;
}

const loadCartFromStorage = (): IGrocery[] => {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem("grocio_cart");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveCartToStorage = (cartData: IGrocery[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("grocio_cart", JSON.stringify(cartData));
  } catch {}
};

const calculateTotalsHelper = (cartData: IGrocery[]) => {
  const subTotal = cartData.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0,
  );
  const deliveryFee = subTotal > 500 ? 0 : 40;
  return { subTotal, deliveryFee, total: subTotal + deliveryFee };
};

const savedCart = loadCartFromStorage();
const savedTotals = calculateTotalsHelper(savedCart);

const initialState: ICartSlice = {
  cartData: savedCart,
  subTotal: savedTotals.subTotal,
  deliveryFee: savedTotals.deliveryFee,
  total: savedTotals.total,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<IGrocery>) => {
      state.cartData.push(action.payload);
      cartSlice.caseReducers.calculateTotals(state);
      saveCartToStorage(state.cartData);
    },
    increaseQuantity: (
      state,
      action: PayloadAction<mongoose.Types.ObjectId>,
    ) => {
      const item = state.cartData.find((i) => i._id == action.payload);
      if (item) {
        item.quantity = item.quantity + 1;
      }
      cartSlice.caseReducers.calculateTotals(state);
      saveCartToStorage(state.cartData);
    },
    decreaseQuantity: (
      state,
      action: PayloadAction<mongoose.Types.ObjectId>,
    ) => {
      const item = state.cartData.find((i) => i._id == action.payload);
      if (item?.quantity && item.quantity > 1) {
        item.quantity = item.quantity - 1;
      } else {
        state.cartData = state.cartData.filter((i) => i._id !== action.payload);
      }
      cartSlice.caseReducers.calculateTotals(state);
      saveCartToStorage(state.cartData);
    },
    removeFromCart: (state, action: PayloadAction<mongoose.Types.ObjectId>) => {
      state.cartData = state.cartData.filter((i) => i._id !== action.payload);
      cartSlice.caseReducers.calculateTotals(state);
      saveCartToStorage(state.cartData);
    },
    clearCart: (state) => {
      state.cartData = [];
      state.subTotal = 0;
      state.deliveryFee = 40;
      state.total = 40;
      saveCartToStorage([]);
    },
    calculateTotals: (state) => {
      const { subTotal, deliveryFee, total } = calculateTotalsHelper(
        state.cartData,
      );
      state.subTotal = subTotal;
      state.deliveryFee = deliveryFee;
      state.total = total;
    },
  },
});

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
