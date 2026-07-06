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
          <label className="mb-2 block text-sm font-medium text-muted-foreground">
            Full Name
          </label>
          <div className="rounded-lg bg-background p-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g. Ali Khan"
              className="w-full bg-transparent text-white focus:outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-muted-foreground">
            Email Address
          </label>
          <div className="rounded-lg bg-background p-4">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="name@restaurant.com"
              className="w-full bg-transparent text-white focus:outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-muted-foreground">
            Phone Number
          </label>
          <div className="rounded-lg bg-background p-4">
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="03XX-XXXXXXX"
              className="w-full bg-transparent text-white focus:outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-muted-foreground">
            Temporary Password
          </label>
          <div className="rounded-lg bg-background p-4">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••"
              className="w-full bg-transparent text-white focus:outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-muted-foreground">
            Role
          </label>
          <div className="rounded-lg bg-background p-4">
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full bg-background text-white focus:outline-none"
            >
              <option value="Cashier">Cashier</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="mt-6 w-full rounded-lg bg-yellow-400 py-3 text-lg font-bold text-gray-900 disabled:opacity-50"
        >
          {registerMutation.isPending ? "Creating..." : "Add Staff"}
        </button>
      </form>
    </Modal>
  );
};

export default AddStaffModal;
