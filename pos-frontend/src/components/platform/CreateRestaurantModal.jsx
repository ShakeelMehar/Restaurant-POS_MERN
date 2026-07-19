import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { FiCopy, FiCheck, FiAlertTriangle } from "react-icons/fi";
import { createRestaurant } from "../../https";
import Modal from "../shared/Modal";
import PhoneInput from "../shared/PhoneInput";

const initialData = {
  restaurantName: "",
  address: "",
  phone: "",
  taxId: "",
  adminName: "",
  adminEmail: "",
  adminPhone: "",
};

const CreateRestaurantModal = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState(initialData);
  const [result, setResult] = useState(null); // { restaurant, admin, temporaryPassword }
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const mutation = useMutation({
    mutationFn: (data) => createRestaurant(data),
    onSuccess: (res) => {
      setResult(res.data.data);
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data?.message || "Failed to create restaurant", {
        variant: "error",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleClose = () => {
    setFormData(initialData);
    setResult(null);
    setCopied(false);
    onClose();
  };

  const copyPassword = async () => {
    try {
      await navigator.clipboard.writeText(result.temporaryPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      enqueueSnackbar("Copy failed — select the password manually", { variant: "warning" });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={result ? "Restaurant Created" : "New Restaurant"}
    >
      {result ? (
        <div className="space-y-5">
          <div>
            <p className="text-[15px] text-foreground font-semibold">{result.restaurant.name}</p>
            <p className="text-[13px] text-muted-foreground">Admin: {result.admin.email}</p>
          </div>

          <div className="rounded-xl border border-warning/30 bg-warning/10 p-4">
            <div className="flex items-center gap-2 mb-2 text-warning">
              <FiAlertTriangle size={15} />
              <span className="text-[13px] font-bold">Save this temporary password now</span>
            </div>
            <p className="text-[12px] text-muted-foreground mb-3">
              It is shown only once. Share it securely with the admin — they must change it on first login.
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 select-all rounded-lg bg-[hsl(var(--surface-strong))] px-3 py-2 text-[14px] font-mono text-foreground break-all">
                {result.temporaryPassword}
              </code>
              <button
                onClick={copyPassword}
                className="btn btn-secondary !h-10 !w-10 !p-0 flex-shrink-0"
                title="Copy password"
              >
                {copied ? <FiCheck size={16} className="text-success" /> : <FiCopy size={16} />}
              </button>
            </div>
          </div>

          <button onClick={handleClose} className="w-full btn btn-primary h-auto py-3 text-[15px]">
            Done
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Restaurant Name <span className="text-error">*</span>
            </label>
            <input
              name="restaurantName"
              value={formData.restaurantName}
              onChange={handleChange}
              placeholder="e.g. Al Hafiz Yakhni Pulao"
              className="input-base"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Address</label>
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street, city"
                className="input-base"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Restaurant Phone</label>
              <PhoneInput
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="pt-2 mt-2 border-t border-border">
            <p className="text-[12px] font-bold text-muted uppercase tracking-wider mb-3">
              Restaurant Admin
            </p>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Admin Name <span className="text-error">*</span>
                </label>
                <input
                  name="adminName"
                  value={formData.adminName}
                  onChange={handleChange}
                  placeholder="e.g. Ali Khan"
                  className="input-base"
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Admin Email <span className="text-error">*</span>
                  </label>
                  <input
                    type="email"
                    name="adminEmail"
                    value={formData.adminEmail}
                    onChange={handleChange}
                    placeholder="admin@restaurant.com"
                    className="input-base"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Admin Phone <span className="text-error">*</span>
                  </label>
                  <PhoneInput
                    name="adminPhone"
                    value={formData.adminPhone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="mt-4 w-full btn btn-primary h-auto py-3 text-[15px]"
          >
            {mutation.isPending ? "Creating…" : "Create Restaurant"}
          </button>
        </form>
      )}
    </Modal>
  );
};

export default CreateRestaurantModal;
