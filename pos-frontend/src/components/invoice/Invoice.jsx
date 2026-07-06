import React, { useRef } from "react";
import { motion } from "framer-motion";
import { FaCheck } from "react-icons/fa6";

const Invoice = ({ orderInfo, setShowInvoice }) => {
  const invoiceRef = useRef(null);
  const handlePrint = () => {
    const printContent = invoiceRef.current.innerHTML;
    const WinPrint = window.open("", "", "width=900,height=650");

    WinPrint.document.write(`
            <html>
              <head>
                <title>Order Receipt</title>
                <style>
                  body { font-family: Arial, sans-serif; padding: 20px; color: #1e293b; }
                  .receipt-container { width: 300px; border: 1px solid #ddd; padding: 10px; }
                  h2 { text-align: center; }
                </style>
              </head>
              <body>
                ${printContent}
              </body>
            </html>
          `);

    WinPrint.document.close();
    WinPrint.focus();
    setTimeout(() => {
      WinPrint.print();
      WinPrint.close();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white text-slate-800 p-6 rounded-2xl shadow-2xl w-[400px] border border-gray-100 max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Receipt Content for Printing */}
        <div ref={invoiceRef} className="p-2 flex-1">
          {/* Receipt Header */}
          <div className="flex justify-center mb-4">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, type: "spring", stiffness: 150 }}
              className="w-12 h-12 rounded-full flex items-center justify-center shadow-md bg-emerald-500"
            >
              <FaCheck className="text-white text-lg" />
            </motion.div>
          </div>

          <h2 className="text-xl font-extrabold text-center text-slate-900 mb-1">Order Receipt</h2>
          <p className="text-slate-500 text-sm text-center mb-4">Thank you for your order!</p>

          {/* Order Details */}
          <div className="border-t border-dashed border-gray-200 py-3 text-xs text-slate-600 space-y-1">
            <div className="flex justify-between">
              <span className="font-semibold text-slate-500">Order ID:</span>
              <span className="font-mono text-slate-800">{Math.floor(new Date(orderInfo.orderDate).getTime())}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-slate-500">Name:</span>
              <span className="text-slate-800">{orderInfo.customerDetails.name || "Walk-in Customer"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-slate-500">Phone:</span>
              <span className="text-slate-800">{orderInfo.customerDetails.phone || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-slate-500">Guests:</span>
              <span className="text-slate-800">{orderInfo.customerDetails.guests}</span>
            </div>
          </div>

          {/* Items Summary */}
          <div className="border-t border-dashed border-gray-200 py-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Items Ordered</h3>
            <ul className="space-y-2">
              {orderInfo.items.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center text-xs text-slate-700"
                >
                  <span className="font-medium">
                    {item.name} <span className="text-slate-400 font-bold ml-1">x{item.quantity}</span>
                  </span>
                  <span className="font-semibold text-slate-900">PKR {item.price.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bills Summary */}
          <div className="border-t border-dashed border-gray-200 py-3 text-xs text-slate-600 space-y-1.5">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-semibold text-slate-800">PKR {orderInfo.bills.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (5.25%):</span>
              <span className="font-semibold text-slate-800">PKR {orderInfo.bills.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-slate-950 pt-1.5">
              <span>Grand Total:</span>
              <span className="text-emerald-600">PKR {orderInfo.bills.totalWithTax.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Details */}
          <div className="border-t border-dashed border-gray-200 pt-3 text-[11px] text-slate-500 space-y-1">
            <div className="flex justify-between">
              <span className="font-semibold">Payment Method:</span>
              <span className="text-slate-800 font-medium">{orderInfo.paymentMethod}</span>
            </div>
            {orderInfo.paymentMethod !== "Cash" && (
              <>
                <div className="flex justify-between">
                  <span className="font-semibold">Razorpay Order ID:</span>
                  <span className="text-slate-800 font-mono truncate max-w-[180px]" title={orderInfo.paymentData?.razorpay_order_id}>
                    {orderInfo.paymentData?.razorpay_order_id || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Razorpay Payment ID:</span>
                  <span className="text-slate-800 font-mono truncate max-w-[180px]" title={orderInfo.paymentData?.razorpay_payment_id}>
                    {orderInfo.paymentData?.razorpay_payment_id || "N/A"}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-4 border-t border-gray-100 pt-4 flex-shrink-0">
          <button
            onClick={handlePrint}
            className="flex-1 py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all text-center"
          >
            Print Receipt
          </button>
          <button
            onClick={() => setShowInvoice(false)}
            className="flex-1 py-2 px-4 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-xl text-xs transition-all text-center"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
