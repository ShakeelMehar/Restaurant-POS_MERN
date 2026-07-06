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
        <section className="min-h-[calc(100vh-5rem)] bg-background pb-24">
            <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-10">
                <div className="flex items-center gap-4">
                    <BackButton />
                    <div>
                        <h1 className="text-2xl font-bold tracking-wider text-foreground">
                            Staff Management
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Manage cashier accounts.
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => setIsAddStaffModalOpen(true)}
                    className="rounded-lg bg-primary-yellow px-4 py-2 text-sm font-semibold text-white sm:text-base"
                >
                    Add Cashier
                </button>
            </div>

            <div className="px-4 py-4 sm:px-6 lg:px-10">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {isLoading ? (
                        <p className="text-muted-foreground">Loading staff...</p>
                    ) : staffList.length === 0 ? (
                        <p className="text-muted-foreground">No staff members found.</p>
                    ) : (
                        staffList.map((member) => (
                            <div key={member._id} className="rounded-2xl border border-border bg-popover p-5">
                                <div className="flex justify-between items-start">
                                    <h2 className="text-xl font-semibold text-foreground">{member.name}</h2>
                                    <span className="rounded bg-secondary text-foreground px-2 py-0.5 text-xs text-muted-foreground">
                                        {member.role}
                                    </span>
                                </div>
                                <p className="mt-1 text-sm text-muted-foreground">{member.email}</p>
                                <p className="text-sm text-muted-foreground">{member.phone}</p>
                                <div className="mt-4 flex gap-2">
                                    <button 
                                        onClick={() => setResetModalData({ isOpen: true, staffId: member._id, staffName: member.name })}
                                        className="rounded bg-success/20 px-3 py-1 text-xs font-semibold text-success"
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
                                        className="rounded bg-red-500/20 px-3 py-1 text-xs font-semibold text-red-500 disabled:opacity-50"
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
