import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import {
  FiArrowLeft,
  FiMail,
  FiPhone,
  FiUsers,
  FiKey,
  FiCopy,
  FiCheck,
  FiAlertTriangle,
  FiMapPin,
} from "react-icons/fi";
import {
  getRestaurant,
  setRestaurantStatus,
  resetRestaurantAdminPassword,
} from "../../https";
import ConfirmModal from "../../components/shared/ConfirmModal";

const InfoRow = ({ icon: Icon, children }) => (
  <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
    <Icon size={13} className="flex-shrink-0" />
    <span className="truncate">{children}</span>
  </div>
);

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [confirmStatus, setConfirmStatus] = useState(false);
  const [resetResult, setResetResult] = useState(null); // { email, temporaryPassword }
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.title = "Platform | Restaurant";
  }, []);

  const { data: resData, isLoading } = useQuery({
    queryKey: ["restaurant", id],
    queryFn: () => getRestaurant(id),
  });

  const restaurant = resData?.data?.data;
  const admin = restaurant?.admins?.[0];

  const statusMutation = useMutation({
    mutationFn: (isActive) => setRestaurantStatus(id, isActive),
    onSuccess: (res) => {
      enqueueSnackbar(res.data.message, { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["restaurant", id] });
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
      setConfirmStatus(false);
    },
    onError: (err) =>
      enqueueSnackbar(err?.response?.data?.message || "Failed to update status", { variant: "error" }),
  });

  const resetMutation = useMutation({
    mutationFn: (adminId) => resetRestaurantAdminPassword(id, adminId),
    onSuccess: (res) => {
      setResetResult(res.data.data);
      enqueueSnackbar("Password reset", { variant: "success" });
    },
    onError: (err) =>
      enqueueSnackbar(err?.response?.data?.message || "Failed to reset password", { variant: "error" }),
  });

  const copyPassword = async () => {
    try {
      await navigator.clipboard.writeText(resetResult.temporaryPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      enqueueSnackbar("Copy failed — select the password manually", { variant: "warning" });
    }
  };

  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 py-16 max-w-4xl mx-auto">
        <div className="h-8 w-40 bg-card rounded-lg border border-border animate-pulse mb-4" />
        <div className="h-48 bg-card rounded-[14px] border border-border animate-pulse" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="px-4 sm:px-6 py-16 text-center max-w-4xl mx-auto">
        <p className="text-foreground font-bold mb-3">Restaurant not found.</p>
        <button onClick={() => navigate("/platform")} className="btn btn-secondary">
          <FiArrowLeft size={15} /> Back to restaurants
        </button>
      </div>
    );
  }

  return (
    <section className="px-4 sm:px-6 py-16 space-y-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate("/platform")}
        className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted-foreground hover:text-foreground transition-colors"
      >
        <FiArrowLeft size={15} /> Restaurants
      </button>

      {/* Restaurant header card */}
      <div className="bg-card rounded-[14px] border border-border p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-[14px] bg-[hsl(var(--surface-strong))] text-foreground font-bold text-2xl">
              {restaurant.name?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <div className="min-w-0">
              <h1 className="text-[22px] font-medium text-foreground tracking-tight truncate">
                {restaurant.name}
              </h1>
              <div className="mt-1 space-y-0.5">
                {restaurant.address && <InfoRow icon={FiMapPin}>{restaurant.address}</InfoRow>}
                {restaurant.phone && <InfoRow icon={FiPhone}>{restaurant.phone}</InfoRow>}
                <InfoRow icon={FiUsers}>
                  {restaurant.cashierCount} {restaurant.cashierCount === 1 ? "cashier" : "cashiers"}
                </InfoRow>
              </div>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider flex-shrink-0 ${
              restaurant.isActive
                ? "bg-success/10 text-success border border-success/25"
                : "bg-error/10 text-error border border-error/25"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${restaurant.isActive ? "bg-success" : "bg-error"}`} />
            {restaurant.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      {/* Admin card */}
      <div className="bg-card rounded-[14px] border border-border p-6">
        <h2 className="text-[13px] font-bold text-muted uppercase tracking-wider mb-4">
          Restaurant Admin
        </h2>
        {admin ? (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-info/10 text-info font-semibold">
                {admin.name?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <div className="min-w-0">
                <p className="text-[16px] font-medium text-foreground leading-tight truncate">
                  {admin.name}
                </p>
                <div className="mt-0.5 space-y-0.5">
                  <InfoRow icon={FiMail}>{admin.email}</InfoRow>
                  {admin.phone && <InfoRow icon={FiPhone}>{admin.phone}</InfoRow>}
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setResetResult(null);
                resetMutation.mutate(admin._id);
              }}
              disabled={resetMutation.isPending}
              className="btn btn-secondary flex-shrink-0"
            >
              <FiKey size={14} /> {resetMutation.isPending ? "Resetting…" : "Reset Password"}
            </button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No admin account on this restaurant.</p>
        )}

        {resetResult && (
          <div className="mt-4 rounded-xl border border-warning/30 bg-warning/10 p-4">
            <div className="flex items-center gap-2 mb-2 text-warning">
              <FiAlertTriangle size={15} />
              <span className="text-[13px] font-bold">New temporary password — shown once</span>
            </div>
            <p className="text-[12px] text-muted-foreground mb-3">
              Share it securely with {resetResult.email}. They must change it on next login.
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 select-all rounded-lg bg-[hsl(var(--surface-strong))] px-3 py-2 text-[14px] font-mono text-foreground break-all">
                {resetResult.temporaryPassword}
              </code>
              <button
                onClick={copyPassword}
                className="btn btn-secondary !h-10 !w-10 !p-0 flex-shrink-0"
                title="Copy password"
              >
                {copied ? <FiCheck size={16} className="text-success" /> : <FiCopy size={16} />}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Danger / status zone */}
      <div className="bg-card rounded-[14px] border border-border p-6">
        <h2 className="text-[13px] font-bold text-muted uppercase tracking-wider mb-1">
          Restaurant Status
        </h2>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-[13px] text-muted-foreground max-w-md">
            {restaurant.isActive
              ? "Deactivating blocks this restaurant's admin and cashiers from logging in."
              : "Reactivating restores login for this restaurant's staff."}
          </p>
          <button
            onClick={() => setConfirmStatus(true)}
            className={`btn flex-shrink-0 ${
              restaurant.isActive ? "bg-error text-white hover:bg-error/90" : "btn-primary"
            }`}
          >
            {restaurant.isActive ? "Deactivate" : "Activate"}
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmStatus}
        onClose={() => setConfirmStatus(false)}
        onConfirm={() => statusMutation.mutate(!restaurant.isActive)}
        variant={restaurant.isActive ? "danger" : "default"}
        title={restaurant.isActive ? "Deactivate Restaurant" : "Activate Restaurant"}
        message={restaurant.isActive ? "You're about to deactivate" : "You're about to activate"}
        itemName={restaurant.name}
        confirmText={restaurant.isActive ? "Deactivate" : "Activate"}
        isPending={statusMutation.isPending}
      />
    </section>
  );
};

export default RestaurantDetail;
