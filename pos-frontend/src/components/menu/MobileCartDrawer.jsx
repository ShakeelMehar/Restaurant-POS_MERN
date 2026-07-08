import React from "react";
import { FiX } from "react-icons/fi";
import CartInfo from "./CartInfo";
import Bill from "./Bill";

const MobileCartDrawer = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-background rounded-t-[24px] shadow-2xl flex flex-col transition-transform duration-300 ease-out`}
        style={{ height: '85vh', maxHeight: '800px' }}
      >
        <div className="flex items-center justify-between p-4 border-b border-border bg-card rounded-t-[24px]">
          <h2 className="text-[18px] font-bold text-foreground tracking-tight">Your Order</h2>
          <button
            onClick={onClose}
            className="p-2 text-muted hover:text-foreground bg-[hsl(var(--surface-soft))] rounded-full"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col bg-card">
          <div className="flex-1 overflow-hidden">
            <CartInfo />
          </div>
          <div className="border-t border-border bg-card">
            <Bill />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileCartDrawer;
