import React from "react";
import { orders } from "../../constants";
import { GrUpdate } from "react-icons/gr";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { getOrders, updateOrderStatus } from "../../https/index";
import { formatDateAndTime } from "../../utils";

const RecentOrders = () => {
  const queryClient = useQueryClient();
  const handleStatusChange = ({orderId, orderStatus}) => {
    console.log(orderId)
    orderStatusUpdateMutation.mutate({orderId, orderStatus});
  };

  const orderStatusUpdateMutation = useMutation({
    mutationFn: ({orderId, orderStatus}) => updateOrderStatus({orderId, orderStatus}),
    onSuccess: (data) => {
      enqueueSnackbar("Order status updated successfully!", { variant: "success" });
      queryClient.invalidateQueries(["orders"]); // Refresh order list
    },
    onError: () => {
      enqueueSnackbar("Failed to update order status!", { variant: "error" });
    }
  })

  const { data: resData, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      return await getOrders();
    },
    placeholderData: keepPreviousData,
  });

  if (isError) {
    enqueueSnackbar("Something went wrong!", { variant: "error" });
  }

  console.log(resData.data.data);

  return (
    <div className="container mx-auto bg-card p-3 rounded-lg">
      <h2 className="text-foreground text-lg font-semibold mb-4">
        Recent Orders
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-foreground">
          <thead className="bg-secondary text-muted-foreground">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date & Time</th>
              <th className="p-3">Items</th>
              <th className="p-3">Table No</th>
              <th className="p-3">Total</th>
              <th className="p-3 text-center">Payment Method</th>
            </tr>
          </thead>
          <tbody>
            {resData?.data.data.map((order, index) => (
              <tr
                key={index}
                className="border-b border-border hover:bg-secondary/50"
              >
                <td className="p-3">#{Math.floor(new Date(order.orderDate).getTime())}</td>
                <td className="p-3">{order.customerDetails.name}</td>
                <td className="p-3">
                  <select
                    className={`bg-card text-foreground border border-border p-2 rounded-lg focus:outline-none ${
                      order.orderStatus === "Ready"
                        ? "text-success"
                        : "text-warning"
                    }`}
                    value={order.orderStatus}
                    onChange={(e) => handleStatusChange({orderId: order._id, orderStatus: e.target.value})}
                  >
                    <option className="text-warning" value="In Progress">
                      In Progress
                    </option>
                    <option className="text-success" value="Ready">
                      Ready
                    </option>
                  </select>
                </td>
                <td className="p-3">{formatDateAndTime(order.orderDate)}</td>
                <td className="p-3">{order.items.length} Items</td>
                <td className="p-3">Table - {order.table.tableNo}</td>
                <td className="p-3">PKR {order.bills.totalWithTax}</td>
                <td className="p-3">
                  {order.paymentMethod}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;
