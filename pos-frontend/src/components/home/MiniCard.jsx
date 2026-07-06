import React from "react";
import { FiTrendingUp } from "react-icons/fi";

const MiniCard = ({ title, icon, number, footerNum }) => {
  const isEarnings = title === "Total Earnings";

  return (
    <div className="relative flex-1 bg-card rounded-2xl border border-border p-5 overflow-hidden transition-all duration-200 hover:border-primary/30 hover:shadow-md group">
      {/* Ambient glow */}
      <div className={`absolute top-0 right-0 h-32 w-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
        isEarnings ? "bg-success/15" : "bg-primary/15"
      }`} />

      {/* Header row */}
      <div className="flex items-start justify-between mb-4 relative z-10">
        <p className="text-sm font-bold text-muted-foreground">{title}</p>
        <div className={`flex items-center justify-center h-10 w-10 rounded-xl text-lg ${
          isEarnings
            ? "bg-success/15 text-success border border-success/20"
            : "bg-primary/15 text-primary border border-primary/20"
        }`}>
          {icon}
        </div>
      </div>

      {/* Main metric */}
      <div className="relative z-10">
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