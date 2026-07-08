import React, { useEffect, useMemo, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getOrders } from "../../https";
import { formatDateAndTime } from "../../utils";

const NotificationDropdown = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const panelRef = useRef(null);

  const { data: orderResponse } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => await getOrders(),
    enabled: isOpen,
  });

  const notifications = useMemo(() => {
    const orders = orderResponse?.data?.data ?? [];

    return [...orders]
      .sort(
        (left, right) =>
          new Date(right.createdAt || right.orderDate) -
          new Date(left.createdAt || left.orderDate)
      )
      .slice(0, 5)
      .map((order) => ({
        id: order._id,
        title: order?.customerDetails?.name
          ? `Order from ${order.customerDetails.name}`
          : "New order received",
        description: `Table ${order?.table?.tableNo || "N/A"} - ${
          order.orderStatus || "Pending"
        }`,
        time: formatDateAndTime(order.createdAt || order.orderDate),
      }));
  }, [orderResponse]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleOutsideClick = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-[360px] rounded-[14px] border border-[hsl(var(--border-strong))] bg-card p-4 shadow-[rgba(0,0,0,0.02)_0_0_0_1px,rgba(0,0,0,0.08)_0_8px_24px]"
    >
      <div className="flex items-center justify-between pb-3 border-b border-[hsl(var(--border-strong))] mb-3">
        <h2 className="text-[16px] font-bold text-foreground">Notifications</h2>
        <button
          onClick={() => {
            onClose();
            navigate("/orders");
          }}
          className="text-[13px] font-bold text-primary hover:underline"
        >
          View orders
        </button>
      </div>

      <div className="space-y-1">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <button
              key={notification.id}
              onClick={() => {
                onClose();
                navigate("/orders");
              }}
              className="w-full rounded-[12px] bg-card px-4 py-3 text-left transition hover:bg-[hsl(var(--surface-soft))]"
            >
              <p className="font-bold text-[14px] text-foreground leading-snug">
                {notification.title}
              </p>
              <p className="mt-0.5 text-[13px] text-muted leading-snug">
                {notification.description}
              </p>
              <p className="mt-1.5 text-[11px] font-semibold text-muted opacity-70 uppercase tracking-wide">
                {notification.time}
              </p>
            </button>
          ))
        ) : (
          <div className="rounded-[12px] bg-card px-4 py-6 text-center">
            <p className="font-bold text-[14px] text-foreground">No notifications yet</p>
            <p className="mt-1 text-[13px] text-muted">
              Recent order activity will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
