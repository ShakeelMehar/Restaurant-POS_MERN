import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTotalPrice } from "../../redux/slices/cartSlice";
import {
  addOrder,
  createOrderRazorpay,
  updateTable,
  updateOrderById,
  verifyPaymentRazorpay,
} from "../../https/index";
import { enqueueSnackbar } from "notistack";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeAllItems } from "../../redux/slices/cartSlice";
import { removeCustomer } from "../../redux/slices/customerSlice";
import Invoice from "../invoice/Invoice";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaPrint, FaCheckCircle, FaMoneyBillWave, FaCreditCard, FaGlobe, FaTimes } from "react-icons/fa";

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
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
  const totalPriceWithTax = total + tax;
  const isEditingOrder = Boolean(customerData.editingOrderId);

  const [paymentMethod, setPaymentMethod] = useState(
    customerData.paymentMethod || ""
  );
  const [showInvoice, setShowInvoice] = useState(false);
  const [orderInfo, setOrderInfo] = useState();

  useEffect(() => {
    setPaymentMethod(customerData.paymentMethod || "");
  }, [customerData.paymentMethod, customerData.editingOrderId]);

  const buildOrderData = (extraFields = {}) => ({
    customerDetails: {
      name: customerData.customerName,
      phone: customerData.customerPhone,
      guests: customerData.guests,
    },
    orderStatus: isEditingOrder ? "In Progress" : "In Progress",
    bills: {
      total: total,
      tax: tax,
      totalWithTax: totalPriceWithTax,
    },
    items: cartData,
    table: customerData.table?.tableId,
    paymentMethod: paymentMethod,
    ...extraFields,
  });

  const handlePlaceOrder = async () => {
    if (cartData.length === 0) {
      enqueueSnackbar("Add at least one item to continue.", {
        variant: "warning",
      });
      return;
    }

    if (!paymentMethod) {
      enqueueSnackbar("Please select a payment method!", {
        variant: "warning",
      });

      return;
    }

    if (isEditingOrder) {
      const orderData = buildOrderData();
      updateExistingOrderMutation.mutate({
        orderId: customerData.editingOrderId,
        reqData: orderData,
      });
      return;
    }

    if (paymentMethod === "Online") {
      // load the script
      try {
        const res = await loadScript(
          "https://checkout.razorpay.com/v1/checkout.js"
        );

        if (!res) {
          enqueueSnackbar("Razorpay SDK failed to load. Are you online?", {
            variant: "warning",
          });
          return;
        }

        // create order

        const reqData = {
          amount: totalPriceWithTax.toFixed(2),
        };

        const { data } = await createOrderRazorpay(reqData);

        const options = {
          key: `${import.meta.env.VITE_RAZORPAY_KEY_ID}`,
          amount: data.order.amount,
          currency: data.order.currency,
          name: "RESTRO",
          description: "Secure Payment for Your Meal",
          order_id: data.order.id,
          handler: async function (response) {
            const verification = await verifyPaymentRazorpay(response);
            console.log(verification);
            enqueueSnackbar(verification.data.message, { variant: "success" });

            // Place the order
            const orderData = buildOrderData({
              paymentData: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
              },
            });

            setTimeout(() => {
              orderMutation.mutate(orderData);
            }, 1500);
          },
          prefill: {
            name: customerData.customerName,
            email: "",
            contact: customerData.customerPhone,
          },
          theme: { color: "#025cca" },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (error) {
        console.log(error);
        enqueueSnackbar("Payment Failed!", {
          variant: "error",
        });
      }
    } else {
      const orderData = buildOrderData();
      orderMutation.mutate(orderData);
    }
  };

  const handleOrderSaved = (data, options = { showInvoice: false }) => {
    setOrderInfo(data);
    queryClient.invalidateQueries({ queryKey: ["orders"] });

    const tableData = {
      status: "Booked",
      orderId: data._id,
      tableId: customerData.table?.tableId || data.table,
    };

    setTimeout(() => {
      tableUpdateMutation.mutate({
        tableData,
        redirectToOrders: !options.showInvoice,
      });
    }, 500);

    enqueueSnackbar(
      options.showInvoice ? "Order Placed!" : "Order updated successfully!",
      {
        variant: "success",
      }
    );

    if (options.showInvoice) {
      setShowInvoice(true);
    }
  };

  const orderMutation = useMutation({
    mutationFn: (reqData) => addOrder(reqData),
    onSuccess: (resData) => {
      const { data } = resData.data;
      handleOrderSaved(data, { showInvoice: true });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const updateExistingOrderMutation = useMutation({
    mutationFn: ({ orderId, reqData }) => updateOrderById(orderId, reqData),
    onSuccess: (resData) => {
      const { data } = resData.data;
      handleOrderSaved(data, { showInvoice: false });
    },
    onError: (error) => {
      console.log(error);
      enqueueSnackbar(
        error?.response?.data?.message || "Unable to update the order.",
        { variant: "error" }
      );
    },
  });

  const tableUpdateMutation = useMutation({
    mutationFn: ({ tableData }) => updateTable(tableData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
      dispatch(removeCustomer());
      dispatch(removeAllItems());
      if (variables.redirectToOrders) {
        navigate("/orders");
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between px-5 mt-2">
        <p className="text-xs text-muted-foreground font-medium mt-2">
          Items({cartData.length})
        </p>
        <h1 className="text-foreground text-md font-bold">
          PKR {total.toFixed(2)}
        </h1>
      </div>
      <div className="flex items-center justify-between px-5 mt-2">
        <p className="text-xs text-muted-foreground font-medium mt-2">Tax(5.25%)</p>
        <h1 className="text-foreground text-md font-bold">PKR {tax.toFixed(2)}</h1>
      </div>
      <div className="flex items-center justify-between px-5 mt-2">
        <p className="text-xs text-muted-foreground font-medium mt-2">
          Total With Tax
        </p>
        <h1 className="text-foreground text-md font-bold">
          PKR {totalPriceWithTax.toFixed(2)}
        </h1>
      </div>
      
      {/* Cart Action Footer */}
      <div className="flex flex-col gap-3 px-5 mt-6 pb-4">
        <div className="flex items-center gap-3 w-full">
          <button 
            onClick={() => dispatch(removeAllItems())}
            className="flex items-center justify-center gap-2 bg-secondary hover:bg-secondary text-foreground px-4 py-3 w-full rounded-lg text-foreground font-semibold transition-all">
            <FaPlus className="text-muted-foreground" /> New Order
          </button>
          <button 
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 bg-secondary hover:bg-secondary text-foreground px-4 py-3 w-full rounded-lg text-foreground font-semibold transition-all">
            <FaPrint className="text-muted-foreground" /> Print Order
          </button>
        </div>
        <button
          onClick={() => {
            if (cartData.length === 0) {
              enqueueSnackbar("Add at least one item to continue.", { variant: "warning" });
              return;
            }
            setShowCheckoutModal(true);
          }}
          className="flex items-center justify-center gap-3 bg-primary hover:brightness-110 px-4 py-4 w-full rounded-lg text-base font-bold text-xl transition-all shadow-[0_0_15px_rgba(246,177,0,0.2)]"
        >
          <FaCheckCircle /> {isEditingOrder ? "Update Order" : "Proceed to Checkout"}
        </button>
      </div>

      {showInvoice && (
        <Invoice orderInfo={orderInfo} setShowInvoice={setShowInvoice} />
      )}

      {/* Checkout Dialog Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-background w-[500px] rounded-2xl p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-foreground mb-6 border-b border-border pb-4">Checkout Review</h2>
            
            {/* Order Summary */}
            <div className="mb-6 bg-card rounded-lg p-4">
              <div className="flex justify-between text-muted-foreground mb-2">
                <span>Total Items:</span>
                <span className="text-foreground font-semibold">{cartData.length}</span>
              </div>
              <div className="flex justify-between text-muted-foreground mb-2">
                <span>Subtotal:</span>
                <span className="text-foreground font-semibold">PKR {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground mb-2">
                <span>Tax (5.25%):</span>
                <span className="text-foreground font-semibold">PKR {tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold mt-4 border-t border-border pt-4 text-foreground">
                <span>Total:</span>
                <span className="text-foreground">PKR {totalPriceWithTax.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground mb-3">Payment Method</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => setPaymentMethod("Cash")}
                  className={`flex-1 py-3 flex flex-col items-center justify-center gap-2 rounded-lg font-semibold border-2 transition-all ${
                    paymentMethod === "Cash" ? "bg-secondary text-foreground border-primary text-foreground" : "border-border text-muted-foreground hover:border-border"
                  }`}
                >
                  <FaMoneyBillWave size={24} />
                  Cash
                </button>
                <button
                  onClick={() => setPaymentMethod("Card")}
                  className={`flex-1 py-3 flex flex-col items-center justify-center gap-2 rounded-lg font-semibold border-2 transition-all ${
                    paymentMethod === "Card" ? "bg-secondary text-foreground border-primary text-foreground" : "border-border text-muted-foreground hover:border-border"
                  }`}
                >
                  <FaCreditCard size={24} />
                  Card
                </button>
                <button
                  onClick={() => setPaymentMethod("Online")}
                  className={`flex-1 py-3 flex flex-col items-center justify-center gap-2 rounded-lg font-semibold border-2 transition-all ${
                    paymentMethod === "Online" ? "bg-secondary text-foreground border-primary text-foreground" : "border-border text-muted-foreground hover:border-border"
                  }`}
                >
                  <FaGlobe size={24} />
                  Online
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-8">
              <button 
                onClick={() => setShowCheckoutModal(false)}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-secondary hover:bg-secondary text-foreground rounded-lg text-foreground font-bold transition-all"
              >
                <FaTimes /> Cancel
              </button>
              <button 
                onClick={() => {
                  if(!paymentMethod) {
                    enqueueSnackbar("Please select a payment method!", { variant: "warning" });
                    return;
                  }
                  setShowCheckoutModal(false);
                  handlePlaceOrder();
                }}
                disabled={!paymentMethod}
                className="flex-[2] flex items-center justify-center gap-2 py-4 bg-primary hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-bold text-xl transition-all shadow-lg"
              >
                <FaCheckCircle /> Cash Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Bill;
