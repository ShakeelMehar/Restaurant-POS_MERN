import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { FiLock, FiLoader, FiShield } from "react-icons/fi";
import { changePassword, logout } from "../https";
import { clearForcePasswordChange, removeUser } from "../redux/slices/userSlice";

const ChangePassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState({ newPassword: "", confirm: "" });

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      // ignore — clear client state regardless
    }
    localStorage.removeItem("accessToken");
    dispatch(removeUser());
    navigate("/auth", { replace: true });
  };

  useEffect(() => {
    document.title = "Restro | Set a new password";
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const mutation = useMutation({
    mutationFn: (newPassword) => changePassword(newPassword),
    onSuccess: () => {
      enqueueSnackbar("Password updated", { variant: "success" });
      dispatch(clearForcePasswordChange());
      navigate("/", { replace: true }); // routes by role now that the gate is lifted
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data?.message || "Failed to update password", {
        variant: "error",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.newPassword.length < 6) {
      enqueueSnackbar("Password must be at least 6 characters", { variant: "error" });
      return;
    }
    if (form.newPassword !== form.confirm) {
      enqueueSnackbar("Passwords do not match", { variant: "error" });
      return;
    }
    mutation.mutate(form.newPassword);
  };

  const inputClass =
    "w-full bg-card px-4 py-4 text-[15px] text-foreground placeholder:text-muted outline-none focus:bg-[hsl(var(--surface-soft))] transition-colors";

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background sm:bg-[hsl(var(--surface-soft))] p-4 font-sans">
      <div className="w-full max-w-[480px] bg-card sm:rounded-[14px] sm:border sm:border-[hsl(var(--border-strong))] p-6 sm:p-10 sm:shadow-[rgba(0,0,0,0.1)_0_8px_24px]">
        <div className="flex flex-col items-center justify-center mb-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
            <FiShield size={22} />
          </div>
          <h1 className="text-[24px] font-bold text-foreground tracking-tight">
            Set a new password
          </h1>
          <p className="text-[14px] text-muted-foreground mt-2 max-w-sm">
            For your security, you must replace the temporary password before continuing.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-0">
          <div className="border border-[hsl(var(--border-strong))] rounded-[8px] overflow-hidden">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiLock size={16} className="text-muted-foreground" />
              </div>
              <input
                type="password"
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                placeholder="New password"
                required
                className={`${inputClass} pl-11 border-b border-[hsl(var(--border-strong))]`}
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiLock size={16} className="text-muted-foreground" />
              </div>
              <input
                type="password"
                name="confirm"
                value={form.confirm}
                onChange={handleChange}
                placeholder="Confirm new password"
                required
                className={`${inputClass} pl-11`}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full btn btn-primary py-4 text-[16px] font-bold mt-8 h-auto"
          >
            {mutation.isPending ? (
              <>
                <FiLoader size={18} className="animate-spin" /> Updating…
              </>
            ) : (
              "Update password"
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 flex items-center justify-center text-[14px] border-t border-[hsl(var(--border-strong))]">
          <button
            onClick={handleLogout}
            className="font-semibold text-muted-foreground hover:text-foreground hover:underline underline-offset-2 transition-colors"
          >
            Back to login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
