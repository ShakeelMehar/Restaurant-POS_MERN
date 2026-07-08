import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectMenuCategories } from "../../redux/slices/menuSlice";
import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../../https";
import { useNavigate } from "react-router-dom";

const GlobalSearchModal = ({ searchQuery, onClose }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");

  const categories = useSelector(selectMenuCategories) || [];
  const { data: resData } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => await getOrders(),
  });
  const orders = resData?.data?.data || [];

  const lowerQuery = searchQuery.toLowerCase();

  // Filter Categories
  const matchedCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(lowerQuery)
  );

  // Filter Products (Dishes)
  const matchedProducts = [];
  categories.forEach((cat) => {
    cat.items.forEach((item) => {
      if (item.name.toLowerCase().includes(lowerQuery)) {
        matchedProducts.push({ ...item, categoryName: cat.name });
      }
    });
  });

  // Filter Orders
  const matchedOrders = orders.filter((o) => {
    const orderIdStr = String(Math.floor(new Date(o.orderDate).getTime()));
    return (
      orderIdStr.includes(lowerQuery) ||
      o.customerDetails?.name?.toLowerCase().includes(lowerQuery)
    );
  });

  const handleRoute = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose}></div>
      <div className="absolute top-[120%] left-0 w-full max-w-[500px] bg-card rounded-[14px] shadow-[rgba(0,0,0,0.02)_0_0_0_1px,rgba(0,0,0,0.08)_0_8px_24px] z-50 border border-border overflow-hidden">
        {/* TABS */}
        <div className="flex items-center gap-6 px-6 pt-3 bg-card border-b border-border">
          {["all", "orders", "products", "categories"].map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-[14px] font-semibold capitalize transition-colors ${
                  isActive
                    ? "text-foreground border-b-2 border-foreground"
                    : "text-muted hover:text-foreground border-b-2 border-transparent"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* RESULTS */}
        <div className="max-h-[400px] overflow-y-auto p-4 hide-scrollbar">
          {!searchQuery ? (
            <p className="text-muted text-center text-[14px] py-4">Start typing to search...</p>
          ) : (
            <div className="flex flex-col gap-4">
              {/* ORDERS */}
              {(activeTab === "all" || activeTab === "orders") && matchedOrders.length > 0 && (
                <div>
                  <h3 className="text-[12px] font-bold text-muted mb-2 uppercase tracking-wider px-2">Orders</h3>
                  <div className="flex flex-col gap-1">
                    {matchedOrders.slice(0, activeTab === "all" ? 3 : undefined).map((order) => (
                      <div
                        key={order._id}
                        onClick={() => handleRoute("/orders")}
                        className="bg-card p-3 rounded-[10px] cursor-pointer hover:bg-[hsl(var(--surface-soft))] transition-colors"
                      >
                        <p className="text-foreground text-[14px] font-bold">
                          #{Math.floor(new Date(order.orderDate).getTime())} - {order.customerDetails?.name}
                        </p>
                        <p className="text-[13px] text-muted mt-0.5">
                          {order.orderStatus} • {order.items?.length} items
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PRODUCTS */}
              {(activeTab === "all" || activeTab === "products") && matchedProducts.length > 0 && (
                <div>
                  <h3 className="text-[12px] font-bold text-muted mb-2 uppercase tracking-wider px-2">Products</h3>
                  <div className="flex flex-col gap-1">
                    {matchedProducts.slice(0, activeTab === "all" ? 3 : undefined).map((prod) => (
                      <div
                        key={prod.id || prod.name}
                        onClick={() => handleRoute("/")}
                        className="bg-card p-3 rounded-[10px] cursor-pointer hover:bg-[hsl(var(--surface-soft))] transition-colors"
                      >
                        <p className="text-foreground text-[14px] font-bold">{prod.name}</p>
                        <p className="text-[13px] text-muted mt-0.5">
                          PKR {prod.price} • {prod.categoryName}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CATEGORIES */}
              {(activeTab === "all" || activeTab === "categories") && matchedCategories.length > 0 && (
                <div>
                  <h3 className="text-[12px] font-bold text-muted mb-2 uppercase tracking-wider px-2">Categories</h3>
                  <div className="flex flex-col gap-1">
                    {matchedCategories.slice(0, activeTab === "all" ? 3 : undefined).map((cat) => (
                      <div
                        key={cat.id}
                        onClick={() => handleRoute("/")}
                        className="bg-card p-3 rounded-[10px] cursor-pointer hover:bg-[hsl(var(--surface-soft))] transition-colors flex justify-between items-center"
                      >
                        <p className="text-foreground text-[14px] font-bold">{cat.name}</p>
                        <p className="text-[13px] text-muted">{cat.items?.length} items</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* EMPTY STATE */}
              {searchQuery &&
                matchedOrders.length === 0 &&
                matchedProducts.length === 0 &&
                matchedCategories.length === 0 && (
                  <p className="text-muted text-center text-[14px] py-4">No results found for "{searchQuery}"</p>
                )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default GlobalSearchModal;
