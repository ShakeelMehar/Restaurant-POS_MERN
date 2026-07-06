import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItems } from "../../redux/slices/cartSlice";
import { selectMenuCategories } from "../../redux/slices/menuSlice";
import CascadingMenu from "./CascadingMenu";

const MenuContainer = () => {
  const categories = useSelector(selectMenuCategories);
  const dispatch = useDispatch();

  const handleAddToCart = (cartItem) => {
    dispatch(addItems(cartItem));
  };

  if (categories.length === 0) {
    return (
      <div className="px-6 py-10">
        <div className="rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
          <span className="text-5xl mb-4 block">🍽️</span>
          <h2 className="text-xl font-bold text-foreground mb-1">No categories yet</h2>
          <p className="text-sm text-muted-foreground">Add categories from the Catalog to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden">
      <CascadingMenu 
        categories={categories} 
        onAdd={handleAddToCart} 
      />
    </div>
  );
};

export default MenuContainer;
