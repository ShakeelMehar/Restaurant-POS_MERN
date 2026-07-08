import React from "react";

const TabGroup = ({ tabs, activeTab, onTabChange, fullWidth = false }) => {
  return (
    <div className="flex items-center gap-2 bg-[hsl(var(--surface-soft))] p-1 rounded-[9999px]">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`${
              fullWidth ? "flex-1" : "px-5"
            } py-2 rounded-[9999px] text-[13px] font-semibold transition-all duration-200 whitespace-nowrap border ${
              isActive
                ? "border-foreground bg-foreground text-[hsl(var(--background))]"
                : "border-transparent bg-transparent text-muted hover:text-foreground hover:bg-[rgba(0,0,0,0.03)]"
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
