import React, { useEffect } from "react";
import MenuContainer from "../components/menu/MenuContainer";
import CartInfo from "../components/menu/CartInfo";
import Bill from "../components/menu/Bill";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiBookOpen } from "react-icons/fi";

const Menu = () => {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "POS | Menu";
    }, []);

    const customerData = useSelector((state) => state.customer);
    const { role } = useSelector((state) => state.user);
    const isEditingOrder = Boolean(customerData.editingOrderId);

    return (
        <section className="h-[calc(100vh-64px)] overflow-hidden bg-background lg:flex lg:gap-0">
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
                    {["Admin", "Super Admin"].includes(role) && (
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

            {/* ── RIGHT: Cart ── */}
            <div className="lg:w-[320px] lg:flex-shrink-0 flex flex-col bg-card shadow-[-2px_0_8px_rgba(0,0,0,0.02)]">
                <div className="flex-1 overflow-hidden">
                    <CartInfo />
                </div>
                <div className="border-t border-border bg-card">
                    <Bill />
                </div>
            </div>
        </section>
    );
};

export default Menu;
