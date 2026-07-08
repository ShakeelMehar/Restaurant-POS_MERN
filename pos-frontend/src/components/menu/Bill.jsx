import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTotalPrice } from "../../redux/slices/cartSlice";
import {
  addOrder, createOrderRazorpay, updateTable,
  updateOrderById, verifyPaymentRazorpay,
} from "../../https/index";
import { db } from "../../utils/db";
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
    orderType: customerData.orderType,
    bills: { total, tax, totalWithTax },
    items: cartData,
    table: customerData.table?.tableId,
    paymentMethod,
    ...extra,
  });

  const handleOrderSaved = (data, opts = { showInvoice: false }) => {
    setOrderInfo(data);
    queryClient.invalidateQueries({ queryKey: ["orders", "tables"] });
    
    // Table update is now handled on the backend for online syncs. 
    // We clear the frontend cart.
    dispatch(removeCustomer());
    dispatch(removeAllItems());
    
    if (!opts.showInvoice) {
      navigate("/orders");
    }
    
    enqueueSnackbar(opts.showInvoice ? "Order Placed!" : "Order saved!", { variant: "success" });
    if (opts.showInvoice) setShowInvoice(true);
  };

  const handleHoldOrder = () => {
    if (cartData.length === 0) { enqueueSnackbar("Add at least one item.", { variant: "warning" }); return; }
    
    // For hold orders, payment method isn't strictly required yet, but we'll default to Cash for the local queue
    orderMutation.mutate(buildOrderData({ orderStatus: "Held", paymentMethod: paymentMethod || "Cash" }), {
      onSuccess: () => {
        // handleOrderSaved will be called by orderMutation on success
      }
    });
  };

  const handlePlaceOrder = async () => {
    if (cartData.length === 0) { enqueueSnackbar("Add at least one item.", { variant: "warning" }); return; }
    if (!paymentMethod) { enqueueSnackbar("Select a payment method.", { variant: "warning" }); return; }
    if (!navigator.onLine && paymentMethod !== "Cash") { enqueueSnackbar("Only Cash is supported in offline mode.", { variant: "error" }); return; }
    
    if (isEditingOrder) {
      if (!navigator.onLine) { enqueueSnackbar("Cannot edit existing orders offline.", { variant: "error" }); return; }
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
          theme: { color: "#ff385c" },
        };
        new window.Razorpay(options).open();
      } catch { enqueueSnackbar("Payment Failed!", { variant: "error" }); }
    } else {
      orderMutation.mutate(buildOrderData());
    }
  };

  const orderMutation = useMutation({ 
    mutationFn: async (d) => {
      const queueOffline = async () => {
        const localOrder = { ...d, _id: `local-${Date.now()}` };
        await db.ordersQueue.add({
          payload: d,
          status: 'pending',
          createdAt: new Date().toISOString(),
        });
        return { data: { data: localOrder } };
      };

      if (!navigator.onLine) {
        return queueOffline();
      }
      
      try {
        return await addOrder(d);
      } catch (error) {
        // If it's a network error (no response from server), queue it instead of failing
        if (!error.response || error.code === 'ERR_NETWORK') {
          return queueOffline();
        }
        throw error;
      }
    }, 
    onSuccess: (r, variables) => handleOrderSaved(r.data.data, { showInvoice: variables.orderStatus !== "Held" }),
    networkMode: 'always'
  });
  const updateExistingOrderMutation = useMutation({ mutationFn: ({ orderId, reqData }) => updateOrderById(orderId, reqData), onSuccess: (r) => handleOrderSaved(r.data.data, { showInvoice: false }), onError: (e) => enqueueSnackbar(e?.response?.data?.message || "Update failed", { variant: "error" }) });

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
            <p className={`text-[13px] ${bold ? "text-foreground font-semibold" : "text-muted"}`}>
              {label}
            </p>
            <p className={`text-[14px] ${bold ? "text-foreground font-bold" : "text-foreground font-medium"}`}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="px-4 pt-2 pb-4 flex flex-col gap-2">
        <div className="flex gap-2">
          <button
            onClick={() => dispatch(removeAllItems())}
            className="flex-1 btn btn-secondary"
          >
            <FiPlus size={16} /> New
          </button>
          <button
            onClick={() => window.print()}
            className="flex-1 btn btn-secondary"
          >
            <FiPrinter size={16} /> Print
          </button>
        </div>
        <button
          onClick={() => {
            if (cartData.length === 0) { enqueueSnackbar("Add at least one item.", { variant: "warning" }); return; }
            setShowCheckoutModal(true);
          }}
          className="btn btn-primary w-full shadow-[rgba(0,0,0,0.02)_0_0_0_1px,rgba(0,0,0,0.04)_0_2px_6px]"
        >
          <FiCheckCircle size={18} />
          {isEditingOrder ? "Update Order" : "Proceed to Checkout"}
        </button>
        <button
          onClick={handleHoldOrder}
          disabled={orderMutation.isPending || isEditingOrder}
          className="btn btn-surface w-full"
        >
          Hold Order
        </button>
      </div>

      {showInvoice && <Invoice orderInfo={orderInfo} setShowInvoice={setShowInvoice} />}

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="modal-overlay">
          <div className="modal-content bg-card w-full sm:max-w-[480px] rounded-[14px] p-6 shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
              <h2 className="text-[20px] font-bold text-foreground">Checkout Review</h2>
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="flex items-center justify-center h-8 w-8 rounded-full bg-[hsl(var(--surface-soft))] text-foreground hover:bg-[hsl(var(--border))]"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Order Summary */}
            <div className="bg-[hsl(var(--surface-soft))] rounded-[14px] p-4 mb-6">
              {[
                { label: "Total Items",  value: cartData.length },
                { label: "Subtotal",     value: `PKR ${total.toFixed(2)}` },
                { label: "Tax (5.25%)", value: `PKR ${tax.toFixed(2)}` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-[15px] mb-2">
                  <span className="text-muted">{label}</span>
                  <span className="text-foreground font-medium">{value}</span>
                </div>
              ))}
              <div className="flex justify-between text-[16px] font-bold pt-3 border-t border-border mt-3">
                <span className="text-foreground">Grand Total</span>
                <span className="text-primary">PKR {totalWithTax.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mb-8">
              <h3 className="text-[14px] font-semibold text-foreground mb-4">
                Payment Method
              </h3>
              <div className="flex gap-3">
                {paymentMethods.map(({ id, label, icon: Icon }) => {
                  const isSelected = paymentMethod === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setPaymentMethod(id)}
                      className={`flex-1 py-3 flex flex-col items-center justify-center gap-2 rounded-[8px] font-medium text-[15px] transition-colors border ${
                        isSelected
                          ? "border-foreground bg-foreground text-[hsl(var(--background))]"
                          : "border-border bg-card text-foreground hover:border-foreground"
                      }`}
                    >
                      <Icon size={20} />
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="btn btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!paymentMethod) { enqueueSnackbar("Select a payment method.", { variant: "warning" }); return; }
                  setShowCheckoutModal(false);
                  handlePlaceOrder();
                }}
                disabled={!paymentMethod || orderMutation.isPending || updateExistingOrderMutation.isPending}
                className="btn btn-primary flex-[2]"
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
