import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import Modal from "../shared/Modal";
import { updateOrderById, updateTable } from "../../https";
import { formatDateAndTime, getAvatarName } from "../../utils";
import { setEditingOrder } from "../../redux/slices/customerSlice";
import { setCart } from "../../redux/slices/cartSlice";

const statusOptions = ["In Progress", "Ready", "Completed"];

const OrderDetailsModal = ({ order, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const orderUpdateMutation = useMutation({
    mutationFn: ({ orderId, reqData }) => updateOrderById(orderId, reqData),
    onSuccess: async (_, variables) => {
      try {
        const nextStatus = variables.reqData.orderStatus;
        const shouldFreeTable = nextStatus === "Completed";

        if (order?.table?._id) {
          await tableMutation.mutateAsync({
            tableId: order.table._id,
            status: shouldFreeTable ? "Available" : "Booked",
            orderId: shouldFreeTable ? null : order._id,
          });
        }

        queryClient.invalidateQueries({ queryKey: ["orders"] });
        queryClient.invalidateQueries({ queryKey: ["tables"] });
        enqueueSnackbar(`Order marked as ${nextStatus}.`, { variant: "success" });
        onClose();
      } catch (error) {
        enqueueSnackbar("Order status updated, but table refresh failed.", {
          variant: "warning",
        });
      }
    },
    onError: (error) => {
      enqueueSnackbar(
        error?.response?.data?.message || "Unable to update the order.",
        { variant: "error" }
      );
    },
  });

  const tableMutation = useMutation({
    mutationFn: (reqData) => updateTable(reqData),
  });

  const handleStatusChange = (nextStatus) => {
    if (!order?._id || nextStatus === order.orderStatus) {
      return;
    }

    orderUpdateMutation.mutate({
      orderId: order._id,
      reqData: { orderStatus: nextStatus },
    });
  };

  const handleEditOrder = () => {
    dispatch(setEditingOrder({ order }));
    dispatch(
      setCart(
        order.items.map((item) => ({
          ...item,
          id: item.id || `${order._id}-${item.name}`,
        }))
      )
    );
    onClose();
    navigate("/menu");
  };

  if (!order) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Order">
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-4 rounded-xl bg-[#202020] p-4">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-[#f6b100] px-4 py-3 text-xl font-bold text-[#1f1f1f]">
              {getAvatarName(order.customerDetails?.name) || "CN"}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#f5f5f5]">
                {order.customerDetails?.name || "Customer"}
              </h3>
            <p className="text-sm text-[#ababab]">
                Table {order.table?.tableNo || "N/A"} | Guests{" "}
                {order.customerDetails?.guests || 0}
              </p>
              <p className="mt-1 text-xs text-[#777]">
                {formatDateAndTime(order.orderDate || order.createdAt)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-[#ababab]">Total</p>
            <p className="text-xl font-bold text-[#f5f5f5]">
              PKR {order.bills?.totalWithTax?.toFixed(2) || "0.00"}
            </p>
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#ababab]">
            Update Status
          </p>
          <div className="grid grid-cols-3 gap-3">
            {statusOptions.map((status) => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                disabled={orderUpdateMutation.isPending}
                className={`rounded-lg px-4 py-3 text-sm font-semibold transition ${
                  order.orderStatus === status
                    ? "bg-[#F6B100] text-[#1f1f1f]"
                    : "bg-[#1f1f1f] text-[#f5f5f5] hover:bg-[#2a2a2a]"
                } disabled:cursor-not-allowed disabled:opacity-70`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#ababab]">
              Order Items
            </p>
            <p className="text-sm text-[#ababab]">
              {(order.items || []).length} items
            </p>
          </div>
          <div className="max-h-72 space-y-3 overflow-y-auto pr-1 scrollbar-hide">
            {(order.items || []).map((item, index) => (
              <div
                key={item.id || `${item.name}-${index}`}
                className="rounded-xl bg-[#202020] px-4 py-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-[#f5f5f5]">{item.name}</p>
                    <p className="mt-1 text-sm text-[#ababab]">
                      Qty {item.quantity} | PKR {item.pricePerQuantity} each
                    </p>
                  </div>
                  <p className="font-semibold text-[#F6B100]">
                    PKR {item.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="w-full rounded-lg bg-[#1f1f1f] px-4 py-3 font-semibold text-[#f5f5f5]"
          >
            Close
          </button>
          <button
            onClick={handleEditOrder}
            className="w-full rounded-lg bg-[#F6B100] px-4 py-3 font-semibold text-[#1f1f1f]"
          >
            Modify In Menu
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default OrderDetailsModal;
