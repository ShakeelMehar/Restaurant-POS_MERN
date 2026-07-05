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
    <header className="flex justify-between items-center py-4 px-8 bg-[#1a1a1a]">
      {/* LOGO */}
      <div onClick={() => navigate("/")} className="flex items-center gap-2 cursor-pointer">
        <img src={logo} className="h-8 w-8" alt="restro logo" />
        <h1 className="text-lg font-semibold text-[#f5f5f5] tracking-wide">
          Restro
        </h1>
      </div>

      {/* SEARCH */}
      <div className="relative z-50">
        <div className="flex items-center gap-4 bg-[#1f1f1f] rounded-[15px] px-5 py-2 w-[500px]">
          <FaSearch className="text-[#f5f5f5]" />
          <input
            type="text"
            placeholder="Search orders, products & categories"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchOpen(true)}
            className="bg-[#1f1f1f] outline-none text-[#f5f5f5] w-full"
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
              ? "bg-primary text-[#1a1a1a] shadow-[0_0_15px_rgba(246,177,0,0.4)]"
              : "bg-base text-[#ababab] hover:text-[#f5f5f5] border border-[#2a2a2a]"
          }`}
        >
          Cashier POS
        </button>
        <button
          onClick={() => navigate("/orders")}
          className={`px-6 py-2.5 rounded-full font-bold transition-all text-sm whitespace-nowrap ${
            activeTab === "/orders"
              ? "bg-primary text-[#1a1a1a] shadow-[0_0_15px_rgba(246,177,0,0.4)]"
              : "bg-base text-[#ababab] hover:text-[#f5f5f5] border border-[#2a2a2a]"
          }`}
        >
          Orders
        </button>
        {userData.role === "Admin" && (
          <button
            onClick={() => navigate("/home")}
            className={`px-6 py-2.5 rounded-full font-bold transition-all text-sm whitespace-nowrap ${
              activeTab === "/home"
                ? "bg-primary text-[#1a1a1a] shadow-[0_0_15px_rgba(246,177,0,0.4)]"
                : "bg-base text-[#ababab] hover:text-[#f5f5f5] border border-[#2a2a2a]"
            }`}
          >
            Dashboard
          </button>
        )}
      </div>

      {/* LOGGED USER DETAILS */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => setIsNotificationOpen((prev) => !prev)}
            className="relative rounded-[15px] bg-[#1f1f1f] p-3 cursor-pointer"
            title="Notifications"
          >
            <FaBell className="text-[#f5f5f5] text-2xl" />
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[#F6B100]" />
          </button>
          <NotificationDropdown
            isOpen={isNotificationOpen}
            onClose={() => setIsNotificationOpen(false)}
          />
        </div>
        <div className="flex items-center gap-3 cursor-pointer">
          <FaUserCircle className="text-[#f5f5f5] text-4xl" />
          <div className="flex flex-col items-start">
            <h1 className="text-md text-[#f5f5f5] font-semibold tracking-wide">
              {userData.name || "TEST USER"}
            </h1>
            <p className="text-xs text-[#ababab] font-medium">
              {userData.role || "Role"}
            </p>
          </div>
          <IoLogOut
            onClick={() => setIsLogoutModalOpen(true)}
            className="text-[#f5f5f5] ml-2"
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
