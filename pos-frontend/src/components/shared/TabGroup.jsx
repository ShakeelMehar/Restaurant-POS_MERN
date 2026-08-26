import React from "react";

const TabGroup = ({ tabs, activeTab, onTabChange, fullWidth = false }) => {
  return (
    <div className="flex items-center bg-secondary/70 rounded-xl p-1 border border-border gap-0.5">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`${
              fullWidth ? "flex-1" : "px-5"
            } py-2 sm:py-2.5 rounded-lg text-sm font-bold transition-all duration-200 whitespace-nowrap ${
              isActive
                ? "bg-gradient-to-r from-primary to-amber-500 text-primary-foreground shadow-md shadow-primary/30"
                : "text-muted-foreground hover:text-foreground hover:bg-card/80"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default TabGroup;
