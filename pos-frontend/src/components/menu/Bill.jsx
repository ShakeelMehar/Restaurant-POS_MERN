import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTotalPrice } from "../../redux/slices/cartSlice";
import {
  addOrder, createOrderRazorpay, updateTable,
  updateOrderById, verifyPaymentRazorpay,
} from "../../https/index";
import { enqueueSnackbar } from "notistack";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeAllItems } from "../../redux/slices/cartSlice";
import { removeCustomer } from "../../redux/slices/customerSlice";
import Invoice from "../invoice/Invoice";
import { useNavigate } from "react-router-dom";
import {
  FiPlus, FiPrinter, FiCheckCircle,
  FiDollarSign, FiCreditCard, FiGlobe, FiX, FiLoader,
} from "react-icons/fi";

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const Bill = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const customerData = useSelector((state) => state.customer);
  const cartData = useSelector((state) => state.cart);
  const total = useSelector(getTotalPrice);
  const taxRate = 5.25;
  const tax = (total * taxRate) / 100;
  const totalWithTax = total + tax;
  const isEditingOrder = Boolean(customerData.editingOrderId);
  const [paymentMethod, setPaymentMethod] = useState(customerData.paymentMethod || "");
  const [showInvoice, setShowInvoice] = useState(false);
  const [orderInfo, setOrderInfo] = useState();
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  useEffect(() => {
    setPaymentMethod(customerData.paymentMethod || "");
  }, [customerData.paymentMethod, customerData.editingOrderId]);

  const buildOrderData = (extra = {}) => ({
    customerDetails: {
      name: customerData.customerName,
      phone: customerData.customerPhone,
      guests: customerData.guests,
    },
    orderStatus: "In Progress",
    bills: { total, tax, totalWithTax },
    items: cartData,
    table: customerData.table?.tableId,
    paymentMethod,
    ...extra,
  });

  const handleOrderSaved = (data, opts = { showInvoice: false }) => {
    setOrderInfo(data);
    queryClient.invalidateQueries({ queryKey: ["orders"] });
    const tableData = { status: "Booked", orderId: data._id, tableId: customerData.table?.tableId || data.table };
    setTimeout(() => tableUpdateMutation.mutate({ tableData, redirectToOrders: !opts.showInvoice }), 500);
    enqueueSnackbar(opts.showInvoice ? "Order Placed!" : "Order updated!", { variant: "success" });
    if (opts.showInvoice) setShowInvoice(true);
  };

  const handlePlaceOrder = async () => {
    if (cartData.length === 0) { enqueueSnackbar("Add at least one item.", { variant: "warning" }); return; }
    if (!paymentMethod) { enqueueSnackbar("Select a payment method.", { variant: "warning" }); return; }
    if (isEditingOrder) {
      updateExistingOrderMutation.mutate({ orderId: customerData.editingOrderId, reqData: buildOrderData() });
      return;
    }
    if (paymentMethod === "Online") {
      try {
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
        if (!res) { enqueueSnackbar("Razorpay failed to load.", { variant: "warning" }); return; }
        const { data } = await createOrderRazorpay({ amount: totalWithTax.toFixed(2) });
        const options = {
          key: `${import.meta.env.VITE_RAZORPAY_KEY_ID}`,
          amount: data.order.amount, currency: data.order.currency,
          name: "RESTRO", description: "Secure Payment",
          order_id: data.order.id,
          handler: async (response) => {
            const verification = await verifyPaymentRazorpay(response);
            enqueueSnackbar(verification.data.message, { variant: "success" });
            setTimeout(() => orderMutation.mutate(buildOrderData({ paymentData: { razorpay_order_id: response.razorpay_order_id, razorpay_payment_id: response.razorpay_payment_id } })), 1500);
          },
          prefill: { name: customerData.customerName, contact: customerData.customerPhone },
          theme: { color: "#2563EB" },
        };
        new window.Razorpay(options).open();
      } catch { enqueueSnackbar("Payment Failed!", { variant: "error" }); }
    } else {
      orderMutation.mutate(buildOrderData());
    }
  };

  const orderMutation = useMutation({ mutationFn: (d) => addOrder(d), onSuccess: (r) => handleOrderSaved(r.data.data, { showInvoice: true }) });
  const updateExistingOrderMutation = useMutation({ mutationFn: ({ orderId, reqData }) => updateOrderById(orderId, reqData), onSuccess: (r) => handleOrderSaved(r.data.data, { showInvoice: false }), onError: (e) => enqueueSnackbar(e?.response?.data?.message || "Update failed", { variant: "error" }) });
  const tableUpdateMutation = useMutation({ mutationFn: ({ tableData }) => updateTable(tableData), onSuccess: (_, vars) => { queryClient.invalidateQueries({ queryKey: ["tables"] }); dispatch(removeCustomer()); dispatch(removeAllItems()); if (vars.redirectToOrders) navigate("/orders"); } });

  const paymentMethods = [
    { id: "Cash",   label: "Cash",   icon: FiDollarSign },
    { id: "Card",   label: "Card",   icon: FiCreditCard },
    { id: "Online", label: "Online", icon: FiGlobe },
  ];

  return (
    <>
      {/* Bill Summary */}
      <div className="px-4 pt-4 pb-2 space-y-1.5">
        {[
          { label: `Items (${cartData.length})`,  value: `PKR ${total.toFixed(2)}` },
          { label: "Tax (5.25%)",                  value: `PKR ${tax.toFixed(2)}` },
          { label: "Total With Tax", bold: true,   value: `PKR ${totalWithTax.toFixed(2)}` },
        ].map(({ label, value, bold }) => (
          <div key={label} className="flex items-center justify-between">
            <p className={`text-xs font-semibold ${bold ? "text-foreground" : "text-muted-foreground"}`}>
              {label}
            </p>
            <p className={`font-extrabold ${bold ? "text-primary text-sm" : "text-foreground text-sm"}`}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="px-4 pt-4 pb-5 flex flex-col gap-2">
        <div className="flex gap-2">
          <button
            onClick={() => dispatch(removeAllItems())}
            className="flex-1 flex items-center justify-center gap-2 bg-secondary hover:bg-muted border border-border text-foreground text-sm font-bold rounded-xl py-2 transition-all duration-200"
          >
            <FiPlus size={14} className="text-muted-foreground" /> New Order
          </button>
          <button
            onClick={() => window.print()}
            className="flex-1 flex items-center justify-center gap-2 bg-secondary hover:bg-muted border border-border text-foreground text-sm font-bold rounded-xl py-2 transition-all duration-200"
          >
            <FiPrinter size={14} className="text-muted-foreground" /> Print
          </button>
        </div>
        <button
          onClick={() => {
            if (cartData.length === 0) { enqueueSnackbar("Add at least one item.", { variant: "warning" }); return; }
            setShowCheckoutModal(true);
          }}
          className="flex items-center justify-center gap-2.5 bg-gradient-to-r from-primary to-blue-500 hover:from-blue-500 hover:to-primary text-primary-foreground font-extrabold text-sm rounded-xl py-2 transition-all duration-200 shadow-md shadow-primary/30 hover:shadow-lg hover:shadow-primary/40 active:scale-[0.98]"
        >
          <FiCheckCircle size={18} />
          {isEditingOrder ? "Update Order" : "Proceed to Checkout"}
        </button>
      </div>

      {showInvoice && <Invoice orderInfo={orderInfo} setShowInvoice={setShowInvoice} />}

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-card w-full sm:max-w-[480px] sm:rounded-2xl rounded-t-3xl border border-border shadow-2xl p-4 animate-slide-up">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
              <h2 className="text-lg font-extrabold text-foreground">Checkout Review</h2>
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="flex items-center justify-center h-8 w-8 rounded-lg bg-secondary border border-border text-muted-foreground hover:text-foreground transition-all"
              >
                <FiX size={16} />
              </button>
            </div>

            {/* Order Summary */}
            <div className="bg-secondary/50 rounded-xl p-3 mb-5 space-y-2 border border-border">
              {[
                { label: "Total Items",  value: cartData.length },
                { label: "Subtotal",     value: `PKR ${total.toFixed(2)}` },
                { label: "Tax (5.25%)", value: `PKR ${tax.toFixed(2)}` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium">{label}</span>
                  <span className="text-foreground font-bold">{value}</span>
                </div>
              ))}
              <div className="flex justify-between text-[15px] font-extrabold pt-2 border-t border-border mt-2">
                <span className="text-foreground">Grand Total</span>
                <span className="text-primary">PKR {totalWithTax.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">
                Payment Method
              </h3>
              <div className="flex gap-2.5">
                {paymentMethods.map(({ id, label, icon: Icon }) => {
                  const isSelected = paymentMethod === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setPaymentMethod(id)}
                      className={`flex-1 py-2 flex flex-col items-center justify-center gap-2 rounded-xl font-bold text-sm border-2 transition-all duration-200 ${
                        isSelected
                          ? "bg-primary/10 border-primary text-primary shadow-md shadow-primary/20"
                          : "bg-secondary border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      }`}
                    >
                      <Icon size={18} />
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-secondary hover:bg-muted border border-border text-foreground font-bold rounded-xl transition-all"
              >
                <FiX size={16} /> Cancel
              </button>
              <button
                onClick={() => {
                  if (!paymentMethod) { enqueueSnackbar("Select a payment method.", { variant: "warning" }); return; }
                  setShowCheckoutModal(false);
                  handlePlaceOrder();
                }}
                disabled={!paymentMethod || orderMutation.isPending || updateExistingOrderMutation.isPending}
                className="flex-[2] flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-primary to-blue-500 hover:from-blue-500 hover:to-primary text-primary-foreground font-extrabold rounded-xl transition-all shadow-md shadow-primary/30 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {orderMutation.isPending || updateExistingOrderMutation.isPending ? (
                  <><FiLoader size={18} className="animate-spin" /> Processing…</>
                ) : (
                  <><FiCheckCircle size={18} /> Cash Out</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Bill;
