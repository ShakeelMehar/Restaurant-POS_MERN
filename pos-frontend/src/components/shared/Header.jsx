import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { FaBell } from "react-icons/fa";
import logo from "../../assets/images/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { IoLogOut } from "react-icons/io5";
import { useMutation } from "@tanstack/react-query";
import { logout } from "../../https";
import { removeUser } from "../../redux/slices/userSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { MdDashboard, MdOutlineReorder } from "react-icons/md";
import { FaHome as FaHomeSolid } from "react-icons/fa";
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
  const isDashboardRoute = location.pathname === "/dashboard";

  const logoutMutation = useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      dispatch(removeUser());
      setIsLogoutModalOpen(false);
      navigate("/auth");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const activeTab = location.pathname;

  return (
    <header className="flex justify-between items-center py-4 px-8 bg-card">
      {/* LOGO */}
      <div onClick={() => navigate("/")} className="flex items-center gap-2 cursor-pointer">
        <img src={logo} className="h-8 w-8" alt="restro logo" />
        <h1 className="text-lg font-semibold text-foreground tracking-wide">
          Restro
        </h1>
      </div>

      {/* SEARCH */}
      <div className="relative z-50">
        <div className="flex items-center gap-4 bg-background rounded-[15px] px-5 py-2 w-[500px]">
          <FaSearch className="text-foreground" />
          <input
            type="text"
            placeholder="Search orders, products & categories"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchOpen(true)}
            className="bg-background outline-none text-foreground w-full"
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

      {/* TOGGLE TABS */}
      <div className="flex flex-wrap gap-3 mx-4">
        <button
          onClick={() => navigate("/menu")}
          className={`px-6 py-2.5 rounded-full font-bold transition-all text-sm whitespace-nowrap ${
            activeTab === "/menu" || activeTab === "/"
              ? "bg-primary text-white shadow-lg shadow-primary/40"
              : "bg-background text-muted-foreground hover:text-foreground border border-border"
          }`}
        >
          Cashier POS
        </button>
        <button
          onClick={() => navigate("/orders")}
          className={`px-6 py-2.5 rounded-full font-bold transition-all text-sm whitespace-nowrap ${
            activeTab === "/orders"
              ? "bg-primary text-white shadow-lg shadow-primary/40"
              : "bg-background text-muted-foreground hover:text-foreground border border-border"
          }`}
        >
          Orders
        </button>
        {["Admin", "Super Admin"].includes(userData.role) && (
          <button
            onClick={() => navigate("/dashboard")}
            className={`px-6 py-2.5 rounded-full font-bold transition-all text-sm whitespace-nowrap ${
              ["/dashboard", "/catalog", "/staff", "/reports"].includes(activeTab)
                ? "bg-primary text-white shadow-lg shadow-primary/40"
                : "bg-background text-muted-foreground hover:text-foreground border border-border"
            }`}
          >
            Admin Dashboard
          </button>
        )}
      </div>

      {/* LOGGED USER DETAILS */}
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <div className="relative">
          <button
            onClick={() => setIsNotificationOpen((prev) => !prev)}
            className="relative rounded-[15px] bg-background p-3 cursor-pointer"
            title="Notifications"
          >
            <FaBell className="text-foreground text-2xl" />
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-primary-yellow" />
          </button>
          <NotificationDropdown
            isOpen={isNotificationOpen}
            onClose={() => setIsNotificationOpen(false)}
          />
        </div>
        <div className="flex items-center gap-3 cursor-pointer">
          <FaUserCircle className="text-foreground text-4xl" />
          <div className="flex flex-col items-start">
            <h1 className="text-md text-foreground font-semibold tracking-wide">
              {userData.name || "TEST USER"}
            </h1>
            <p className="text-xs text-muted-foreground font-medium">
              {userData.role || "Role"}
            </p>
          </div>
          <IoLogOut
            onClick={() => setIsLogoutModalOpen(true)}
            className="text-foreground ml-2"
            size={40}
          />
        </div>
      </div>

      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        isPending={logoutMutation.isPending}
      />
    </header>
  );
};

export default Header;
