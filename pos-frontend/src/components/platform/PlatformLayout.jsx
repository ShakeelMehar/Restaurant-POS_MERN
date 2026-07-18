import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { FiLogOut, FiShield } from "react-icons/fi";
import { logout } from "../../https";
import { removeUser } from "../../redux/slices/userSlice";
import ThemeToggle from "../shared/ThemeToggle";
import LogoutConfirmModal from "../shared/LogoutConfirmModal";

const PlatformLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const logoutMutation = useMutation({
    mutationFn: () => logout(),
    onSuccess: async () => {
      localStorage.removeItem("accessToken");
      try {
        if (window.indexedDB.databases) {
          const dbs = await window.indexedDB.databases();
          dbs.forEach((db) => window.indexedDB.deleteDatabase(db.name));
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

  return (
    <div className="min-h-screen bg-background">
      {/* Platform header — deliberately distinct from the tenant POS chrome */}
      <header className="sticky top-0 z-40 flex items-center justify-between gap-4 px-4 sm:px-6 h-[64px] bg-card border-b border-border">
        <div
          onClick={() => navigate("/platform")}
          className="flex items-center gap-2.5 cursor-pointer flex-shrink-0"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FiShield size={18} />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[16px] font-extrabold text-foreground tracking-tight">
              Platform Console
            </span>
            <span className="text-[11px] text-muted font-medium">Restaurant management</span>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <ThemeToggle />
          <div className="flex items-center gap-2 pl-3 border-l border-border">
            <div className="flex-col items-end hidden sm:flex">
              <span className="text-[13px] font-semibold text-foreground leading-tight">
                {userData.name || "Super Admin"}
              </span>
              <span className="text-[11px] text-primary font-semibold leading-tight uppercase tracking-wide">
                Super Admin
              </span>
            </div>
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              title="Logout"
              className="flex items-center justify-center h-8 w-8 rounded-full text-muted hover:text-error hover:bg-[hsl(var(--surface-soft))] transition-colors"
            >
              <FiLogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl">
        <Outlet />
      </main>

      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={() => logoutMutation.mutate()}
        isPending={logoutMutation.isPending}
      />
    </div>
  );
};

export default PlatformLayout;
