import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const cartSlice = createSlice({
    name : "cart",
    initialState,
    reducers : {
        addItems : (state, action) => {
            const existingItem = state.find((item) =>
                item.name === action.payload.name &&
                Number(item.pricePerQuantity) === Number(action.payload.pricePerQuantity)
            );

            if (existingItem) {
                existingItem.quantity += action.payload.quantity;
                existingItem.price += action.payload.price;
                return;
            }

            state.push(action.payload);
        },

        removeItem: (state, action) => {
            return state.filter(item => item.id != action.payload);
        },

        setCart: (state, action) => {
            return action.payload;
        },

        removeAllItems: (state) => {
            return [];
        }
    }
})

export const getTotalPrice = (state) => state.cart.reduce((total, item) => total + item.price, 0);
export const { addItems, removeItem, removeAllItems, setCart } = cartSlice.actions;
export default cartSlice.reducer;
