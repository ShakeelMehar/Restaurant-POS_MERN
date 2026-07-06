import React, { useEffect, useRef, useState } from "react";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { FiPlus, FiMinus } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { removeItem, addItems, removeAllItems } from "../../redux/slices/cartSlice";
import TabGroup from "../shared/TabGroup";

const CartInfo = () => {
  const cartData = useSelector((state) => state.cart);
  const scrollRef = useRef();
  const dispatch = useDispatch();
  const [orderType, setOrderType] = useState("Dine In");

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
    <div className="px-4 py-3 h-full flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-lg font-extrabold text-foreground tracking-tight">Current Order</h2>
          {cartData.length > 0 && (
            <p className="text-xs text-muted-foreground mt-0.5 font-medium">
              {cartData.length} {cartData.length === 1 ? "item" : "items"} added
            </p>
          )}
        </div>
        <button
          onClick={() => dispatch(removeAllItems())}
          title="Clear Order"
          className="flex items-center justify-center h-8 w-8 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:border-red-500/40 transition-all duration-200"
        >
          <RiDeleteBin2Fill size={15} />
        </button>
      </div>

      {/* Order Type Tabs */}
      <div className="mb-5">
        <TabGroup
          tabs={[
            { id: "Dine In",  label: "Dine In" },
            { id: "Takeaway", label: "Takeaway" },
            { id: "Delivery", label: "Delivery" },
          ]}
          activeTab={orderType}
          onTabChange={setOrderType}
          fullWidth
        />
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto hide-scrollbar space-y-2.5 min-h-0" ref={scrollRef}>
        {cartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 py-10">
            <span className="text-5xl">🛒</span>
            <p className="text-sm font-semibold text-muted-foreground">Your cart is empty</p>
            <p className="text-xs text-muted-foreground/70">Add items from the menu to get started</p>
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
                className="flex items-center gap-2 bg-card rounded-2xl px-3 py-2.5 border border-border hover:border-primary/20 transition-all duration-200 shadow-sm"
              >
                {/* Emoji avatar */}
                <div className="flex-shrink-0 h-12 w-12 bg-secondary rounded-xl flex items-center justify-center border border-border text-lg">
                  🍲
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-foreground font-bold text-sm leading-tight truncate">{itemName}</p>
                  <p className="text-muted-foreground text-xs mt-0.5">{variantName}</p>
                  <p className="text-primary text-sm font-extrabold mt-1">Rs. {item.pricePerQuantity}</p>
                </div>

                {/* Qty stepper */}
                <div className="flex flex-col items-center bg-secondary rounded-full border border-border overflow-hidden flex-shrink-0">
                  <button
                    onClick={() => handleIncrement(item)}
                    className="px-2.5 py-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <FiPlus size={11} />
                  </button>
                  <span className="text-foreground font-extrabold text-[13px] px-1 leading-none py-0.5 min-w-[20px] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleDecrement(item)}
                    className="px-2.5 py-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <FiMinus size={11} />
                  </button>
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
