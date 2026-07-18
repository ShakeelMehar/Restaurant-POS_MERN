import React from "react";
import { NavLink } from "react-router-dom";
import { FiHome, FiGrid, FiUsers, FiPieChart, FiSettings } from "react-icons/fi";

const Sidebar = () => {
  const links = [
    { name: "Dashboard", path: "/dashboard", icon: <FiHome size={20} /> },
    { name: "Catalog", path: "/catalog", icon: <FiGrid size={20} /> },
    { name: "Staff", path: "/staff", icon: <FiUsers size={20} /> },
    { name: "Reports", path: "/reports", icon: <FiPieChart size={20} /> },
    { name: "Settings", path: "/settings", icon: <FiSettings size={20} /> },
  ];

  return (
    <aside className="hidden lg:flex w-64 bg-[hsl(var(--surface-soft))] min-h-[calc(100dvh-81px)] border-r border-border p-4 flex-col gap-2">
      <div className="mb-4 px-3">
        <h3 className="text-[12px] font-bold text-muted uppercase tracking-wider">Administration</h3>
      </div>
      {links.map((link) => (
        <NavLink
          key={link.name}
          to={link.path}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              isActive
                ? "bg-[hsl(var(--surface-strong))] text-foreground font-semibold"
                : "text-muted hover:bg-[hsl(var(--surface-strong))] hover:text-foreground font-medium"
            }`
          }
        >
          {link.icon}
          <span className="text-[15px]">{link.name}</span>
        </NavLink>
      ))}
    </aside>
  );
};

export default Sidebar;
