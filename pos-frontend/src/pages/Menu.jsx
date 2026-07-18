import React, { useEffect, useState } from "react";
import MenuContainer from "../components/menu/MenuContainer";
import CartInfo from "../components/menu/CartInfo";
import Bill from "../components/menu/Bill";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiBookOpen, FiShoppingCart } from "react-icons/fi";
import MobileCartDrawer from "../components/menu/MobileCartDrawer";
import { ROLES } from "../constants/roles";

const Menu = () => {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "POS | Menu";
    }, []);

    const customerData = useSelector((state) => state.customer);
    const cartData = useSelector((state) => state.cart);
    const { role } = useSelector((state) => state.user);
    const isEditingOrder = Boolean(customerData.editingOrderId);
    
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Calculate totals for the FAB
    const totalItems = cartData.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = cartData.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return (
        <section className="h-[calc(100dvh-64px)] overflow-hidden bg-background flex flex-col lg:flex-row lg:gap-0 relative">
            {/* ── LEFT: Menu ── */}
            <div className="flex-[3] min-w-0 flex flex-col border-r border-border">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
                    <div className="flex items-center gap-3">
                        <h1 className="text-[18px] font-bold text-foreground tracking-tight">
                            {isEditingOrder ? "Modify Order" : "Menu"}
                        </h1>
                        {isEditingOrder && (
                            <span className="badge">Editing</span>
                        )}
                    </div>
                    {[ROLES.ADMIN, ROLES.SUPER_ADMIN].includes(role) && (
                        <button
                            onClick={() => navigate("/catalog?tab=categories")}
                            className="btn btn-secondary !h-8 !px-3 !text-[13px]">
                            <FiBookOpen size={14} />
                            Browse Catalog
                        </button>
                    )}
                </div>
                <MenuContainer />
            </div>

            {/* ── RIGHT: Cart (Desktop) ── */}
            <div className="hidden lg:flex w-[320px] flex-shrink-0 flex-col bg-card shadow-[-2px_0_8px_rgba(0,0,0,0.02)] border-l border-border">
                <div className="flex-1 overflow-hidden">
                    <CartInfo />
                </div>
                <div className="border-t border-border bg-card">
                    <Bill />
                </div>
            </div>

            {/* ── MOBILE CART FAB ── */}
            {totalItems > 0 && (
                <div className="lg:hidden absolute bottom-4 left-4 right-4 z-40">
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="w-full bg-primary text-white rounded-2xl shadow-xl p-4 flex items-center justify-between active:scale-[0.98] transition-transform"
                    >
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <FiShoppingCart size={24} />
                                <span className="absolute -top-2 -right-2 bg-white text-primary text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-primary">
                                    {totalItems}
                                </span>
                            </div>
                            <span className="font-bold text-[16px]">View Order</span>
                        </div>
                        <span className="font-extrabold text-[16px]">PKR {totalPrice.toFixed(2)}</span>
                    </button>
                </div>
            )}

            {/* ── MOBILE CART DRAWER ── */}
            <MobileCartDrawer 
                isOpen={isCartOpen} 
                onClose={() => setIsCartOpen(false)} 
            />
        </section>
    );
};

export default Menu;
