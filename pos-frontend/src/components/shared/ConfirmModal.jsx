import React from "react";
import Modal from "./Modal";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to perform this action?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  isPending = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={isPending ? () => {} : onClose} title={title}>
      <div className="space-y-5">
        <p className="text-[15px] text-muted leading-relaxed">
          {message}
        </p>

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="btn btn-secondary flex-1"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="btn btn-primary flex-1"
          >
            {isPending ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
