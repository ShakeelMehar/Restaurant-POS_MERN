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
      <div className="absolute top-[120%] left-0 w-[500px] bg-card rounded-xl shadow-2xl z-50 border border-border overflow-hidden">
        {/* TABS */}
        <div className="flex items-center gap-6 px-4 py-3 bg-background border-b border-border">
          {["all", "orders", "products", "categories"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm font-semibold capitalize transition-colors ${
                activeTab === tab ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* RESULTS */}
        <div className="max-h-[400px] overflow-y-auto p-4 scrollbar-hide">
          {!searchQuery ? (
            <p className="text-muted-foreground text-center text-sm">Start typing to search...</p>
          ) : (
            <div className="flex flex-col gap-4">
              {/* ORDERS */}
              {(activeTab === "all" || activeTab === "orders") && matchedOrders.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-muted-foreground mb-2 uppercase">Orders</h3>
                  <div className="flex flex-col gap-2">
                    {matchedOrders.slice(0, activeTab === "all" ? 3 : undefined).map((order) => (
                      <div
                        key={order._id}
                        onClick={() => handleRoute("/orders")}
                        className="bg-card p-3 rounded-lg cursor-pointer hover:bg-secondary/80 transition-colors"
                      >
                        <p className="text-foreground text-sm font-semibold">
                          #{Math.floor(new Date(order.orderDate).getTime())} - {order.customerDetails?.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
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
                  <h3 className="text-xs font-bold text-muted-foreground mb-2 uppercase">Products</h3>
                  <div className="flex flex-col gap-2">
                    {matchedProducts.slice(0, activeTab === "all" ? 3 : undefined).map((prod) => (
                      <div
                        key={prod.id || prod.name}
                        onClick={() => handleRoute("/")}
                        className="bg-card p-3 rounded-lg cursor-pointer hover:bg-secondary/80 hover:border-l-4 border-primary transition-all"
                      >
                        <p className="text-foreground text-sm font-semibold">{prod.name}</p>
                        <p className="text-xs text-muted-foreground">
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
                  <h3 className="text-xs font-bold text-muted-foreground mb-2 uppercase">Categories</h3>
                  <div className="flex flex-col gap-2">
                    {matchedCategories.slice(0, activeTab === "all" ? 3 : undefined).map((cat) => (
                      <div
                        key={cat.id}
                        onClick={() => handleRoute("/")}
                        className="bg-card p-3 rounded-lg cursor-pointer hover:bg-secondary/80 transition-colors flex justify-between items-center"
                      >
                        <p className="text-foreground text-sm font-semibold">{cat.name}</p>
                        <p className="text-xs text-muted-foreground">{cat.items?.length} items</p>
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
                  <p className="text-muted-foreground text-center text-sm">No results found for &quot;{searchQuery}&quot;</p>
                )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default GlobalSearchModal;
