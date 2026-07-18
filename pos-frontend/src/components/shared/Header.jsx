import React, { useState } from "react";
import { FiSearch, FiBell, FiLogOut, FiMenu, FiX, FiUser } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
const logo = "/vite.svg";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQuery } from "@tanstack/react-query";
import { logout } from "../../https";
import { removeUser } from "../../redux/slices/userSlice";
import { useLocation, useNavigate } from "react-router-dom";
import NotificationDropdown from "./NotificationDropdown";
import LogoutConfirmModal from "./LogoutConfirmModal";
import GlobalSearchModal from "./GlobalSearchModal";
import ThemeToggle from "./ThemeToggle";
import { ROLES } from "../../constants/roles";

const Header = () => {
  const userData = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const activeTab = location.pathname;

  const { data: settingsRes } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const { getSettings } = await import("../../https");
      return await getSettings();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!userData?.isAuth,
  });
  const settings = settingsRes?.data?.data || {};

  const logoutMutation = useMutation({
    mutationFn: () => logout(),
    onSuccess: async () => {
      localStorage.removeItem("accessToken");
      
      // Wipe all IndexedDB databases to prevent multi-tenant offline data leaks
      try {
        if (window.indexedDB.databases) {
          const dbs = await window.indexedDB.databases();
          dbs.forEach(db => {
            window.indexedDB.deleteDatabase(db.name);
          });
        }
      } catch (e) {
        console.error("Failed to wipe IndexedDB:", e);
      }

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
        {/* ── MOBILE MENU TOGGLE & LOGO ── */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button 
            className="lg:hidden p-1.5 -ml-2 text-foreground hover:bg-[hsl(var(--surface-soft))] rounded-md"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <FiMenu size={22} />
          </button>
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2 cursor-pointer flex-shrink-0"
          >
            {settings.logoUrl ? (
              <img src={settings.logoUrl} className="h-6 object-contain" alt="brand logo" />
            ) : (
              <img src={logo} className="h-6 w-6 object-contain" alt="default logo" />
            )}
            <span className="text-[18px] font-display text-primary tracking-tight font-bold">
              {settings.restaurantName || "Restro"}
            </span>
          </div>
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
          {[ROLES.ADMIN, ROLES.SUPER_ADMIN].includes(userData.role) && (
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
          {/* Theme Toggle */}
          <ThemeToggle />

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
          <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-border ml-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(var(--surface-strong))] text-foreground">
              <FiUser size={18} />
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

      {/* ── MOBILE NAVIGATION DRAWER ── */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Drawer */}
          <div className="absolute top-0 left-0 bottom-0 w-[280px] bg-card shadow-2xl flex flex-col transform transition-transform duration-300">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <span className="text-[18px] font-display text-primary font-bold">Menu</span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-muted hover:text-foreground bg-[hsl(var(--surface-soft))] rounded-full"
              >
                <FiX size={20} />
              </button>
            </div>
            
            <nav className="flex flex-col p-4 gap-2 flex-1 overflow-y-auto">
              <button
                onClick={() => { navigate("/menu"); setIsMobileMenuOpen(false); }}
                className={`flex items-center p-3 rounded-xl transition-colors ${
                  isNavActive(["/menu", "/"]) ? "bg-primary/10 text-primary font-bold" : "text-foreground font-medium hover:bg-[hsl(var(--surface-soft))]"
                }`}
              >
                Cashier POS
              </button>
              <button
                onClick={() => { navigate("/orders"); setIsMobileMenuOpen(false); }}
                className={`flex items-center p-3 rounded-xl transition-colors ${
                  isNavActive(["/orders"]) ? "bg-primary/10 text-primary font-bold" : "text-foreground font-medium hover:bg-[hsl(var(--surface-soft))]"
                }`}
              >
                Orders
              </button>
              {[ROLES.ADMIN, ROLES.SUPER_ADMIN].includes(userData.role) && (
                <>
                  <div className="text-[12px] font-bold text-muted uppercase tracking-wider mt-4 px-3 mb-1">Administration</div>
                  <button
                    onClick={() => { navigate("/dashboard"); setIsMobileMenuOpen(false); }}
                    className={`flex items-center p-3 rounded-xl transition-colors ${
                      isNavActive(["/dashboard"]) && activeTab === "/dashboard" ? "bg-primary/10 text-primary font-bold" : "text-foreground font-medium hover:bg-[hsl(var(--surface-soft))]"
                    }`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => { navigate("/catalog"); setIsMobileMenuOpen(false); }}
                    className={`flex items-center p-3 rounded-xl transition-colors ${
                      isNavActive(["/catalog"]) ? "bg-primary/10 text-primary font-bold" : "text-foreground font-medium hover:bg-[hsl(var(--surface-soft))]"
                    }`}
                  >
                    Catalog
                  </button>
                  <button
                    onClick={() => { navigate("/staff"); setIsMobileMenuOpen(false); }}
                    className={`flex items-center p-3 rounded-xl transition-colors ${
                      isNavActive(["/staff"]) ? "bg-primary/10 text-primary font-bold" : "text-foreground font-medium hover:bg-[hsl(var(--surface-soft))]"
                    }`}
                  >
                    Staff
                  </button>
                  <button
                    onClick={() => { navigate("/reports"); setIsMobileMenuOpen(false); }}
                    className={`flex items-center p-3 rounded-xl transition-colors ${
                      isNavActive(["/reports"]) ? "bg-primary/10 text-primary font-bold" : "text-foreground font-medium hover:bg-[hsl(var(--surface-soft))]"
                    }`}
                  >
                    Reports
                  </button>
                  <button
                    onClick={() => { navigate("/settings"); setIsMobileMenuOpen(false); }}
                    className={`flex items-center p-3 rounded-xl transition-colors ${
                      isNavActive(["/settings"]) ? "bg-primary/10 text-primary font-bold" : "text-foreground font-medium hover:bg-[hsl(var(--surface-soft))]"
                    }`}
                  >
                    Settings
                  </button>
                </>
              )}
            </nav>

            <div className="p-4 border-t border-border">
              <div className="flex items-center gap-3 mb-4">
                 <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(var(--surface-strong))] text-foreground">
                    <FaUserCircle size={22} />
                 </div>
                 <div>
                    <div className="text-[14px] font-semibold text-foreground">{userData.name || "User"}</div>
                    <div className="text-[12px] text-muted font-medium">{userData.role || "Role"}</div>
                 </div>
              </div>
              <button
                onClick={() => { setIsMobileMenuOpen(false); setIsLogoutModalOpen(true); }}
                className="w-full flex items-center justify-center gap-2 bg-error/10 text-error hover:bg-error/20 p-3 rounded-xl font-bold transition-colors"
              >
                <FiLogOut size={18} /> Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
