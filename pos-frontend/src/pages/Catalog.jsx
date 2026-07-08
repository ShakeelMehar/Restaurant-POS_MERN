import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import BackButton from "../components/shared/BackButton";
import AddCategoryModal from "../components/dashboard/AddCategoryModal";
import AddDishModal from "../components/dashboard/AddDishModal";
import { selectAllDishes, selectMenuCategories, selectTotalDishCount } from "../redux/slices/menuSlice";
import TabGroup from "../components/shared/TabGroup";
import { FiPlus, FiGrid } from "react-icons/fi";

const Catalog = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const categories = useSelector(selectMenuCategories);
  const allDishes = useSelector(selectAllDishes);
  const totalDishCount = useSelector(selectTotalDishCount);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const activeTab = searchParams.get("tab") === "dishes" ? "dishes" : "categories";

  useEffect(() => { document.title = "POS | Catalog"; }, []);

  const setTab = (tab) => setSearchParams({ tab });

  return (
    <section className="min-h-[calc(100dvh-4rem)] bg-background pb-24">
      {/* Page Header */}
      <div className="flex flex-col gap-2 px-4 py-2 border-b border-border bg-card/50 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <BackButton />
          <div>
            <h1 className="text-lg font-extrabold text-foreground tracking-tight">Menu Catalog</h1>
            <p className="text-xs text-muted-foreground font-medium">
              {categories.length} categories · {totalDishCount} dishes
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <TabGroup
            tabs={[
              { id: "categories", label: `Categories (${categories.length})` },
              { id: "dishes",     label: `Dishes (${totalDishCount})` },
            ]}
            activeTab={activeTab}
            onTabChange={setTab}
          />
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="flex items-center gap-2 rounded-[8px] bg-primary px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 active:scale-95"
            >
              <FiPlus size={15} /> Add Category
            </button>
            <button
              onClick={() => setIsDishModalOpen(true)}
              className="flex items-center gap-2 rounded-[8px] bg-white border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-surface-soft transition-all duration-200"
            >
              <FiGrid size={15} className="text-muted-foreground" /> Add Dish
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {activeTab === "categories" ? (
        <div className="grid grid-cols-1 gap-3 px-4 py-3 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <div key={category.id} className="bg-card rounded-[14px] border border-border transition-all duration-200 hover:shadow-[rgba(0,0,0,0.02)_0_0_0_1px,rgba(0,0,0,0.04)_0_2px_6px,rgba(0,0,0,0.1)_0_4px_8px] p-6 group">
              <div className="flex items-center justify-between gap-2 mb-5">
                <div className="flex items-center gap-2">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-[14px] text-xl text-white shadow-sm"
                    style={{ backgroundColor: category.bgColor || "#374151" }}
                  >
                    {category.icon}
                  </div>
                  <div>
                    <h2 className="text-sm font-extrabold text-foreground">{category.name}</h2>
                    <p className="text-xs text-muted-foreground font-medium mt-0.5">
                      {category.items.length} {category.items.length === 1 ? "dish" : "dishes"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setTab("dishes")}
                  className="flex-shrink-0 rounded-[8px] bg-white hover:bg-surface-soft border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-all"
                >
                  View Dishes
                </button>
              </div>

              <div className="space-y-2">
                {category.items.slice(0, 4).map((dish) => (
                  <div key={dish.id} className="flex items-center justify-between rounded-xl px-3 py-2.5 transition-all group-hover:bg-surface-soft">
                    <div>
                      <p className="text-sm font-bold text-foreground">{dish.name}</p>
                    </div>
                    <p className="text-sm font-medium text-foreground">PKR {dish.price}</p>
                  </div>
                ))}
                {category.items.length === 0 && (
                  <div className="rounded-xl bg-secondary/50 border border-dashed border-border px-3 py-2 text-center">
                    <p className="text-xs font-semibold text-muted-foreground">No dishes yet</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2 px-4 py-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {allDishes.map((dish) => (
            <div key={dish.id} className="bg-card rounded-[14px] border border-border transition-all duration-200 hover:shadow-[rgba(0,0,0,0.02)_0_0_0_1px,rgba(0,0,0,0.04)_0_2px_6px,rgba(0,0,0,0.1)_0_4px_8px] p-6 group">
              <div className="flex items-start justify-between gap-2 mb-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-[15px] font-extrabold text-foreground truncate">{dish.name}</h2>
                  <div className="inline-flex items-center mt-1.5 px-2 py-0.5 rounded-full bg-secondary border border-border">
                    <p className="text-xs font-bold text-muted-foreground">{dish.categoryName}</p>
                  </div>
                </div>
                <div
                  className="flex-shrink-0 flex h-11 w-11 items-center justify-center rounded-xl text-lg text-white shadow-sm"
                  style={{ backgroundColor: dish.bgColor || "#374151" }}
                >
                  {dish.icon}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Type</p>
                  <p className="text-sm font-bold text-foreground mt-0.5">{dish.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Price</p>
                  <p className="text-[15px] font-extrabold text-primary mt-0.5">PKR {dish.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddCategoryModal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} />
      <AddDishModal isOpen={isDishModalOpen} onClose={() => setIsDishModalOpen(false)} />
    </section>
  );
};

export default Catalog;
