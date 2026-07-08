import React, { useEffect, useRef } from "react";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { FiPlus, FiMinus } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { removeItem, addItems, removeAllItems } from "../../redux/slices/cartSlice";
import { setOrderType } from "../../redux/slices/customerSlice";
import TabGroup from "../shared/TabGroup";

const CartInfo = () => {
  const cartData = useSelector((state) => state.cart);
  const orderType = useSelector((state) => state.customer.orderType);
  const scrollRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [cartData]);

  const handleIncrement = (item) =>
    dispatch(addItems({ ...item, quantity: 1, price: item.pricePerQuantity }));

  const handleDecrement = (item) => {
    if (item.quantity > 1) {
      dispatch(addItems({ ...item, quantity: -1, price: -item.pricePerQuantity }));
    } else {
      dispatch(removeItem(item.id));
    }
  };

  return (
    <div className="px-4 py-4 h-full flex flex-col bg-card">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-[16px] font-bold text-foreground tracking-tight">Current Order</h2>
          {cartData.length > 0 && (
            <p className="text-[12px] text-muted mt-0.5 font-medium">
              {cartData.length} {cartData.length === 1 ? "item" : "items"} added
            </p>
          )}
        </div>
        <button
          onClick={() => dispatch(removeAllItems())}
          title="Clear Order"
          className="flex items-center justify-center h-9 w-9 rounded-full bg-[hsl(var(--surface-soft))] text-muted hover:text-error hover:bg-[hsl(var(--border))] transition-colors"
        >
          <RiDeleteBin2Fill size={16} />
        </button>
      </div>

      {/* Order Type Tabs */}
      <div className="mb-4">
        <TabGroup
          tabs={[
            { id: "Dine In",  label: "Dine In" },
            { id: "Takeaway", label: "Takeaway" },
            { id: "Delivery", label: "Delivery" },
          ]}
          activeTab={orderType}
          onTabChange={(tab) => dispatch(setOrderType(tab))}
          fullWidth
        />
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto hide-scrollbar space-y-2 min-h-0" ref={scrollRef}>
        {cartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 py-12">
            <span className="text-4xl">🛒</span>
            <p className="text-[15px] font-semibold text-muted">Your cart is empty</p>
            <p className="text-[13px] text-[hsl(var(--muted-soft))]">Add items from the menu to get started</p>
          </div>
        ) : (
          cartData.map((item) => {
            let itemName = item.name;
            let variantName = "Regular";
            if (item.name.includes("(")) {
              const parts = item.name.split("(");
              itemName = parts[0].trim();
              variantName = parts[1].replace(")", "").trim();
            }

            return (
              <div
                key={item.id}
                className="flex items-start justify-between gap-3 bg-card rounded-[14px] px-3 py-3 border border-[hsl(var(--border-strong))] shadow-[rgba(0,0,0,0.02)_0_0_0_1px,rgba(0,0,0,0.04)_0_2px_6px] transition-colors"
              >
                {/* Text (Left) */}
                <div className="flex-1 min-w-0 py-0.5 flex flex-col justify-between">
                  <p className="text-foreground font-bold text-[14px] leading-snug break-words">{itemName}</p>
                  <p className="text-muted text-[13px] mt-1 leading-snug">{variantName}</p>
                </div>

                {/* Price & Stepper (Right) */}
                <div className="flex flex-col items-end justify-between gap-3 flex-shrink-0 py-0.5">
                  <p className="text-foreground text-[14px] font-bold">PKR {item.price}</p>
                  <div className="flex items-center bg-card rounded-[9999px] border border-[hsl(var(--border-strong))] overflow-hidden shadow-[rgba(0,0,0,0.02)_0_0_0_1px]">
                    <button
                      onClick={() => handleDecrement(item)}
                      className="px-2.5 py-1 text-muted hover:text-foreground hover:bg-[hsl(var(--surface-soft))] transition-colors"
                    >
                      <FiMinus size={14} />
                    </button>
                    <span className="text-foreground font-bold text-[14px] px-1 min-w-[24px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleIncrement(item)}
                      className="px-2.5 py-1 text-muted hover:text-foreground hover:bg-[hsl(var(--surface-soft))] transition-colors"
                    >
                      <FiPlus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CartInfo;
