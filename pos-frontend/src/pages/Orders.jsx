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
            const count = getCount(id);
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
