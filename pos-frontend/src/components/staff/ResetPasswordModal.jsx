import React, { useState, useEffect } from "react";
import { enqueueSnackbar } from "notistack";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resetStaffPassword } from "../../https";
import Modal from "../shared/Modal";

const ResetPasswordModal = ({ isOpen, onClose, staffId, staffName }) => {
  const queryClient = useQueryClient();
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setPassword("");
    }
  }, [isOpen]);

  const resetMutation = useMutation({
    mutationFn: ({ id, pass }) => resetStaffPassword(id, pass),
    onSuccess: () => {
      enqueueSnackbar(`Password reset successfully for ${staffName}`, { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      onClose();
    },
    onError: (error) => {
      const message = error?.response?.data?.message || "Failed to reset password";
      enqueueSnackbar(message, { variant: "error" });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.length < 6) {
      enqueueSnackbar("Password must be at least 6 characters long", { variant: "warning" });
      return;
    }
    resetMutation.mutate({ id: staffId, pass: password });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Reset Password: ${staffName || ""}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-muted-foreground">
            New Password
          </label>
          <div className="rounded-lg bg-background p-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-transparent text-foreground focus:outline-none"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={resetMutation.isPending}
          className="mt-6 w-full rounded-[8px] bg-primary py-3 text-[16px] font-medium text-white disabled:opacity-50"
        >
          {resetMutation.isPending ? "Resetting..." : "Confirm Reset"}
        </button>
      </form>
    </Modal>
  );
};

export default ResetPasswordModal;
