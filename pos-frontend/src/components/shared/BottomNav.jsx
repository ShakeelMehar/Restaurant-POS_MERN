import React, { useState } from "react";
import { FaHome } from "react-icons/fa";
import { MdOutlineReorder, MdTableBar } from "react-icons/md";
import { CiCircleMore } from "react-icons/ci";
import { BiSolidDish } from "react-icons/bi";
import { useNavigate, useLocation } from "react-router-dom";
import Modal from "./Modal";
import { useDispatch, useSelector } from "react-redux";
import { setCustomer } from "../../redux/slices/customerSlice";
import { useMutation } from "@tanstack/react-query";
import { logout } from "../../https";
import { removeUser } from "../../redux/slices/userSlice";
import LogoutConfirmModal from "./LogoutConfirmModal";

const BottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.user);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMoreModalOpen, setIsMoreModalOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [guestCount, setGuestCount] = useState(0);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const openMoreModal = () => setIsMoreModalOpen(true);
    const closeMoreModal = () => setIsMoreModalOpen(false);

    const increment = () => {
        if (guestCount >= 6) return;
        setGuestCount((prev) => prev + 1);
    };
    const decrement = () => {
        if (guestCount <= 0) return;
        setGuestCount((prev) => prev - 1);
    };

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

    const handleCreateOrder = () => {
        // send the data to store
        dispatch(setCustomer({ name, phone, guests: guestCount }));
        closeModal();
        navigate("/tables");
    };

    const handleDashboardNavigation = () => {
        closeMoreModal();
        navigate("/dashboard");
    };

    const navButtonClass = (path) =>
        `flex min-w-0 flex-col items-center justify-center gap-1 rounded-[18px] py-2 text-[11px] font-bold sm:flex-row sm:gap-2 sm:text-sm ${
            isActive(path) ? "bg-[#343434] text-[#f5f5f5]" : "text-[#ababab]"
        }`;

    return (
        <div className="fixed bottom-0 left-0 right-0 grid h-16 grid-cols-4 items-center gap-2 bg-[#262626] px-2 py-2">
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
                disabled={isActive("/tables") || isActive("/menu")}
                onClick={openModal}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-[#F6B100] p-4 text-[#f5f5f5] disabled:cursor-not-allowed disabled:opacity-70">
                <BiSolidDish size={40} />
            </button>

            <Modal isOpen={isModalOpen} onClose={closeModal} title="Create Order">
                <div>
                    <label className="block text-[#ababab] mb-2 text-sm font-medium">
                        Customer Name
                    </label>
                    <div className="flex items-center rounded-lg p-3 px-4 bg-[#1f1f1f]">
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            type="text"
                            name=""
                            placeholder="Enter customer name"
                            id=""
                            className="bg-transparent flex-1 text-white focus:outline-none"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium">
                        Customer Phone
                    </label>
                    <div className="flex items-center rounded-lg p-3 px-4 bg-[#1f1f1f]">
                        <input
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            type="number"
                            name=""
                            placeholder="+92-300-1234567"
                            id=""
                            className="bg-transparent flex-1 text-white focus:outline-none"
                        />
                    </div>
                </div>
                <div>
                    <label className="block mb-2 mt-3 text-sm font-medium text-[#ababab]">
                        Guest
                    </label>
                    <div className="flex items-center justify-between bg-[#1f1f1f] px-4 py-3 rounded-lg">
                        <button onClick={decrement} className="text-yellow-500 text-2xl">
                            &minus;
                        </button>
                        <span className="text-white">{guestCount} Person</span>
                        <button onClick={increment} className="text-yellow-500 text-2xl">
                            &#43;
                        </button>
                    </div>
                </div>
                <button
                    onClick={handleCreateOrder}
                    className="w-full bg-[#F6B100] text-[#f5f5f5] rounded-lg py-3 mt-8 hover:bg-yellow-700">
                    Create Order
                </button>
            </Modal>

            <Modal isOpen={isMoreModalOpen} onClose={closeMoreModal} title="More">
                <div className="space-y-3">
                    {userData.role === "Admin" && (
                        <button
                            onClick={handleDashboardNavigation}
                            className="w-full rounded-lg bg-[#1f1f1f] px-4 py-3 text-left font-semibold text-[#f5f5f5]">
                            Open Dashboard
                        </button>
                    )}
                    <button
                        onClick={() => {
                            closeMoreModal();
                            setIsLogoutModalOpen(true);
                        }}
                        className="w-full rounded-lg bg-[#1f1f1f] px-4 py-3 text-left font-semibold text-[#f5f5f5]">
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
