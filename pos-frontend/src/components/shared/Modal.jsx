import React from 'react';
import { FiX } from 'react-icons/fi';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay backdrop-blur-[2px]">
      <div className="modal-content bg-card rounded-[20px] shadow-[0_8px_28px_rgba(0,0,0,0.15)] w-full max-w-lg mx-4 border border-border overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-border">
          <h2 className="text-[17px] text-foreground font-extrabold tracking-tight">{title}</h2>
          <button
            className="p-1.5 bg-transparent hover:bg-surface-soft text-muted-soft hover:text-foreground rounded-full transition-colors"
            onClick={onClose}
          >
            <FiX size={18} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
