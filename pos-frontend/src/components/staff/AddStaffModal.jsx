import React, { useState, useEffect } from "react";
import { enqueueSnackbar } from "notistack";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCashier, updateStaff } from "../../https";
import Modal from "../shared/Modal";

const initialData = {
  name: "",
  email: "",
  phone: "",
  password: "",
};

const AddStaffModal = ({ isOpen, onClose, staffToEdit }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    if (staffToEdit) {
      setFormData({
        name: staffToEdit.name || "",
        email: staffToEdit.email || "",
        phone: staffToEdit.phone || "",
        password: "",
      });
    } else {
      setFormData(initialData);
    }
  }, [staffToEdit, isOpen]);

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
    mutationFn: (data) => {
      if (staffToEdit) {
        const payload = { ...data };
        delete payload.password; // Do not update password through this endpoint
        return updateStaff(staffToEdit._id, payload);
      }
      return createCashier(data); // role is assigned server-side (always cashier)
    },
    onSuccess: (res) => {
      enqueueSnackbar(
        staffToEdit ? "Staff member updated successfully!" : "Staff member created successfully!",
        { variant: "success" }
      );
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      setFormData(initialData);
      onClose();
    },
    onError: (error) => {
      const message = error?.response?.data?.message || `Failed to ${staffToEdit ? "update" : "add"} staff`;
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
    <Modal isOpen={isOpen} onClose={handleClose} title={staffToEdit ? "Edit Staff Member" : "Add Staff Member"}>
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
            className="input-base"
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
            className="input-base"
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
            className="input-base"
            required
          />
        </div>

        {!staffToEdit && (
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
              className="input-base"
              required
            />
          </div>
        )}

        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="mt-6 w-full btn btn-primary h-auto py-3 text-[16px]"
        >
          {registerMutation.isPending ? "Saving..." : (staffToEdit ? "Save Changes" : "Add Staff")}
        </button>
      </form>
    </Modal>
  );
};

export default AddStaffModal;
