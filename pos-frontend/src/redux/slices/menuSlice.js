import { createSlice, nanoid, createSelector } from "@reduxjs/toolkit";
import { getTotalDishCount, loadMenuCatalog } from "../../utils/menuCatalog";

const initialState = {
  categories: [],
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
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
      const { categoryId, name, price, category, hasPortions, portions } = action.payload;
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
        hasPortions: Boolean(hasPortions),
        portions: portions || { quarter: 0, half: 0, large: 0 },
      });
    },

    updateDish: (state, action) => {
      const { id, categoryId, name, price, category, hasPortions, portions } = action.payload;
      let dishObj = null;
      state.categories.forEach((cat) => {
        const index = cat.items.findIndex((item) => item.id === id);
        if (index !== -1) {
          [dishObj] = cat.items.splice(index, 1);
        }
      });

      if (!dishObj) {
        dishObj = { id };
      }

      dishObj.name = name;
      dishObj.price = Number(price);
      dishObj.category = category || state.categories.find(c => c.id === categoryId)?.name || dishObj.category;
      dishObj.hasPortions = Boolean(hasPortions);
      dishObj.portions = portions || { quarter: 0, half: 0, large: 0 };

      const targetCategory = state.categories.find((c) => c.id === categoryId);
      if (targetCategory) {
        targetCategory.items.push(dishObj);
      }
    },

    deleteDish: (state, action) => {
      const dishId = action.payload;
      state.categories.forEach((cat) => {
        cat.items = cat.items.filter((item) => item.id !== dishId);
      });
    },
  },
});

export const selectMenuCategories = (state) => state.menu.categories;
export const selectTotalDishCount = (state) =>
  getTotalDishCount(state.menu.categories);
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

export const { setCategories, addCategory, addDish, updateDish, deleteDish } = menuSlice.actions;
export default menuSlice.reducer;
