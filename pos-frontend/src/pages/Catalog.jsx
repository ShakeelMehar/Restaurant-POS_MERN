import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import BackButton from "../components/shared/BackButton";

import AddCategoryModal from "../components/dashboard/AddCategoryModal";
import AddDishModal from "../components/dashboard/AddDishModal";
import {
  selectAllDishes,
  selectMenuCategories,
  selectTotalDishCount,
} from "../redux/slices/menuSlice";
import TabGroup from "../components/shared/TabGroup";

const Catalog = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const categories = useSelector(selectMenuCategories);
  const allDishes = useSelector(selectAllDishes);
  const totalDishCount = useSelector(selectTotalDishCount);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isDishModalOpen, setIsDishModalOpen] = useState(false);

  const activeTab = searchParams.get("tab") === "dishes" ? "dishes" : "categories";

  useEffect(() => {
    document.title = "POS | Catalog";
  }, []);

  const categoryCards = useMemo(() => categories, [categories]);
  const dishCards = useMemo(() => allDishes, [allDishes]);

  const setTab = (tab) => {
    setSearchParams({ tab });
  };

  return (
    <section className="min-h-[calc(100vh-5rem)] bg-background pb-24">
      <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <div className="flex items-center gap-4">
          <BackButton />
          <div>
            <h1 className="text-2xl font-bold tracking-wider text-foreground">
              Menu Catalog
            </h1>
            <p className="text-sm text-muted-foreground">
              Browse all categories and dishes in one place.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <TabGroup
            tabs={[
              { id: "categories", label: `Categories (${categories.length})` },
              { id: "dishes", label: `Dishes (${totalDishCount})` }
            ]}
            activeTab={activeTab}
            onTabChange={setTab}
          />
          
          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-primary/90 hover:shadow-lg shadow-primary/40 sm:text-base"
            >
              Add Category
            </button>
            <button
              onClick={() => setIsDishModalOpen(true)}
              className="rounded-lg bg-popover border border-border px-6 py-2.5 text-sm font-bold text-foreground transition-all hover:bg-card hover:shadow-lg sm:text-base"
            >
              Add Dish
            </button>
          </div>
        </div>
      </div>

      {activeTab === "categories" ? (
        <div className="grid grid-cols-1 gap-4 px-4 py-4 sm:px-6 lg:grid-cols-2 lg:px-10 xl:grid-cols-3">
          {categoryCards.map((category) => (
            <div
              key={category.id}
              className="rounded-2xl border border-border bg-popover p-5"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl text-white"
                    style={{ backgroundColor: category.bgColor }}
                  >
                    {category.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">
                      {category.name}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {category.items.length} dishes
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setTab("dishes")}
                  className="rounded-lg bg-card px-3 py-2 text-xs font-semibold text-foreground"
                >
                  View Dishes
                </button>
              </div>

              <div className="mt-5 space-y-2">
                {category.items.slice(0, 4).map((dish) => (
                  <div
                    key={dish.id}
                    className="flex items-center justify-between rounded-xl bg-card px-4 py-3"
                  >
                    <div>
                      <p className="font-medium text-foreground">{dish.name}</p>
                      <p className="text-xs text-muted-foreground">{dish.category}</p>
                    </div>
                    <p className="font-semibold text-primary-yellow">PKR {dish.price}</p>
                  </div>
                ))}

                {category.items.length === 0 && (
                  <div className="rounded-xl bg-card px-4 py-6 text-center text-sm text-muted-foreground">
                    No dishes in this category yet.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 px-4 py-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-10 xl:grid-cols-4">
          {dishCards.map((dish) => (
            <div
              key={dish.id}
              className="rounded-2xl border border-border bg-popover p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    {dish.name}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {dish.categoryName}
                  </p>
                </div>
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl text-xl text-white"
                  style={{ backgroundColor: dish.bgColor }}
                >
                  {dish.icon}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Type
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {dish.category}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Price
                  </p>
                  <p className="text-lg font-semibold text-primary-yellow">
                    PKR {dish.price}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      />
      <AddDishModal
        isOpen={isDishModalOpen}
        onClose={() => setIsDishModalOpen(false)}
      />


    </section>
  );
};

export default Catalog;
