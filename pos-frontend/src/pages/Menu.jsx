import React, { useEffect } from "react";
import BottomNav from "../components/shared/BottomNav";
import BackButton from "../components/shared/BackButton";
import { MdRestaurantMenu } from "react-icons/md";
import MenuContainer from "../components/menu/MenuContainer";
import CustomerInfo from "../components/menu/CustomerInfo";
import CartInfo from "../components/menu/CartInfo";
import Bill from "../components/menu/Bill";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Menu = () => {
  const navigate = useNavigate();

    useEffect(() => {
      document.title = "POS | Menu"
    }, [])

  const customerData = useSelector((state) => state.customer);
  const isEditingOrder = Boolean(customerData.editingOrderId);

  return (
    <section className="min-h-[calc(100vh-5rem)] items-start bg-[#1f1f1f] pb-24 xl:flex xl:gap-3">
      {/* Left Div */}
      <div className="flex-[3] min-w-0">
        <div className="flex items-center justify-between px-10 py-4">
          <div className="flex items-center gap-4">
            <BackButton />
            <h1 className="text-[#f5f5f5] text-2xl font-bold tracking-wider">
              {isEditingOrder ? "Modify Order" : "Menu"}
            </h1>
            <button
              onClick={() => navigate("/catalog?tab=categories")}
              className="rounded-lg bg-[#1a1a1a] px-4 py-2 text-sm font-semibold text-[#f5f5f5]"
            >
              Browse Catalog
            </button>
          </div>
          <div className="flex items-center justify-around gap-4">
            <div className="flex items-center gap-3 cursor-pointer">
              <MdRestaurantMenu className="text-[#f5f5f5] text-4xl" />
              <div className="flex flex-col items-start">
                <h1 className="text-md text-[#f5f5f5] font-semibold tracking-wide">
                  {customerData.customerName || "Customer Name"}
                </h1>
                <p className="text-xs text-[#ababab] font-medium">
                  Table : {customerData.table?.tableNo || "N/A"}
                </p>
                {isEditingOrder && (
                  <p className="text-xs font-semibold text-[#F6B100]">
                    Editing existing order
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <MenuContainer />
      </div>
      {/* Right Div */}
      <div className="mt-4 mr-3 flex-[1] self-start rounded-lg bg-[#1a1a1a] pt-2">
        {/* Customer Info */}
        <CustomerInfo />
        <hr className="border-[#2a2a2a] border-t-2" />
        {/* Cart Items */}
        <CartInfo />
        <hr className="border-[#2a2a2a] border-t-2" />
        {/* Bills */}
        <Bill />
      </div>

      <BottomNav />
    </section>
  );
};

export default Menu;
