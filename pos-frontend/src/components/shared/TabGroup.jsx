import React from "react";

const TabGroup = ({ tabs, activeTab, onTabChange, fullWidth = false }) => {
  return (
    <div className="flex items-center bg-card rounded-xl p-1 border border-border">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`${
            fullWidth ? "flex-1" : "px-6"
          } py-2 sm:py-2.5 rounded-lg text-sm sm:text-[15px] font-bold transition-all ${
            activeTab === tab.id
              ? "bg-secondary text-foreground shadow-md border border-border"
              : "text-muted-foreground hover:text-foreground border border-transparent"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabGroup;
