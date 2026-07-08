import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAllDishes } from "../../redux/slices/menuSlice";
import { FiExternalLink } from "react-icons/fi";

const PopularDishes = () => {
  const navigate = useNavigate();
  const dishes = useSelector(selectAllDishes);
  const popularDishes = useMemo(() => dishes.slice(0, 8), [dishes]);

  return (
    <div className="mt-6">
      <div className="bg-card rounded-[14px] border border-border overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-2 border-b border-border">
          <h2 className="text-[15px] font-extrabold text-foreground">Popular Dishes</h2>
          <button
            onClick={() => navigate("/catalog?tab=dishes")}
            className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors"
          >
            View all <FiExternalLink size={12} />
          </button>
        </div>

        {/* Dish List */}
        <div className="overflow-y-auto h-[calc(100vh-320px)] max-h-[700px] hide-scrollbar py-2 px-3 space-y-2">
          {popularDishes.length > 0 ? (
            popularDishes.map((dish, index) => (
              <div
                key={dish.id}
                className="flex items-center gap-2 rounded-xl px-3 py-2.5 transition-all duration-200 group"
              >
                {/* Rank badge */}
                <div className="flex-shrink-0 flex items-center justify-center h-7 w-7 rounded-lg text-xs font-extrabold bg-surface-strong text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </div>

                {/* Dish icon */}
                <div
                  className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-base border-2 border-white/20 shadow-sm"
                  style={{ backgroundColor: dish.bgColor || "#374151" }}
                >
                  {dish.icon}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">{dish.name}</p>
                  <p className="text-xs text-muted-foreground font-medium mt-0.5 truncate">
                    {dish.categoryName}
                  </p>
                </div>

                {/* Price */}
                <p className="text-sm font-extrabold text-primary flex-shrink-0">
                  PKR {dish.price}
                </p>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-40 gap-2 text-center">
              <span className="text-4xl">🫙</span>
              <p className="text-sm font-semibold text-muted-foreground">No dishes available yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PopularDishes;
