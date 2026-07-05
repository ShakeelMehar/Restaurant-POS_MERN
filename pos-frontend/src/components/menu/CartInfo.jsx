import React, { useEffect, useRef, useState } from "react";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { FaPlus, FaMinus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { removeItem, addItems, removeAllItems } from "../../redux/slices/cartSlice";

const CartInfo = () => {
  const cartData = useSelector((state) => state.cart);
  const scrolLRef = useRef();
  const dispatch = useDispatch();

  // Local state for the toggle
  const [orderType, setOrderType] = useState("Dine In");

  useEffect(() => {
    if(scrolLRef.current){
      scrolLRef.current.scrollTo({
        top: scrolLRef.current.scrollHeight,
        behavior: "smooth"
      })
    }
  },[cartData]);

  const handleIncrement = (item) => {
    dispatch(addItems({ ...item, quantity: 1, price: item.pricePerQuantity }));
  }

  const handleDecrement = (item) => {
    if (item.quantity > 1) {
      dispatch(addItems({ ...item, quantity: -1, price: -item.pricePerQuantity }));
    } else {
      dispatch(removeItem(item.id));
    }
  }

  return (
    <div className="px-6 py-4 bg-base rounded-t-xl h-full">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-2xl text-[#f5f5f5] font-bold tracking-wide">
            Current Order
          </h1>
          {cartData.length > 0 && <p className="text-[#ababab] font-medium text-sm mt-1">Order #{Math.floor(Math.random() * 10000)}</p>}
        </div>
        <button 
          onClick={() => dispatch(removeAllItems())} 
          className="p-2 text-red-400 hover:text-red-500 transition-colors bg-[#2a2a2a] rounded-md shadow-sm border border-red-500/20 hover:border-red-500/40"
          title="Clear Order"
        >
          <RiDeleteBin2Fill size={20} />
        </button>
      </div>

      <div className="flex bg-[#1a1a1a] rounded-xl p-1 mb-6 border border-[#2a2a2a]">
        {["Dine In", "Takeaway", "Delivery"].map((type) => (
          <button 
            key={type}
            onClick={() => setOrderType(type)}
            className={`flex-1 py-2.5 rounded-lg font-bold text-[15px] transition-colors ${
              orderType === type 
                ? "bg-[#2a2a2a] text-[#f5f5f5] shadow-md border border-[#383838]" 
                : "text-[#ababab] hover:text-[#f5f5f5]"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="overflow-y-scroll scrollbar-hide h-[450px]" ref={scrolLRef} >
        {cartData.length === 0 ? (
          <p className="text-[#ababab] text-sm flex justify-center items-center h-full italic">Your cart is empty.</p>
        ) : cartData.map((item) => {
          
          // Try to extract variant details gracefully if it's structured like "Chicken Biryani (Half)"
          let itemName = item.name;
          let variantName = "Regular";
          if (item.name.includes("(")) {
            const parts = item.name.split("(");
            itemName = parts[0].trim();
            variantName = parts[1].replace(")", "").trim();
          }

          return (
            <div key={item.id} className="bg-[#1a1a1a] rounded-2xl px-4 py-4 mb-3 shadow-[0_2px_10px_rgba(0,0,0,0.2)] border border-[#2a2a2a] flex items-center justify-between hover:border-[#383838] transition-colors">
              
              <div className="flex items-center gap-4">
                {/* Image Placeholder */}
                <div className="h-16 w-16 bg-[#2a2a2a] rounded-xl flex items-center justify-center border border-[#383838]">
                  <span className="text-2xl">🍲</span>
                </div>
                
                {/* Text Content */}
                <div className="flex flex-col justify-center">
                  <h1 className="text-[#f5f5f5] font-bold text-[16px] leading-tight mb-0.5">
                    {itemName}
                  </h1>
                  <p className="text-[#ababab] text-xs font-medium mb-1">Variant: {variantName}</p>
                  <p className="text-primary text-sm font-extrabold">Rs. {item.pricePerQuantity}</p>
                </div>
              </div>

              {/* Vertical Counter Pill */}
              <div className="flex flex-col items-center bg-[#2a2a2a] rounded-full border border-[#383838] overflow-hidden shadow-inner">
                <button 
                  onClick={() => handleIncrement(item)}
                  className="px-3 py-2 text-[#ababab] hover:bg-[#383838] hover:text-[#f5f5f5] transition-colors"
                >
                  <FaPlus size={10} />
                </button>
                <span className="text-[#f5f5f5] font-bold text-sm py-1">{item.quantity}</span>
                <button 
                  onClick={() => handleDecrement(item)}
                  className="px-3 py-2 text-[#ababab] hover:bg-[#383838] hover:text-[#f5f5f5] transition-colors"
                >
                  <FaMinus size={10} />
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CartInfo;
