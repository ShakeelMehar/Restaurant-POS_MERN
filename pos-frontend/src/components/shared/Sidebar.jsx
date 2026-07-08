import React from "react";
import { NavLink } from "react-router-dom";
import { MdDashboard, MdCategory, MdPeople, MdAssessment } from "react-icons/md";

const Sidebar = () => {
  const links = [
    { name: "Dashboard", path: "/dashboard", icon: <MdDashboard size={20} /> },
    { name: "Catalog", path: "/catalog", icon: <MdCategory size={20} /> },
    { name: "Staff", path: "/staff", icon: <MdPeople size={20} /> },
    { name: "Reports", path: "/reports", icon: <MdAssessment size={20} /> },
  ];

  return (
    <aside className="hidden lg:flex w-64 bg-[hsl(var(--surface-soft))] min-h-[calc(100vh-81px)] border-r border-border p-4 flex-col gap-2">
      <div className="mb-4 px-3">
        <h3 className="text-[12px] font-bold text-muted uppercase tracking-wider">Administration</h3>
      </div>
      {links.map((link) => (
        <NavLink
          key={link.name}
          to={link.path}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-[10px] font-medium transition-colors ${
              isActive
                ? "bg-card text-foreground shadow-[rgba(0,0,0,0.02)_0_0_0_1px,rgba(0,0,0,0.04)_0_2px_6px] font-semibold"
                : "text-muted hover:bg-[hsl(var(--border))] hover:text-foreground"
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
