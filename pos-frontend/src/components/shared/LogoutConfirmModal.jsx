import React from "react";
import Modal from "./Modal";

const LogoutConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  isPending = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={isPending ? () => {} : onClose} title="Confirm Logout">
      <div className="space-y-5">
        <p className="text-sm text-muted-foreground">
          You will be signed out of the current session. Continue?
        </p>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            disabled={isPending}
            className="w-full rounded-lg bg-background px-3 py-2 font-semibold text-foreground disabled:cursor-not-allowed disabled:opacity-70"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="w-full rounded-lg bg-primary px-3 py-2 font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending ? "Logging Out..." : "Logout"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default LogoutConfirmModal;
