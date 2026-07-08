import React from "react";
import { FiTrendingUp } from "react-icons/fi";

const MiniCard = ({ title, icon, number, footerNum }) => {
  const isEarnings = title === "Total Earnings";

  return (
    <div className="flex-1 bg-card rounded-[14px] border border-border p-5 transition-all duration-200 hover:shadow-[rgba(0,0,0,0.02)_0_0_0_1px,rgba(0,0,0,0.04)_0_2px_6px,rgba(0,0,0,0.1)_0_4px_8px]">
      {/* Header row */}
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm font-bold text-muted-foreground">{title}</p>
        <div className="flex items-center justify-center h-10 w-10 text-xl text-muted-foreground">
          {icon}
        </div>
      </div>

      {/* Main metric */}
      <div>
        <p className="text-3xl font-extrabold text-foreground tracking-tight">
          {isEarnings ? `PKR ${number}` : number}
        </p>
        <div className="flex items-center gap-1.5 mt-2">
          <div className="flex items-center gap-1 bg-success/10 border border-success/20 rounded-full px-2 py-0.5">
            <FiTrendingUp size={12} className="text-success" />
            <span className="text-xs font-bold text-success">{footerNum}%</span>
          </div>
          <span className="text-xs text-muted-foreground font-medium">vs yesterday</span>
        </div>
      </div>
    </div>
  );
};

export default MiniCard;