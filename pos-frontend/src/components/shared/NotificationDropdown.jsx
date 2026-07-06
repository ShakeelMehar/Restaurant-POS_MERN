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
      className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-[360px] rounded-2xl border border-border bg-card p-4 shadow-xl"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
        <button
          onClick={() => {
            onClose();
            navigate("/orders");
          }}
          className="text-sm font-semibold text-blue-600"
        >
          View orders
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <button
              key={notification.id}
              onClick={() => {
                onClose();
                navigate("/orders");
              }}
              className="w-full rounded-xl bg-popover px-4 py-3 text-left transition hover:bg-card"
            >
              <p className="font-semibold text-foreground">
                {notification.title}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {notification.description}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">{notification.time}</p>
            </button>
          ))
        ) : (
          <div className="rounded-xl bg-popover px-4 py-6 text-center">
            <p className="font-semibold text-foreground">No notifications yet</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Recent order activity will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
