import { createSlice, nanoid, createSelector } from "@reduxjs/toolkit";
import { getTotalDishCount, loadMenuCatalog } from "../../utils/menuCatalog";

const initialState = {
  categories: loadMenuCatalog(),
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    addCategory: (state, action) => {
      const { name, bgColor, icon } = action.payload;

      state.categories.push({
        id: nanoid(),
        name,
        bgColor,
        icon,
        items: [],
      });
    },

    addDish: (state, action) => {
      const { categoryId, name, price, category } = action.payload;
      const targetCategory = state.categories.find(
        (item) => item.id === categoryId
      );

      if (!targetCategory) {
        return;
      }

      targetCategory.items.push({
        id: nanoid(),
        name,
        price: Number(price),
        category: category || targetCategory.name,
      });
    },
  },
});

export const selectMenuCategories = (state) => state.menu.categories;

// Memoized to prevent unnecessary recalculations and re-renders
export const selectTotalDishCount = createSelector(
  [selectMenuCategories],
  (categories) => getTotalDishCount(categories)
);

// Memoized to prevent returning a new array with new object references on every call,
// which previously caused excessive React component re-renders
export const selectAllDishes = createSelector(
  [selectMenuCategories],
  (categories) =>
    categories.flatMap((category) =>
      category.items.map((dish) => ({
        ...dish,
        categoryId: category.id,
        categoryName: category.name,
        bgColor: category.bgColor,
        icon: category.icon,
      }))
    )
);

export const { addCategory, addDish } = menuSlice.actions;
export default menuSlice.reducer;
