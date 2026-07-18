import React from "react";
import { FaCheckDouble, FaWifi, FaCircle } from "react-icons/fa";
import { formatDateAndTime } from "../../utils/index";

const OrderCard = ({ order, onManage }) => {
  const orderType = order.orderType || "Dine In";
  const paymentMethod = order.paymentMethod || "Pending";
  
  // Handle offline local- timestamps
  const orderId = String(
    order.isOffline 
      ? order._id.split("-")[1] 
      : Math.floor(new Date(order.orderDate || order.createdAt || Date.now()).getTime())
  ).slice(-6);

  const itemsPreview = (order.items || []).map(i => `${i.quantity}x ${i.name}`).join(", ");

  return (
    <button
      onClick={() => onManage(order)}
      className="mb-4 w-full bg-card rounded-[14px] border border-[hsl(var(--border-strong))] shadow-[rgba(0,0,0,0.02)_0_0_0_1px,rgba(0,0,0,0.04)_0_2px_6px] p-5 text-left transition hover:-translate-y-[1px] hover:shadow-[rgba(0,0,0,0.02)_0_0_0_1px,rgba(0,0,0,0.08)_0_4px_12px] flex flex-col gap-4 relative"
    >
      {/* Header */}
      <div className="flex justify-between items-start gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-foreground text-[18px] font-black tracking-tight">
              #{orderId}
            </h1>
            {order.isOffline && (
               <span className="text-[10px] bg-warning/10 text-warning px-1.5 py-0.5 rounded font-bold flex items-center gap-1"><FaWifi size={8}/> Offline</span>
            )}
          </div>
          <p className="text-muted text-[13px] mt-0.5 font-medium">{formatDateAndTime(order.orderDate)}</p>
        </div>
        
        {/* Status Badge */}
        <div className="flex-shrink-0">
          {order.orderStatus === "Ready" ? (
             <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[9999px] border border-[hsl(var(--border-strong))] bg-card text-[12px] font-bold text-foreground">
               <FaCheckDouble className="text-success" /> {order.orderStatus}
             </span>
          ) : order.orderStatus === "Held" ? (
             <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[9999px] border border-[hsl(var(--border-strong))] bg-card text-[12px] font-bold text-foreground">
               <FaCircle className="text-warning text-[10px]" /> {order.orderStatus}
             </span>
          ) : order.orderStatus === "Completed" ? (
             <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[9999px] border border-[hsl(var(--border-strong))] bg-card text-[12px] font-bold text-foreground">
               <FaCheckDouble className="text-info" /> {order.orderStatus}
             </span>
          ) : (
             <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[9999px] border border-[hsl(var(--border-strong))] bg-card text-[12px] font-bold text-foreground">
               <FaCircle className="text-warning text-[10px]" /> {order.orderStatus}
             </span>
          )}
        </div>
      </div>

      {/* Details: Items & Type */}
      <div>
        <p className="text-foreground text-[14px] leading-snug line-clamp-2 font-medium">
          {itemsPreview || "No items"}
        </p>
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <span className="bg-[hsl(var(--surface-soft))] text-foreground px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider">
            {orderType}
          </span>
          <span className="bg-[hsl(var(--surface-soft))] text-foreground px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider">
            {paymentMethod}
          </span>
        </div>
      </div>
      
      <hr className="w-full border-t border-[hsl(var(--border-strong))] opacity-50" />
      
      {/* Footer: Total */}
      <div className="flex items-center justify-between">
        <h1 className="text-foreground text-[16px] font-semibold">Total</h1>
        <div className="flex items-center gap-3">
          <p className="text-[14px] font-medium text-muted">Manage</p>
          <p className="text-foreground text-[18px] font-black tracking-tight">
            PKR {order.bills?.totalWithTax?.toFixed(2) || "0.00"}
          </p>
        </div>
      </div>
    </button>
  );
};

export default OrderCard;
