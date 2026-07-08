import React, { useState } from "react";
import { enqueueSnackbar } from "notistack";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { register } from "../../https";
import Modal from "../shared/Modal";

const initialData = {
  name: "",
  email: "",
  phone: "",
  password: "",
  role: "Cashier", // Default to Cashier
};

const AddStaffModal = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState(initialData);

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    if (name === "phone") {
      let val = value.replace(/^\+92/, "0").replace(/\D/g, "");
      if (val.length > 0 && val[0] !== "0") val = "0" + val;
      if (val.length > 1 && val[1] !== "3") val = "03" + val.substring(2);
      if (val.length > 11) val = val.substring(0, 11);
      if (val.length > 4) val = val.substring(0, 4) + "-" + val.substring(4);
      value = val;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const registerMutation = useMutation({
    mutationFn: (data) => register(data),
    onSuccess: (res) => {
      enqueueSnackbar("Staff member created successfully!", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      setFormData(initialData);
      onClose();
    },
    onError: (error) => {
      const message = error?.response?.data?.message || "Failed to add staff";
      enqueueSnackbar(message, { variant: "error" });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    registerMutation.mutate(formData);
  };

  const handleClose = () => {
    setFormData(initialData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Staff Member">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Full Name <span className="text-error">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g. Ali Khan"
            className="w-full bg-[hsl(var(--surface-strong))] border border-transparent focus:border-primary/50 focus:bg-background rounded-[8px] px-4 py-3 text-sm text-foreground transition-all outline-none"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Email Address <span className="text-error">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="name@restaurant.com"
            className="w-full bg-[hsl(var(--surface-strong))] border border-transparent focus:border-primary/50 focus:bg-background rounded-[8px] px-4 py-3 text-sm text-foreground transition-all outline-none"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Phone Number <span className="text-error">*</span>
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="03XX-XXXXXXX"
            className="w-full bg-[hsl(var(--surface-strong))] border border-transparent focus:border-primary/50 focus:bg-background rounded-[8px] px-4 py-3 text-sm text-foreground transition-all outline-none"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Temporary Password <span className="text-error">*</span>
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="••••••••"
            className="w-full bg-[hsl(var(--surface-strong))] border border-transparent focus:border-primary/50 focus:bg-background rounded-[8px] px-4 py-3 text-sm text-foreground transition-all outline-none"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Role
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            className="w-full bg-[hsl(var(--surface-strong))] border border-transparent focus:border-primary/50 focus:bg-background rounded-[8px] px-4 py-3 text-sm text-foreground transition-all outline-none cursor-pointer"
          >
            <option value="Cashier">Cashier</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="mt-6 w-full rounded-[8px] bg-primary py-3 text-[16px] font-medium text-white disabled:opacity-50"
        >
          {registerMutation.isPending ? "Creating..." : "Add Staff"}
        </button>
      </form>
    </Modal>
  );
};

export default AddStaffModal;
