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

  const isNavActive = (matches) => matches.includes(activeTab);

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between gap-4 px-6 h-[64px] bg-card border-b border-border">
        {/* ── LOGO ── */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer flex-shrink-0"
        >
          <img src={logo} className="h-6 w-6 object-contain" alt="restro logo" />
          <span className="text-[18px] font-display text-primary tracking-tight">
            Restro
          </span>
        </div>

        {/* ── SEARCH ── */}
        <div className="relative z-50 flex-1 max-w-[400px] hidden md:block">
          <div className="flex items-center gap-2 bg-[hsl(var(--surface-soft))] hover:bg-[hsl(var(--surface-strong))] border border-transparent hover:border-border rounded-full px-4 py-2 transition-colors cursor-text shadow-[rgba(0,0,0,0.02)_0_0_0_1px,rgba(0,0,0,0.04)_0_2px_6px]">
            <FiSearch className="text-foreground flex-shrink-0" size={16} />
            <input
              type="text"
              placeholder="Search orders, products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchOpen(true)}
              className="bg-transparent outline-none text-foreground placeholder:text-muted w-full text-[14px]"
            />
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
        <nav className="hidden lg:flex items-center gap-6">
          <button
            onClick={() => navigate("/menu")}
            className={`pb-1 transition-colors whitespace-nowrap text-[15px] border-b-2 ${
              isNavActive(["/menu", "/"])
                ? "text-foreground font-bold border-foreground"
                : "text-muted hover:text-foreground font-semibold border-transparent"
            }`}
          >
            Cashier POS
          </button>
          <button
            onClick={() => navigate("/orders")}
            className={`pb-1 transition-colors whitespace-nowrap text-[15px] border-b-2 ${
              isNavActive(["/orders"])
                ? "text-foreground font-bold border-foreground"
                : "text-muted hover:text-foreground font-semibold border-transparent"
            }`}
          >
            Orders
          </button>
          {["Admin", "Super Admin"].includes(userData.role) && (
            <button
              onClick={() => navigate("/dashboard")}
              className={`pb-1 transition-colors whitespace-nowrap text-[15px] border-b-2 ${
                isNavActive(["/dashboard", "/catalog", "/staff", "/reports"])
                  ? "text-foreground font-bold border-foreground"
                  : "text-muted hover:text-foreground font-semibold border-transparent"
              }`}
            >
              Admin
            </button>
          )}
        </nav>

        {/* ── RIGHT ACTIONS ── */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationOpen((p) => !p)}
              className="relative flex items-center justify-center h-9 w-9 rounded-full hover:bg-[hsl(var(--surface-soft))] transition-colors"
              title="Notifications"
            >
              <FiBell className="text-foreground" size={18} />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary border-2 border-card" />
            </button>
            <NotificationDropdown
              isOpen={isNotificationOpen}
              onClose={() => setIsNotificationOpen(false)}
            />
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-2 pl-3 border-l border-border ml-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(var(--surface-strong))] text-foreground">
              <FaUserCircle size={18} />
            </div>
            <div className="flex-col items-start hidden sm:flex">
              <span className="text-[13px] font-semibold text-foreground leading-tight">
                {userData.name || "User"}
              </span>
              <span className="text-[11px] text-muted font-medium leading-tight">
                {userData.role || "Role"}
              </span>
            </div>
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              title="Logout"
              className="flex items-center justify-center h-8 w-8 rounded-full text-muted hover:text-error hover:bg-[hsl(var(--surface-soft))] transition-colors ml-1"
            >
              <FiLogOut size={16} />
            </button>
          </div>
        </div>
      </header>
      
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={() => logoutMutation.mutate()}
        isPending={logoutMutation.isPending}
      />
    </>
  );
};

export default Header;
