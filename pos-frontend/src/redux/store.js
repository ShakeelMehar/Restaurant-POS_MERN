import { configureStore } from "@reduxjs/toolkit";
import customerSlice from "./slices/customerSlice"
import cartSlice from "./slices/cartSlice";
import userSlice from "./slices/userSlice";
import menuSlice from "./slices/menuSlice";
import { saveMenuCatalog } from "../utils/menuCatalog";

const store = configureStore({
    reducer: {
        customer: customerSlice,
        cart : cartSlice,
        user : userSlice,
        menu: menuSlice
    },

    devTools: import.meta.env.NODE_ENV !== "production",
});

let previousCatalog = store.getState().menu.categories;

store.subscribe(() => {
    const currentCatalog = store.getState().menu.categories;
    if (currentCatalog !== previousCatalog) {
        saveMenuCatalog(currentCatalog);
        previousCatalog = currentCatalog;
    }
});

export default store;
