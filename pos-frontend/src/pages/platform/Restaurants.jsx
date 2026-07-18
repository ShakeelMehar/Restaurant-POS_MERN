import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiUsers, FiChevronRight, FiSearch } from "react-icons/fi";
import { getRestaurants } from "../../https";
import CreateRestaurantModal from "../../components/platform/CreateRestaurantModal";

const Restaurants = () => {
  const navigate = useNavigate();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    document.title = "Platform | Restaurants";
  }, []);

  const { data: resData, isLoading } = useQuery({
    queryKey: ["restaurants"],
    queryFn: () => getRestaurants(),
  });

  const restaurants = resData?.data?.data || [];

  return (
    <section className="px-4 sm:px-6 py-12 max-w-6xl mx-auto">
      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-[28px] font-bold text-foreground tracking-tight">Restaurants</h1>
          <p className="text-[16px] text-muted-foreground mt-1">
            {restaurants.length} {restaurants.length === 1 ? "restaurant" : "restaurants"} on the platform
          </p>
        </div>
        <button onClick={() => setIsCreateOpen(true)} className="btn btn-primary self-start sm:self-auto">
          <FiPlus size={16} /> New Restaurant
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 bg-card rounded-[14px] border border-border animate-pulse" />
          ))}
        </div>
      ) : restaurants.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-center bg-card rounded-[14px] border border-border">
          <FiSearch size={48} strokeWidth={1} className="text-muted-foreground/40 mb-2" />
          <h3 className="text-xl font-semibold text-foreground">No restaurants yet</h3>
          <p className="text-[16px] text-muted-foreground max-w-md">
            Create your first restaurant. An admin account is provisioned automatically with a
            one-time temporary password.
          </p>
          <button onClick={() => setIsCreateOpen(true)} className="btn btn-primary mt-1">
            <FiPlus size={16} /> New Restaurant
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {restaurants.map((r) => (
            <button
              key={r._id}
              onClick={() => navigate(`/platform/restaurants/${r._id}`)}
              className="group text-left bg-card rounded-[14px] border border-border p-6 transition-all duration-200 hover:shadow-[rgba(0,0,0,0.02)_0_0_0_1px,rgba(0,0,0,0.04)_0_2px_6px,rgba(0,0,0,0.1)_0_4px_8px]"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-[14px] bg-[hsl(var(--surface-strong))] text-foreground font-bold text-lg">
                    {r.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-[16px] font-semibold text-foreground leading-tight truncate">
                      {r.name}
                    </h2>
                    <p className="text-[12px] text-muted-foreground truncate">
                      {r.admins[0]?.email || "No admin"}
                    </p>
                  </div>
                </div>
                <FiChevronRight
                  size={18}
                  className="text-muted-foreground flex-shrink-0 transition-transform group-hover:translate-x-0.5"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border/60">
                <span className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground font-medium">
                  <FiUsers size={13} /> {r.cashierCount} {r.cashierCount === 1 ? "cashier" : "cashiers"}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    r.isActive
                      ? "bg-success/10 text-success border border-success/25"
                      : "bg-error/10 text-error border border-error/25"
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${r.isActive ? "bg-success" : "bg-error"}`} />
                  {r.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      <CreateRestaurantModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </section>
  );
};

export default Restaurants;
