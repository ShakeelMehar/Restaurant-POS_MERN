import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import BackButton from "../components/shared/BackButton";
import { getAllStaff, deleteStaff } from "../https";
import AddStaffModal from "../components/staff/AddStaffModal";
import ResetPasswordModal from "../components/staff/ResetPasswordModal";
import ConfirmModal from "../components/shared/ConfirmModal";
import { ROLE_LABELS } from "../constants/roles";
import {
    FiUserPlus,
    FiMail,
    FiPhone,
    FiKey,
    FiTrash2,
    FiUser,
    FiEdit2,
} from "react-icons/fi";

const roleColors = {
    cashier: "bg-surface-strong text-muted border border-border",
    admin: "bg-info/10 text-info border border-info/25",
    super_admin: "bg-primary/10 text-primary border border-primary/25",
};

const Staff = () => {
    useEffect(() => {
        document.title = "POS | Staff Management";
    }, []);

    const queryClient = useQueryClient();
    const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);
    const [deletingStaff, setDeletingStaff] = useState(null);
    const [resetModalData, setResetModalData] = useState({
        isOpen: false,
        staffId: null,
        staffName: "",
    });

    const { data: resData, isLoading } = useQuery({
        queryKey: ["staff"],
        queryFn: () => getAllStaff(),
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => deleteStaff(id),
        onSuccess: () => {
            enqueueSnackbar("Staff member removed", { variant: "success" });
            queryClient.invalidateQueries({ queryKey: ["staff"] });
            setDeletingStaff(null);
        },
        onError: (err) => {
            enqueueSnackbar(err?.response?.data?.message || "Failed to remove staff", {
                variant: "error",
            });
        },
    });

    const handleConfirmDeleteStaff = () => {
        if (deletingStaff) {
            deleteMutation.mutate(deletingStaff.id);
        }
    };

    const staffList = resData?.data?.data || [];

    return (
        <section className="min-h-[calc(100dvh-4rem)] bg-background pb-24">
            {/* Page Header */}
            <div className="flex flex-col gap-2 px-4 py-2 border-b border-border bg-card/50 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                    <BackButton />
                    <div>
                        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
                            Staff Management
                        </h1>
                        <p className="text-xs text-muted-foreground font-medium">
                            {staffList.length}{" "}
                            {staffList.length === 1 ? "member" : "members"} · Manage
                            cashier accounts
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => setIsAddStaffModalOpen(true)}
                    className="btn btn-primary">
                    <FiUserPlus size={16} /> Add Cashier
                </button>
            </div>

            {/* Staff Grid */}
            <div className="px-4 py-3">
                {isLoading ? (
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="h-48 bg-card rounded-[14px] border border-border animate-pulse"
                            />
                        ))}
                    </div>
                ) : staffList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-2 text-center">
                        <div className="flex items-center justify-center h-20 w-20 rounded-full bg-secondary border border-border">
                            <FiUser size={36} className="text-muted-foreground" />
                        </div>
                        <h3 className="text-base font-bold text-foreground">
                            No staff members
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Add your first cashier to get started.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {staffList.map((member) => (
                            <div
                                key={member._id}
                                className="bg-card rounded-[14px] border border-border transition-all duration-200 hover:shadow-[rgba(0,0,0,0.02)_0_0_0_1px,rgba(0,0,0,0.04)_0_2px_6px,rgba(0,0,0,0.1)_0_4px_8px] p-6 group">
                                {/* Avatar + role + Remove */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[hsl(var(--surface-strong))] text-foreground font-semibold text-base">
                                            {member.name?.charAt(0)?.toUpperCase() || "?"}
                                        </div>
                                        <div>
                                            <h2 className="text-[15px] font-bold text-foreground leading-tight">
                                                {member.name}
                                            </h2>
                                            <span className={`mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${roleColors[member.role] || "bg-surface-strong text-muted border border-border"}`}>
                                                {ROLE_LABELS[member.role] || member.role}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Remove Button */}
                                    <button
                                        onClick={() => {
                                            setDeletingStaff({
                                                id: member._id,
                                                name: member.name,
                                            });
                                        }}
                                        disabled={deleteMutation.isPending}
                                        title="Remove Staff Member"
                                        aria-label={`Remove ${member.name}`}
                                        className="flex h-8 w-8 items-center justify-center rounded-full border border-transparent text-muted-foreground hover:bg-error/10 hover:text-error focus-visible:bg-error/10 focus-visible:text-error transition-all disabled:opacity-50">
                                        <FiTrash2 size={15} />
                                    </button>
                                </div>

                                {/* Contact info */}
                                <div className="space-y-1.5 mb-4">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <FiMail size={12} className="flex-shrink-0" />
                                        <span className="truncate">{member.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <FiPhone size={12} className="flex-shrink-0" />
                                        <span>{member.phone}</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 pt-3 mt-2 border-t border-border/50">
                                    <button
                                        onClick={() => {
                                            setEditingStaff(member);
                                            setIsAddStaffModalOpen(true);
                                        }}
                                        className="btn btn-secondary flex-1 !h-9 text-xs">
                                        <FiEdit2 size={12} /> Edit
                                    </button>
                                    <button
                                        onClick={() =>
                                            setResetModalData({
                                                isOpen: true,
                                                staffId: member._id,
                                                staffName: member.name,
                                            })
                                        }
                                        className="btn btn-secondary flex-1 !h-9 text-xs">
                                        <FiKey size={12} /> Reset PW
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <AddStaffModal
                isOpen={isAddStaffModalOpen}
                onClose={() => {
                    setIsAddStaffModalOpen(false);
                    setEditingStaff(null);
                }}
                staffToEdit={editingStaff}
            />
            <ResetPasswordModal
                isOpen={resetModalData.isOpen}
                onClose={() =>
                    setResetModalData({ isOpen: false, staffId: null, staffName: "" })
                }
                staffId={resetModalData.staffId}
                staffName={resetModalData.staffName}
            />
            <ConfirmModal
                isOpen={Boolean(deletingStaff)}
                onClose={() => setDeletingStaff(null)}
                onConfirm={handleConfirmDeleteStaff}
                variant="danger"
                title="Remove Staff Member"
                message="You're about to remove"
                itemName={deletingStaff?.name}
                confirmText="Remove Staff"
                isPending={deleteMutation.isPending}
            />
        </section>
    );
};

export default Staff;
