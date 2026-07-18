import React, { useEffect, useRef, useState } from "react";
import { FiAlertTriangle, FiInfo } from "react-icons/fi";
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
  // Enhancements — all optional, safe defaults keep existing callers unchanged.
  variant = "default", // "default" | "danger"
  itemName, // highlighted subject of the action, e.g. the dish/category name
  requireText, // when set, the user must type this exactly to enable confirm
  blockReason, // when set, confirm is hidden and the action is explained as blocked
}) => {
  const isDanger = variant === "danger";
  const [typed, setTyped] = useState("");
  const inputRef = useRef(null);

  // Reset the typed guard whenever the modal opens/closes or target changes.
  useEffect(() => {
    if (isOpen) {
      setTyped("");
      if (requireText) {
        // Focus after the modal mounts so typing can start immediately.
        const t = setTimeout(() => inputRef.current?.focus(), 60);
        return () => clearTimeout(t);
      }
    }
  }, [isOpen, requireText, itemName]);

  const matches = !requireText || typed.trim() === requireText.trim();
  const confirmDisabled = isPending || !matches;

  const handleConfirm = () => {
    if (confirmDisabled) return;
    onConfirm();
  };

  return (
    <Modal isOpen={isOpen} onClose={isPending ? () => {} : onClose} title={title}>
      <div className="space-y-5">
        <div className="flex gap-3.5">
          {/* Intent icon */}
          <div
            className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full ${
              blockReason
                ? "bg-surface-soft text-muted-foreground"
                : isDanger
                ? "bg-error/10 text-error"
                : "bg-surface-soft text-foreground"
            }`}
          >
            {blockReason ? <FiInfo size={20} /> : <FiAlertTriangle size={20} />}
          </div>

          <div className="flex-1 pt-0.5">
            <p className="text-[15px] text-muted leading-relaxed">
              {message}
              {itemName && (
                <>
                  {" "}
                  <span className="font-bold text-foreground break-words">
                    “{itemName}”
                  </span>
                  .
                </>
              )}
            </p>

            {blockReason && (
              <div className="mt-3 rounded-[10px] border border-border bg-surface-soft px-3 py-2.5">
                <p className="text-[13px] font-semibold text-foreground">{blockReason}</p>
              </div>
            )}

            {!blockReason && isDanger && (
              <p className="mt-2 text-[13px] font-semibold text-error">
                This action cannot be undone.
              </p>
            )}
          </div>
        </div>

        {/* Type-to-confirm guard for high-impact deletions */}
        {!blockReason && requireText && (
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold text-muted-foreground">
              Type{" "}
              <span className="font-bold text-foreground">{requireText}</span>{" "}
              to confirm
            </label>
            <input
              ref={inputRef}
              type="text"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleConfirm();
              }}
              disabled={isPending}
              autoComplete="off"
              spellCheck={false}
              placeholder={requireText}
              className="input-base w-full"
            />
          </div>
        )}

        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="btn btn-secondary flex-1"
          >
            {blockReason ? "Close" : cancelText}
          </button>
          {!blockReason && (
            <button
              type="button"
              onClick={handleConfirm}
              disabled={confirmDisabled}
              className={`btn flex-1 ${
                isDanger
                  ? "text-white bg-error hover:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  : "btn-primary"
              }`}
            >
              {isPending ? "Processing..." : confirmText}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
