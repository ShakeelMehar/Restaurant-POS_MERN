import React from "react";
import { FaCheckDouble, FaLongArrowAltRight } from "react-icons/fa";
import { FaCircle } from "react-icons/fa";
import { formatDateAndTime, getAvatarName } from "../../utils/index";

const OrderCard = ({ order, onManage }) => {
  return (
    <button
      onClick={() => onManage(order)}
      className="mb-4 w-full bg-card rounded-[14px] border border-[hsl(var(--border-strong))] shadow-[rgba(0,0,0,0.02)_0_0_0_1px,rgba(0,0,0,0.04)_0_2px_6px] p-5 text-left transition hover:-translate-y-[1px] hover:shadow-[rgba(0,0,0,0.02)_0_0_0_1px,rgba(0,0,0,0.08)_0_4px_12px] flex flex-col gap-4"
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0 h-12 w-12 rounded-[9999px] bg-foreground text-[hsl(var(--background))] flex items-center justify-center text-[18px] font-bold">
          {getAvatarName(order?.customerDetails?.name || "Unknown")}
        </div>
        
        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <div>
              <h1 className="text-foreground text-[16px] font-bold tracking-tight truncate">
                {order?.customerDetails?.name || "Unknown"}
              </h1>
              <p className="text-muted text-[14px] mt-0.5">#{String(Math.floor(new Date(order.orderDate).getTime())).slice(-6)} / Dine in</p>
              <p className="text-muted text-[14px] mt-0.5">
                Table <FaLongArrowAltRight className="inline mx-1 text-[10px]" /> {order.table?.tableNo || "N/A"}
              </p>
            </div>

            {/* Status */}
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              {order.orderStatus === "Ready" ? (
                <div className="flex flex-col items-end">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[9999px] border border-[hsl(var(--border-strong))] bg-card text-[13px] font-bold text-foreground">
                    <FaCheckDouble className="text-green-600" /> {order.orderStatus}
                  </span>
                  <p className="text-muted text-[13px] mt-1.5 flex items-center gap-1.5">
                    <FaCircle className="text-green-600 text-[8px]" /> Ready to serve
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-end">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[9999px] border border-[hsl(var(--border-strong))] bg-card text-[13px] font-bold text-foreground">
                    <FaCircle className="text-yellow-500 text-[10px]" /> {order.orderStatus}
                  </span>
                  <p className="text-muted text-[13px] mt-1.5 flex items-center gap-1.5">
                    <FaCircle className="text-yellow-500 text-[8px]" /> Preparing
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center text-[14px] text-muted mt-2">
        <p>{formatDateAndTime(order.orderDate)}</p>
        <p>{(order.items || []).length} Items</p>
      </div>
      
      <hr className="w-full border-t border-[hsl(var(--border-strong))] opacity-50" />
      
      <div className="flex items-center justify-between">
        <h1 className="text-foreground text-[16px] font-semibold">Total</h1>
        <div className="flex items-center gap-3">
          <p className="text-[14px] font-medium text-muted">Manage</p>
          <p className="text-foreground text-[16px] font-bold">
            PKR {order.bills?.totalWithTax?.toFixed(2) || "0.00"}
          </p>
        </div>
      </div>
    </button>
  );
};

export default OrderCard;
