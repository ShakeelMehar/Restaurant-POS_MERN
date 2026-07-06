import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  selectMenuCategories,
  selectTotalDishCount,
} from "../../redux/slices/menuSlice";

const CatalogOverview = () => {
  const navigate = useNavigate();
  const categories = useSelector(selectMenuCategories);
  const totalDishCount = useSelector(selectTotalDishCount);

  return (
    <div className="container mx-auto mt-8 px-6 md:px-4">
      <div className="rounded-2xl bg-card p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Menu Catalog
            </h2>
            <p className="text-sm text-muted-foreground">
              Categories and dishes added here are saved in this browser and
              available immediately on the menu screen.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Categories</p>
              <p className="text-2xl font-bold text-foreground">
                {categories.length}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">Dishes</p>
              <p className="text-2xl font-bold text-foreground">
                {totalDishCount}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => navigate("/catalog?tab=categories")}
                className="rounded-lg bg-background px-4 py-2 text-sm font-semibold text-foreground"
              >
                All Categories
              </button>
              <button
                onClick={() => navigate("/catalog?tab=dishes")}
                className="rounded-lg bg-primary-yellow px-4 py-2 text-sm font-semibold text-white"
              >
                All Dishes
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="rounded-xl border border-border bg-popover p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl text-xl"
                    style={{ backgroundColor: category.bgColor }}
                  >
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {category.items.length} dishes
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {category.items.slice(0, 3).map((dish) => (
                  <div
                    key={dish.id}
                    className="flex items-center justify-between rounded-lg bg-card px-3 py-2 text-sm"
                  >
                    <span className="text-foreground">{dish.name}</span>
                    <span className="font-semibold text-primary-yellow">
                      Rs {dish.price}
                    </span>
                  </div>
                ))}

                {category.items.length === 0 && (
                  <p className="rounded-lg bg-card px-3 py-3 text-sm text-muted-foreground">
                    No dishes yet.
                  </p>
                )}

                {category.items.length > 3 && (
                  <p className="text-xs text-muted-foreground">
                    +{category.items.length - 3} more dishes
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CatalogOverview;
