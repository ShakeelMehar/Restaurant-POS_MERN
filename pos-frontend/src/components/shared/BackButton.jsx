import React from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center justify-center h-9 w-9 rounded-xl bg-secondary hover:bg-muted border border-border hover:border-primary/30 text-foreground transition-all duration-200"
      title="Go back"
    >
      <FiArrowLeft size={16} />
    </button>
  );
};

export default BackButton;