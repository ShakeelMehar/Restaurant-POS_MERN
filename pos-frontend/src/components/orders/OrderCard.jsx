import React from "react";
import { FaCheckDouble, FaLongArrowAltRight } from "react-icons/fa";
import { FaCircle } from "react-icons/fa";
import { formatDateAndTime, getAvatarName } from "../../utils/index";

const OrderCard = ({ order, onManage }) => {
  return (
    <button
      onClick={() => onManage(order)}
      className="mb-4 w-full rounded-lg bg-card p-4 text-left transition hover:bg-secondary/80"
    >
      <div className="flex items-center gap-5">
        <div className="rounded-lg bg-primary text-primary-foreground p-3 text-xl font-bold">
          {getAvatarName(order.customerDetails.name)}
        </div>
        <div className="flex items-center justify-between w-[100%]">
          <div className="flex flex-col items-start gap-1">
            <h1 className="text-foreground text-lg font-semibold tracking-wide">
              {order.customerDetails.name}
            </h1>
            <p className="text-muted-foreground text-sm">#{Math.floor(new Date(order.orderDate).getTime())} / Dine in</p>
            <p className="text-muted-foreground text-sm">Table <FaLongArrowAltRight className="text-muted-foreground ml-2 inline" /> {order.table?.tableNo || "N/A"}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            {order.orderStatus === "Ready" ? (
              <>
                <p className="text-green-600 bg-success/20 px-2 py-1 rounded-lg">
                  <FaCheckDouble className="inline mr-2" /> {order.orderStatus}
                </p>
                <p className="text-muted-foreground text-sm">
                  <FaCircle className="inline mr-2 text-green-600" /> Ready to
                  serve
                </p>
              </>
            ) : (
              <>
                <p className="text-yellow-600 bg-yellow-500/20 px-2 py-1 rounded-lg">
              <FaCircle className="inline mr-2" /> {order.orderStatus}
                </p>
                <p className="text-muted-foreground text-sm">
                  <FaCircle className="inline mr-2 text-yellow-600" /> Preparing
                  your order
                </p>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-4 text-muted-foreground">
        <p>{formatDateAndTime(order.orderDate)}</p>
        <p>{(order.items || []).length} Items</p>
      </div>
      <hr className="w-full mt-4 border-t-1 border-gray-500" />
      <div className="flex items-center justify-between mt-4">
        <h1 className="text-foreground text-lg font-semibold">Total</h1>
        <div className="flex items-center gap-4">
          <p className="text-sm font-medium text-muted-foreground">Manage</p>
          <p className="text-foreground text-lg font-semibold">
            PKR {order.bills?.totalWithTax?.toFixed(2) || "0.00"}
          </p>
        </div>
      </div>
    </button>
  );
};

export default OrderCard;
