import React, { useState } from "react";
import { FiSearch, FiBell, FiLogOut } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import logo from "../../assets/images/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { logout } from "../../https";
import { removeUser } from "../../redux/slices/userSlice";
import { useLocation, useNavigate } from "react-router-dom";
import NotificationDropdown from "./NotificationDropdown";
import LogoutConfirmModal from "./LogoutConfirmModal";
import GlobalSearchModal from "./GlobalSearchModal";
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  const userData = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const activeTab = location.pathname;

  const logoutMutation = useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      dispatch(removeUser());
      setIsLogoutModalOpen(false);
      navigate("/auth");
    },
    onError: (error) => console.log(error),
  });

  const navItems = [
    { label: "Cashier POS", path: "/menu", match: ["/menu", "/"] },
    { label: "Orders", path: "/orders", match: ["/orders"] },
    ...(["Admin", "Super Admin"].includes(userData.role)
      ? [{ label: "Admin", path: "/dashboard", match: ["/dashboard", "/catalog", "/staff", "/reports"] }]
      : []),
  ];

  const isNavActive = (matches) => matches.includes(activeTab);

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-2 px-4 py-2 bg-card/90 backdrop-blur-md border-b border-border shadow-sm">
      {/* ── LOGO ── */}
      <div
        onClick={() => navigate("/")}
        className="flex items-center gap-2.5 cursor-pointer flex-shrink-0 group"
      >
        <div className="relative flex items-center justify-center h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-blue-500 shadow-glow group-hover:shadow-lg transition-all duration-200">
          <img src={logo} className="h-5 w-5 object-contain" alt="restro logo" />
        </div>
        <span className="text-[17px] font-extrabold tracking-tight text-foreground">
          Restro
        </span>
      </div>

      {/* ── SEARCH ── */}
      <div className="relative z-50 flex-1 max-w-[480px]">
        <div className="flex items-center gap-2 bg-secondary/80 hover:bg-secondary border border-border hover:border-primary/30 rounded-full px-3 py-2.5 transition-all duration-200 cursor-text">
          <FiSearch className="text-muted-foreground flex-shrink-0" size={15} />
          <input
            type="text"
            placeholder="Search orders, products & categories…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchOpen(true)}
            className="bg-transparent outline-none text-foreground placeholder:text-muted-foreground w-full text-sm"
          />
          <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold text-muted-foreground border border-border bg-card">
            ⌘K
          </kbd>
        </div>
        {isSearchOpen && (
          <GlobalSearchModal
            searchQuery={searchQuery}
            onClose={() => {
              setIsSearchOpen(false);
              setSearchQuery("");
            }}
          />
        )}
      </div>

      {/* ── NAV TABS ── */}
      <nav className="flex items-center gap-1.5">
        <button
          onClick={() => navigate("/menu")}
          className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 whitespace-nowrap ${
            isNavActive(["/menu", "/"])
              ? "bg-gradient-to-r from-primary to-blue-500 text-primary-foreground shadow-md shadow-primary/30"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary border border-transparent hover:border-border"
          }`}
        >
          Cashier POS
        </button>
        <button
          onClick={() => navigate("/orders")}
          className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 whitespace-nowrap ${
            isNavActive(["/orders"])
              ? "bg-gradient-to-r from-primary to-blue-500 text-primary-foreground shadow-md shadow-primary/30"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary border border-transparent hover:border-border"
          }`}
        >
          Orders
        </button>
        {["Admin", "Super Admin"].includes(userData.role) && (
          <button
            onClick={() => navigate("/dashboard")}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 whitespace-nowrap ${
              isNavActive(["/dashboard", "/catalog", "/staff", "/reports"])
                ? "bg-gradient-to-r from-primary to-blue-500 text-primary-foreground shadow-md shadow-primary/30"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary border border-transparent hover:border-border"
            }`}
          >
            Admin
          </button>
        )}
      </nav>

      {/* ── RIGHT ACTIONS ── */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <ThemeToggle />

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationOpen((p) => !p)}
            className="relative flex items-center justify-center h-9 w-9 rounded-xl bg-secondary hover:bg-muted border border-border hover:border-primary/30 transition-all duration-200"
            title="Notifications"
          >
            <FiBell className="text-foreground" size={16} />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent border border-card" />
          </button>
          <NotificationDropdown
            isOpen={isNotificationOpen}
            onClose={() => setIsNotificationOpen(false)}
          />
        </div>

        {/* User chip */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-border ml-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 text-foreground">
            <FaUserCircle size={16} />
          </div>
          <div className="flex-col items-start hidden sm:flex">
            <span className="text-[13px] font-bold text-foreground leading-tight">
              {userData.name || "User"}
            </span>
            <span className="text-[11px] text-muted-foreground font-medium leading-tight">
              {userData.role || "Role"}
            </span>
          </div>
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            title="Logout"
            className="flex items-center justify-center h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200 ml-1"
          >
            <FiLogOut size={15} />
          </button>
        </div>
      </div>

      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={() => logoutMutation.mutate()}
        isPending={logoutMutation.isPending}
      />
    </header>
  );
};

export default Header;
