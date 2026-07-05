import React from "react";

const TabGroup = ({ tabs, activeTab, onTabChange, fullWidth = false }) => {
  return (
    <div className="flex items-center bg-[#1a1a1a] rounded-xl p-1 border border-[#2a2a2a]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`${
            fullWidth ? "flex-1" : "px-6"
          } py-2 sm:py-2.5 rounded-lg text-sm sm:text-[15px] font-bold transition-all ${
            activeTab === tab.id
              ? "bg-[#2a2a2a] text-[#f5f5f5] shadow-md border border-[#383838]"
              : "text-[#ababab] hover:text-[#f5f5f5] border border-transparent"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabGroup;
