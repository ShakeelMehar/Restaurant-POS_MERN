import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import BackButton from "../components/shared/BackButton";
import { getAllStaff, deleteStaff } from "../https";
import AddStaffModal from "../components/staff/AddStaffModal";
import ResetPasswordModal from "../components/staff/ResetPasswordModal";
import { FiUserPlus, FiMail, FiPhone, FiKey, FiTrash2, FiUser } from "react-icons/fi";

const roleColors = {
  "Cashier":     "bg-blue-500/10 text-blue-500 border-blue-500/20",
  "Admin":       "bg-blue-500/10 text-blue-600 border-blue-500/20",
  "Super Admin": "bg-purple-500/10 text-purple-500 border-purple-500/20",
};

const Staff = () => {
  useEffect(() => { document.title = "POS | Staff Management"; }, []);

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
      enqueueSnackbar("Staff member removed", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
    onError: (err) => {
      enqueueSnackbar(err?.response?.data?.message || "Failed to remove staff", { variant: "error" });
    },
  });

  const staffList = resData?.data?.data || [];

  return (
    <section className="min-h-[calc(100dvh-4rem)] bg-background pb-24">
      {/* Page Header */}
      <div className="flex flex-col gap-2 px-4 py-2 border-b border-border bg-card/50 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <BackButton />
          <div>
            <h1 className="text-lg font-extrabold text-foreground tracking-tight">Staff Management</h1>
            <p className="text-xs text-muted-foreground font-medium">
              {staffList.length} {staffList.length === 1 ? "member" : "members"} · Manage cashier accounts
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsAddStaffModalOpen(true)}
          className="flex items-center gap-2 rounded-[8px] bg-primary px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 active:scale-95"
        >
          <FiUserPlus size={16} /> Add Cashier
        </button>
      </div>

      {/* Staff Grid */}
      <div className="px-4 py-3">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 bg-card rounded-[14px] border border-border animate-pulse" />
            ))}
          </div>
        ) : staffList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-2 text-center">
            <div className="flex items-center justify-center h-20 w-20 rounded-full bg-secondary border border-border">
              <FiUser size={36} className="text-muted-foreground" />
            </div>
            <h3 className="text-base font-bold text-foreground">No staff members</h3>
            <p className="text-sm text-muted-foreground">Add your first cashier to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {staffList.map((member) => (
              <div key={member._id} className="bg-card rounded-[14px] border border-border transition-all duration-200 hover:shadow-[rgba(0,0,0,0.02)_0_0_0_1px,rgba(0,0,0,0.04)_0_2px_6px,rgba(0,0,0,0.1)_0_4px_8px] p-6 group">
                {/* Avatar + role */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[hsl(var(--surface-strong))] text-foreground font-semibold text-base">
                      {member.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <h2 className="text-[15px] font-bold text-foreground leading-tight">{member.name}</h2>
                      <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium border border-border text-muted-foreground uppercase tracking-wider">
                        {member.role}
                      </span>
                    </div>
                  </div>
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
                <div className="flex gap-2 pt-3 mt-2">
                  <button
                    onClick={() => setResetModalData({ isOpen: true, staffId: member._id, staffName: member.name })}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-[8px] bg-white border border-border px-3 py-2 text-xs font-medium text-foreground hover:bg-[hsl(var(--surface-soft))] transition-all"
                  >
                    <FiKey size={12} /> Reset PW
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Remove ${member.name}?`)) deleteMutation.mutate(member._id);
                    }}
                    disabled={deleteMutation.isPending}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-[8px] bg-white border border-border px-3 py-2 text-xs font-medium text-primary hover:bg-[hsl(var(--surface-soft))] transition-all disabled:opacity-50"
                  >
                    <FiTrash2 size={12} /> {deleteMutation.isPending ? "…" : "Remove"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddStaffModal isOpen={isAddStaffModalOpen} onClose={() => setIsAddStaffModalOpen(false)} />
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
