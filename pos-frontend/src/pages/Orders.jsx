import React, { useState, useEffect, useMemo } from "react";
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

  const allOrders = useMemo(() => resData?.data?.data || [], [resData]);

  // ⚡ Bolt Optimization: Computed order counts in a single O(N) pass
  // instead of iterating allOrders O(N*4) times on every render.
  const orderCounts = useMemo(() => {
    const counts = { all: allOrders.length, progress: 0, ready: 0, completed: 0 };
    allOrders.forEach((o) => {
      if (o.orderStatus === "In Progress") counts.progress++;
      else if (o.orderStatus === "Ready") counts.ready++;
      else if (o.orderStatus === "Completed") counts.completed++;
    });
    return counts;
  }, [allOrders]);

  // ⚡ Bolt Optimization: Memoize filtered list to prevent unnecessary recalculation
  // on every render when dependencies haven't changed.
  const filteredOrders = useMemo(() => {
    return allOrders.filter((order) => {
      if (status === "all") return true;
      if (status === "progress") return order.orderStatus === "In Progress";
      if (status === "ready") return order.orderStatus === "Ready";
      if (status === "completed") return order.orderStatus === "Completed";
      return true;
    });
  }, [allOrders, status]);

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-background pb-24">
      {/* Page header */}
      <div className="flex flex-col gap-4 px-6 py-4 border-b border-border bg-card/50 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <BackButton />
          <div>
            <h1 className="text-xl font-extrabold text-foreground tracking-tight">Orders</h1>
            <p className="text-xs text-muted-foreground font-medium">{allOrders.length} total orders</p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {FILTERS.map(({ id, label }) => {
            const isActive = status === id;
            const count = orderCounts[id] || 0;
            return (
              <button
                key={id}
                onClick={() => setStatus(id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-primary to-amber-500 text-primary-foreground shadow-md shadow-primary/30"
                    : "bg-secondary border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                }`}
              >
                {label}
                <span className={`text-xs rounded-full px-1.5 py-0.5 font-extrabold ${
                  isActive ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 px-6 py-5">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <OrderCard key={order._id} order={order} onManage={setSelectedOrder} />
          ))
        ) : (
          <div className="col-span-3 flex flex-col items-center justify-center py-20 gap-4 text-center">
            <span className="text-6xl">📋</span>
            <h3 className="text-lg font-bold text-foreground">No orders found</h3>
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
