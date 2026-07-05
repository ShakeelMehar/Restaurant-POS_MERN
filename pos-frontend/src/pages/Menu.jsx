import React, { useEffect } from "react";

import { MdRestaurantMenu } from "react-icons/md";
import MenuContainer from "../components/menu/MenuContainer";
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
  const { role } = useSelector((state) => state.user);
  const isEditingOrder = Boolean(customerData.editingOrderId);

  return (
    <section className="min-h-[calc(100vh-5rem)] items-start bg-[#1f1f1f] pb-24 xl:flex xl:gap-3">
      {/* Left Div */}
      <div className="flex-[3] min-w-0">
        <div className="flex items-center justify-between px-10 py-4">
          <div className="flex items-center gap-4">
            <h1 className="text-[#f5f5f5] text-2xl font-bold tracking-wider">
              {isEditingOrder ? "Modify Order" : "Menu"}
            </h1>
            {["Admin", "Super Admin"].includes(role) && (
              <button
                onClick={() => navigate("/catalog?tab=categories")}
                className="rounded-lg bg-[#1a1a1a] px-4 py-2 text-sm font-semibold text-[#f5f5f5]"
              >
                Browse Catalog
              </button>
            )}
          </div>
          </div>

        <MenuContainer />
      </div>
      {/* Right Div */}
      <div className="mt-4 mr-3 flex-[1] self-start rounded-lg bg-base pt-2">
        <hr className="border-[#2a2a2a] border-t-2" />
        {/* Cart Items */}
        <CartInfo />
        <hr className="border-[#2a2a2a] border-t-2" />
        {/* Bills */}
        <Bill />
      </div>


    </section>
  );
};

export default Menu;
