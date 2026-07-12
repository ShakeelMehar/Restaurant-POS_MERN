import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import Modal from "../shared/Modal";
import { updateOrderById } from "../../https";
import { formatDateAndTime, getAvatarName } from "../../utils";
import { setEditingOrder } from "../../redux/slices/customerSlice";
import { setCart } from "../../redux/slices/cartSlice";

const statusOptions = ["Held", "In Progress", "Ready", "Completed"];

const OrderDetailsModal = ({ order, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const orderUpdateMutation = useMutation({
    mutationFn: ({ orderId, reqData }) => updateOrderById(orderId, reqData),
    onSuccess: async (_, variables) => {
      const nextStatus = variables.reqData.orderStatus;
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      enqueueSnackbar(`Order marked as ${nextStatus}.`, { variant: "success" });
      onClose();
    },
    onError: (error) => {
      enqueueSnackbar(
        error?.response?.data?.message || "Unable to update the order.",
        { variant: "error" }
      );
    },
  });



  const handleStatusChange = (nextStatus) => {
    if (!order?._id || nextStatus === order.orderStatus || order.isOffline) {
      return;
    }

    orderUpdateMutation.mutate({
      orderId: order._id,
      reqData: { orderStatus: nextStatus },
    });
  };

  const handleEditOrder = () => {
    if (order.isOffline) {
      enqueueSnackbar("Cannot modify offline orders until they sync.", { variant: "warning" });
      return;
    }
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
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 h-12 w-12 rounded-[9999px] bg-foreground text-[hsl(var(--background))] flex items-center justify-center text-[18px] font-bold">
              {getAvatarName(order.customerDetails?.name) || "CN"}
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-foreground">
                {order.customerDetails?.name || "Customer"}
              </h3>
            <p className="text-[14px] text-muted mt-0.5">
                Guests {order.customerDetails?.guests || 0}
              </p>
              <p className="mt-0.5 text-[13px] text-muted">
                {formatDateAndTime(order.orderDate || order.createdAt || Date.now())}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[14px] text-muted">Total</p>
            <p className="text-[18px] font-bold text-foreground">
              PKR {order.bills?.totalWithTax?.toFixed(2) || "0.00"}
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[12px] font-bold uppercase tracking-wide text-muted">
              Update Status
            </p>
            {order.isOffline && (
              <span className="text-[10px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded font-bold">
                Waiting for sync...
              </span>
            )}
          </div>
          <div className="flex gap-2 bg-[hsl(var(--surface-soft))] p-1 rounded-[9999px] overflow-x-auto hide-scrollbar">
            {statusOptions.map((status) => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                disabled={orderUpdateMutation.isPending || order.isOffline}
                className={`flex-1 min-w-[80px] rounded-[9999px] px-3 py-2 text-[13px] font-semibold transition whitespace-nowrap border ${
                  order.orderStatus === status
                    ? "border-foreground bg-foreground text-[hsl(var(--background))]"
                    : "border-transparent bg-transparent text-muted hover:text-foreground hover:bg-[rgba(0,0,0,0.03)]"
                } disabled:cursor-not-allowed disabled:opacity-50`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[12px] font-bold uppercase tracking-wide text-muted">
              Order Items
            </p>
            <p className="text-[13px] text-muted">
              {(order.items || []).length} items
            </p>
          </div>
          <div className="max-h-72 space-y-2 overflow-y-auto pr-1 hide-scrollbar">
            {(order.items || []).map((item, index) => (
              <div
                key={item.id || `${item.name}-${index}`}
                className="rounded-[12px] bg-card border border-border px-4 py-3 shadow-[rgba(0,0,0,0.02)_0_0_0_1px,rgba(0,0,0,0.04)_0_2px_6px]"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-[14px] text-foreground">{item.name}</p>
                    <p className="mt-1 text-[13px] text-muted">
                      Qty {item.quantity} | PKR {item.pricePerQuantity} each
                    </p>
                  </div>
                  <p className="font-bold text-[14px] text-foreground">
                    PKR {item.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 btn btn-secondary"
          >
            Close
          </button>
          <button
            onClick={handleEditOrder}
            className="flex-1 btn btn-primary"
          >
            Modify In Menu
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default OrderDetailsModal;
