import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import BackButton from "../components/shared/BackButton";
import { getAllStaff, deleteStaff } from "../https";
import AddStaffModal from "../components/staff/AddStaffModal";
import ResetPasswordModal from "../components/staff/ResetPasswordModal";

const Staff = () => {
    useEffect(() => {
        document.title = "POS | Staff Management";
    }, []);

    const queryClient = useQueryClient();
    const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
    const [resetModalData, setResetModalData] = useState({ isOpen: false, staffId: null, staffName: "" });

    const { data: resData, isLoading } = useQuery({
        queryKey: ["staff"],
        queryFn: () => getAllStaff(),
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => deleteStaff(id),
        onSuccess: () => {
            enqueueSnackbar("Staff member removed successfully", { variant: "success" });
            queryClient.invalidateQueries({ queryKey: ["staff"] });
        },
        onError: (error) => {
            const message = error?.response?.data?.message || "Failed to remove staff";
            enqueueSnackbar(message, { variant: "error" });
        }
    });

    const staffList = resData?.data?.data || [];

    return (
        <section className="min-h-[calc(100vh-5rem)] bg-[#1f1f1f] pb-24">
            <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-10">
                <div className="flex items-center gap-4">
                    <BackButton />
                    <div>
                        <h1 className="text-2xl font-bold tracking-wider text-[#f5f5f5]">
                            Staff Management
                        </h1>
                        <p className="text-sm text-[#ababab]">
                            Manage cashier accounts.
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => setIsAddStaffModalOpen(true)}
                    className="rounded-lg bg-[#F6B100] px-4 py-2 text-sm font-semibold text-[#1f1f1f] sm:text-base"
                >
                    Add Cashier
                </button>
            </div>

            <div className="px-4 py-4 sm:px-6 lg:px-10">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {isLoading ? (
                        <p className="text-[#ababab]">Loading staff...</p>
                    ) : staffList.length === 0 ? (
                        <p className="text-[#ababab]">No staff members found.</p>
                    ) : (
                        staffList.map((member) => (
                            <div key={member._id} className="rounded-2xl border border-[#2a2a2a] bg-[#202020] p-5">
                                <div className="flex justify-between items-start">
                                    <h2 className="text-xl font-semibold text-[#f5f5f5]">{member.name}</h2>
                                    <span className="rounded bg-[#383838] px-2 py-0.5 text-xs text-[#ababab]">
                                        {member.role}
                                    </span>
                                </div>
                                <p className="mt-1 text-sm text-[#ababab]">{member.email}</p>
                                <p className="text-sm text-[#ababab]">{member.phone}</p>
                                <div className="mt-4 flex gap-2">
                                    <button 
                                        onClick={() => setResetModalData({ isOpen: true, staffId: member._id, staffName: member.name })}
                                        className="rounded bg-[#2e4a40] px-3 py-1 text-xs font-semibold text-[#02ca3a]"
                                    >
                                        Reset Password
                                    </button>
                                    <button 
                                        onClick={() => {
                                            if(window.confirm(`Are you sure you want to remove ${member.name}?`)) {
                                                deleteMutation.mutate(member._id);
                                            }
                                        }}
                                        disabled={deleteMutation.isPending}
                                        className="rounded bg-[#4a2e2e] px-3 py-1 text-xs font-semibold text-[#ca0202] disabled:opacity-50"
                                    >
                                        {deleteMutation.isPending ? "Removing..." : "Remove"}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            
            <AddStaffModal 
                isOpen={isAddStaffModalOpen} 
                onClose={() => setIsAddStaffModalOpen(false)} 
            />

            <ResetPasswordModal
                isOpen={resetModalData.isOpen}
                onClose={() => setResetModalData({ isOpen: false, staffId: null, staffName: "" })}
                staffId={resetModalData.staffId}
                staffName={resetModalData.staffName}
            />
        </section>
    );
};

export default Staff;
