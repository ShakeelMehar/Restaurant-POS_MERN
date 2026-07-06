import React, { useState } from "react";
import { FiHome, FiList, FiGrid, FiMoreHorizontal } from "react-icons/fi";
import { MdTableBar } from "react-icons/md";
import { BiSolidDish } from "react-icons/bi";
import { useNavigate, useLocation } from "react-router-dom";
import Modal from "./Modal";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { logout } from "../../https";
import { removeUser } from "../../redux/slices/userSlice";
import LogoutConfirmModal from "./LogoutConfirmModal";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);
  const [isMoreModalOpen, setIsMoreModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const logoutMutation = useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      dispatch(removeUser());
      setIsLogoutModalOpen(false);
      setIsMoreModalOpen(false);
      navigate("/auth");
    },
  });

  const NavBtn = ({ path, icon: Icon, label, onClick }) => {
    const active = path ? isActive(path) : false;
    return (
      <button
        onClick={onClick || (() => navigate(path))}
        className={`flex flex-col items-center justify-center gap-0.5 rounded-2xl px-3 py-2 flex-1 transition-all duration-200 ${
          active
            ? "text-primary"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <div className={`relative flex items-center justify-center h-7 w-7 rounded-xl transition-all duration-200 ${
          active ? "bg-primary/15" : "bg-transparent"
        }`}>
          <Icon size={17} />
          {active && (
            <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
          )}
        </div>
        <span className={`text-[10px] font-bold leading-none ${active ? "text-primary" : ""}`}>
          {label}
        </span>
      </button>
    );
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-card/90 backdrop-blur-md border-t border-border">
      <div className="flex items-center justify-around px-2 py-2 pb-safe">
        <NavBtn path="/menu" icon={FiHome} label="POS" />
        <NavBtn path="/orders" icon={FiList} label="Orders" />

        {/* Center FAB */}
        <div className="flex-none mx-2">
          <button
            disabled={isActive("/menu")}
            onClick={() => navigate("/menu")}
            className="relative flex items-center justify-center h-14 w-14 -mt-6 rounded-full bg-gradient-to-br from-primary to-amber-500 shadow-lg shadow-primary/40 text-primary-foreground disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-glow active:scale-95 animate-pulse-ring"
          >
            <BiSolidDish size={28} />
          </button>
        </div>

        <NavBtn path="/tables" icon={MdTableBar} label="Tables" />
        <NavBtn
          path="/dashboard"
          icon={FiMoreHorizontal}
          label="More"
          onClick={() => setIsMoreModalOpen(true)}
        />
      </div>

      <Modal isOpen={isMoreModalOpen} onClose={() => setIsMoreModalOpen(false)} title="More Options">
        <div className="space-y-2">
          {["Admin", "Super Admin"].includes(userData.role) && (
            <button
              onClick={() => { setIsMoreModalOpen(false); navigate("/dashboard"); }}
              className="w-full flex items-center gap-3 rounded-xl bg-secondary hover:bg-muted border border-border px-4 py-3.5 text-left font-semibold text-foreground transition-all hover:border-primary/30"
            >
              <FiGrid size={18} className="text-primary" />
              Open Dashboard
            </button>
          )}
          <button
            onClick={() => { setIsMoreModalOpen(false); setIsLogoutModalOpen(true); }}
            className="w-full flex items-center gap-3 rounded-xl bg-secondary hover:bg-destructive/10 border border-border hover:border-destructive/30 px-4 py-3.5 text-left font-semibold text-foreground transition-all"
          >
            <FiMoreHorizontal size={18} className="text-muted-foreground" />
            Logout
          </button>
        </div>
      </Modal>

      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={() => logoutMutation.mutate()}
        isPending={logoutMutation.isPending}
      />
    </div>
  );
};

export default BottomNav;
