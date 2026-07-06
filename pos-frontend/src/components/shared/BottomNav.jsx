import React, { useState } from "react";
import { FaHome } from "react-icons/fa";
import { MdOutlineReorder, MdTableBar } from "react-icons/md";
import { CiCircleMore } from "react-icons/ci";
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

    const openMoreModal = () => setIsMoreModalOpen(true);
    const closeMoreModal = () => setIsMoreModalOpen(false);

    const isActive = (path) => location.pathname === path;

    const logoutMutation = useMutation({
        mutationFn: () => logout(),
        onSuccess: () => {
            dispatch(removeUser());
            setIsLogoutModalOpen(false);
            closeMoreModal();
            navigate("/auth");
        },
    });



    const handleDashboardNavigation = () => {
        closeMoreModal();
        navigate("/dashboard");
    };

    const navButtonClass = (path) =>
        `flex min-w-0 flex-col items-center justify-center gap-1 rounded-[18px] py-2 text-[11px] font-bold sm:flex-row sm:gap-2 sm:text-sm ${
            isActive(path) ? "bg-secondary text-foreground" : "text-muted-foreground"
        }`;

    return (
        <div className="fixed bottom-0 left-0 right-0 grid h-16 grid-cols-4 items-center gap-2 bg-card px-2 py-2">
            <button onClick={() => navigate("/")} className={navButtonClass("/")}>
                <FaHome size={18} /> <p>Home</p>
            </button>
            <button
                onClick={() => navigate("/orders")}
                className={navButtonClass("/orders")}>
                <MdOutlineReorder size={18} /> <p>Orders</p>
            </button>
            <button
                onClick={() => navigate("/tables")}
                className={navButtonClass("/tables")}>
                <MdTableBar size={18} /> <p>Tables</p>
            </button>
            <button onClick={openMoreModal} className={navButtonClass("/dashboard")}>
                <CiCircleMore size={18} /> <p>More</p>
            </button>

            <button
                disabled={isActive("/menu")}
                onClick={() => navigate("/menu")}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-primary-yellow p-4 text-foreground disabled:cursor-not-allowed disabled:opacity-70">
                <BiSolidDish size={40} />
            </button>

            <Modal isOpen={isMoreModalOpen} onClose={closeMoreModal} title="More">
                <div className="space-y-3">
                    {["Admin", "Super Admin"].includes(userData.role) && (
                        <button
                            onClick={handleDashboardNavigation}
                            className="w-full rounded-lg bg-background px-4 py-3 text-left font-semibold text-foreground">
                            Open Dashboard
                        </button>
                    )}
                    <button
                        onClick={() => {
                            closeMoreModal();
                            setIsLogoutModalOpen(true);
                        }}
                        className="w-full rounded-lg bg-background px-4 py-3 text-left font-semibold text-foreground">
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
