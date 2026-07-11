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
      setIsMoreModalOpen(false);
      navigate("/auth");
    },
    onError: (error) => console.log(error),
  });

  const NavBtn = ({ path, icon: Icon, label, onClick }) => {
    const active = path ? isActive(path) : false;
    return (
      <button
        onClick={onClick || (() => navigate(path))}
        className={`flex flex-col items-center justify-center gap-1 px-3 py-2 flex-1 transition-colors ${
          active ? "text-primary" : "text-muted hover:text-foreground"
        }`}
      >
        <Icon size={24} />
        <span className={`text-[11px] font-medium leading-none ${active ? "text-primary font-semibold" : ""}`}>
          {label}
        </span>
      </button>
    );
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border md:hidden">
      <div className="flex items-center justify-around px-2 py-3 pb-safe">
        <NavBtn path="/menu" icon={FiHome} label="POS" />
        <NavBtn path="/orders" icon={FiList} label="Orders" />

        {/* Center FAB */}
        <div className="flex-none mx-2">
          <button
            disabled={isActive("/menu")}
            onClick={() => navigate("/menu")}
            className="flex items-center justify-center h-14 w-14 -mt-6 rounded-full bg-primary text-primary-foreground shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-transform active:scale-95"
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
              className="w-full flex items-center gap-3 rounded-lg hover:bg-[hsl(var(--surface-soft))] px-4 py-3 text-left font-medium text-foreground transition-colors"
            >
              <FiGrid size={20} className="text-foreground" />
              Open Dashboard
            </button>
          )}
          <button
            onClick={() => { setIsMoreModalOpen(false); setIsLogoutModalOpen(true); }}
            className="w-full flex items-center gap-3 rounded-lg hover:bg-[hsl(var(--surface-soft))] px-4 py-3 text-left font-medium text-error transition-colors"
          >
            <FiLogOut size={20} className="text-error" />
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
