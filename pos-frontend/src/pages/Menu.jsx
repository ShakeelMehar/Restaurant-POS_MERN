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
        <section className="min-h-[calc(100vh-4rem)] bg-background  xl:flex xl:gap-0">
            {/* ── LEFT: Menu ── */}
            <div className="flex-[3] min-w-0 flex flex-col">
                <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card/50">
                    <div className="flex items-center gap-2">
                        <h1 className="text-lg font-extrabold text-foreground tracking-tight">
                            {isEditingOrder ? "✏️ Modify Order" : "🍽️ Menu"}
                        </h1>
                        {isEditingOrder && (
                            <span className="badge badge-progress">Editing</span>
                        )}
                    </div>
                    {["Admin", "Super Admin"].includes(role) && (
                        <button
                            onClick={() => navigate("/catalog?tab=categories")}
                            className="flex items-center gap-2 rounded-xl bg-secondary hover:bg-muted border border-border px-3 py-2 text-sm font-bold text-foreground transition-all duration-200 hover:border-primary/30">
                            <FiBookOpen size={14} />
                            Browse Catalog
                        </button>
                    )}
                </div>
                <MenuContainer />
            </div>

            {/* ── RIGHT: Cart ── */}
            <div className="xl:w-[320px] xl:flex-shrink-0 xl:border-l border-border flex flex-col bg-background">
                <div className="flex-1 overflow-hidden">
                    <CartInfo />
                </div>
                <div className="border-t border-border bg-card/40">
                    <Bill />
                </div>
            </div>
        </section>
    );
};

export default Menu;
