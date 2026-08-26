import { useEffect, useState } from "react";
import { FiSearch, FiExternalLink } from "react-icons/fi";
import OrderList from "./OrderList";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { getOrders } from "../../https/index";
import OrderDetailsModal from "../orders/OrderDetailsModal";

const RecentOrders = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { data: resData, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => await getOrders(),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (isError) enqueueSnackbar("Something went wrong!", { variant: "error" });
  }, [isError]);

  const orders = resData?.data?.data || [];
  const normalized = searchQuery.trim().toLowerCase();
  const filteredOrders = orders.filter((order) => {
    if (!normalized) return true;
    return (
      order.customerDetails?.name?.toLowerCase().includes(normalized) ||
      order.orderStatus?.toLowerCase().includes(normalized) ||
      String(order.table?.tableNo || "").includes(normalized) ||
      (order.items || []).some((i) => i.name?.toLowerCase().includes(normalized))
    );
  });

  return (
    <div className="px-6 mt-6">
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-border">
          <h2 className="text-[15px] font-extrabold text-foreground">Recent Orders</h2>
          <a
            href="/orders"
            className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors"
          >
            View all <FiExternalLink size={12} />
          </a>
        </div>

        {/* Search */}
        <div className="flex items-center gap-3 bg-secondary/60 border-b border-border px-5 py-3">
          <FiSearch size={14} className="text-muted-foreground flex-shrink-0" />
          <input
            type="text"
            placeholder="Search orders…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-sm w-full"
          />
        </div>

        {/* Order List */}
        <div className="overflow-y-auto h-[300px] hide-scrollbar">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <OrderList key={order._id} order={order} onManage={setSelectedOrder} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-3 py-8 text-center">
              <span className="text-4xl">📭</span>
              <p className="text-sm font-semibold text-muted-foreground">No orders found</p>
            </div>
          )}
        </div>
      </div>

      <OrderDetailsModal
        order={selectedOrder}
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
};

export default RecentOrders;
