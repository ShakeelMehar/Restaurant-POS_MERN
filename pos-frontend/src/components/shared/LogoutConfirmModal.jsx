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
        <p className="text-sm text-[#ababab]">
          You will be signed out of the current session. Continue?
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isPending}
            className="w-full rounded-lg bg-[#1f1f1f] px-4 py-3 font-semibold text-[#f5f5f5] disabled:cursor-not-allowed disabled:opacity-70"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="w-full rounded-lg bg-[#F6B100] px-4 py-3 font-semibold text-[#1f1f1f] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending ? "Logging Out..." : "Logout"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default LogoutConfirmModal;
