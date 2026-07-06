import React from "react";
import { NavLink } from "react-router-dom";
import { MdDashboard, MdCategory, MdPeople, MdAssessment, MdSettings } from "react-icons/md";

const Sidebar = () => {
  const links = [
    { name: "Dashboard", path: "/dashboard", icon: <MdDashboard size={20} /> },
    { name: "Catalog", path: "/catalog", icon: <MdCategory size={20} /> },
    { name: "Staff", path: "/staff", icon: <MdPeople size={20} /> },
    { name: "Reports", path: "/reports", icon: <MdAssessment size={20} /> },
  ];

  return (
    <aside className="w-64 bg-card min-h-[calc(100vh-5rem)] border-r border-border p-4 flex flex-col gap-2">
      {links.map((link) => (
        <NavLink
          key={link.name}
          to={link.path}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all ${
              isActive
                ? "bg-primary text-white shadow-lg shadow-primary/40"
                : "text-muted-foreground hover:bg-primary/10 hover:text-foreground"
            }`
          }
        >
          {link.icon}
          {link.name}
        </NavLink>
      ))}
    </aside>
  );
};

export default Sidebar;
