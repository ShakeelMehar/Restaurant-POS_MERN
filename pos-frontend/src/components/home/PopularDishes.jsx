import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAllDishes } from "../../redux/slices/menuSlice";

const PopularDishes = () => {
  const navigate = useNavigate();
  const dishes = useSelector(selectAllDishes);
  const popularDishes = useMemo(() => dishes.slice(0, 8), [dishes]);

  return (
    <div className="mt-6 pr-6">
      <div className="bg-card w-full rounded-lg">
        <div className="flex justify-between items-center px-6 py-4">
          <h1 className="text-foreground text-lg font-semibold tracking-wide">
            Popular Dishes
          </h1>
          <button
            onClick={() => navigate("/catalog?tab=dishes")}
            className="text-blue-600 text-sm font-semibold"
          >
            View all
          </button>
        </div>

        <div className="overflow-y-scroll h-[680px] scrollbar-hide">
          {popularDishes.length > 0 ? (
            popularDishes.map((dish, index) => {
              return (
                <div
                  key={dish.id}
                  className="mx-6 mt-4 flex items-center gap-4 rounded-[15px] bg-background px-6 py-4"
                >
                  <h1 className="mr-4 text-xl font-bold text-foreground">
                    {index + 1 < 10 ? `0${index + 1}` : index + 1}
                  </h1>
                  <div
                    className="flex h-[50px] w-[50px] items-center justify-center rounded-full text-xl text-white"
                    style={{ backgroundColor: dish.bgColor }}
                  >
                    {dish.icon}
                  </div>
                  <div>
                    <h1 className="font-semibold tracking-wide text-foreground">
                      {dish.name}
                    </h1>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      <span className="text-muted-foreground">Category: </span>
                      {dish.categoryName}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="mx-6 mt-4 rounded-[15px] bg-background px-6 py-8 text-center text-sm text-muted-foreground">
              No dishes available yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PopularDishes;
