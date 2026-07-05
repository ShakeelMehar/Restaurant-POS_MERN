import React, { useState, useEffect } from "react";

import OrderCard from "../components/orders/OrderCard";
import OrderDetailsModal from "../components/orders/OrderDetailsModal";
import BackButton from "../components/shared/BackButton";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getOrders } from "../https/index";
import { enqueueSnackbar } from "notistack";

const Orders = () => {
  const [status, setStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    document.title = "POS | Orders";
  }, []);

  const { data: resData, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      return await getOrders();
    },
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (isError) {
      enqueueSnackbar("Something went wrong!", { variant: "error" });
    }
  }, [isError]);

  const filteredOrders = resData?.data?.data?.filter((order) => {
    if (status === "all") return true;
    if (status === "progress") return order.orderStatus === "In Progress";
    if (status === "ready") return order.orderStatus === "Ready";
    if (status === "completed") return order.orderStatus === "Completed";
    return true;
  }) || [];

  return (
    <section className="min-h-[calc(100vh-5rem)] bg-[#1f1f1f] pb-24">
      <div className="flex items-center justify-between px-10 py-4">
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className="text-[#f5f5f5] text-2xl font-bold tracking-wider">
            Orders
          </h1>
        </div>
        <div className="flex items-center justify-around gap-4">
          <button onClick={() => setStatus("all")} className={`text-[#ababab] text-lg ${status === "all" && "bg-[#383838] rounded-lg px-5 py-2"}  rounded-lg px-5 py-2 font-semibold`}>
            All
          </button>
          <button onClick={() => setStatus("progress")} className={`text-[#ababab] text-lg ${status === "progress" && "bg-[#383838] rounded-lg px-5 py-2"}  rounded-lg px-5 py-2 font-semibold`}>
            In Progress
          </button>
          <button onClick={() => setStatus("ready")} className={`text-[#ababab] text-lg ${status === "ready" && "bg-[#383838] rounded-lg px-5 py-2"}  rounded-lg px-5 py-2 font-semibold`}>
            Ready
          </button>
          <button onClick={() => setStatus("completed")} className={`text-[#ababab] text-lg ${status === "completed" && "bg-[#383838] rounded-lg px-5 py-2"}  rounded-lg px-5 py-2 font-semibold`}>
            Completed
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 px-16 py-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => {
            return (
              <OrderCard
                key={order._id}
                order={order}
                onManage={setSelectedOrder}
              />
            );
          })
        ) : (
          <p className="col-span-3 text-gray-500">No orders available</p>
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
