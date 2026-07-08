import React, { useState, useEffect } from "react";
import OrderCard from "../components/orders/OrderCard";
import OrderDetailsModal from "../components/orders/OrderDetailsModal";
import BackButton from "../components/shared/BackButton";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getOrders } from "../https/index";
import { enqueueSnackbar } from "notistack";

const FILTERS = [
  { id: "all",       label: "All" },
  { id: "progress",  label: "In Progress" },
  { id: "ready",     label: "Ready" },
  { id: "completed", label: "Completed" },
];

const Orders = () => {
  const [status, setStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    document.title = "POS | Orders";
  }, []);

  const { data: resData, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => await getOrders(),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (isError) enqueueSnackbar("Something went wrong!", { variant: "error" });
  }, [isError]);

  const allOrders = resData?.data?.data || [];

  const getCount = (id) => {
    if (id === "all") return allOrders.length;
    if (id === "progress") return allOrders.filter((o) => o.orderStatus === "In Progress").length;
    if (id === "ready") return allOrders.filter((o) => o.orderStatus === "Ready").length;
    if (id === "completed") return allOrders.filter((o) => o.orderStatus === "Completed").length;
    return 0;
  };

  const filteredOrders = allOrders.filter((order) => {
    if (status === "all") return true;
    if (status === "progress") return order.orderStatus === "In Progress";
    if (status === "ready") return order.orderStatus === "Ready";
    if (status === "completed") return order.orderStatus === "Completed";
    return true;
  });

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-background pb-24">
      {/* Page header */}
      <div className="flex flex-col gap-2 px-4 py-2 border-b border-border bg-card/50 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <BackButton />
          <div>
            <h1 className="text-lg font-extrabold text-foreground tracking-tight">Orders</h1>
            <p className="text-xs text-muted-foreground font-medium">{allOrders.length} total orders</p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {FILTERS.map(({ id, label }) => {
            const isActive = status === id;
            const count = getCount(id);
            return (
              <button
                key={id}
                onClick={() => setStatus(id)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-[9999px] text-[13px] font-semibold transition-all duration-200 border ${
                  isActive
                    ? "border-foreground bg-foreground text-[hsl(var(--background))]"
                    : "border-[hsl(var(--border-strong))] bg-card text-foreground hover:border-foreground"
                }`}
              >
                {label}
                <span className={`text-[11px] rounded-full px-2 py-0.5 font-bold ${
                  isActive ? "bg-[hsl(var(--background))] text-foreground" : "bg-[hsl(var(--surface-strong))] text-foreground"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 px-4 py-3">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <OrderCard key={order._id} order={order} onManage={setSelectedOrder} />
          ))
        ) : (
          <div className="col-span-3 flex flex-col items-center justify-center py-20 gap-2 text-center">
            <span className="text-6xl">📋</span>
            <h3 className="text-base font-bold text-foreground">No orders found</h3>
            <p className="text-sm text-muted-foreground">Try a different filter or check back later.</p>
          </div>
        )}
      </div>

      <OrderDetailsModal
        order={selectedOrder}
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
      />
    </section>
  );
};

export default Orders;
