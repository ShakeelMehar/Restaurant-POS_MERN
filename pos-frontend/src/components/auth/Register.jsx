import React, { useState } from "react";
import { register } from "../../https";
import { useMutation } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { FiUser, FiMail, FiPhone, FiLock, FiArrowRight, FiLoader } from "react-icons/fi";

const FieldIcon = ({ icon: Icon }) => (
  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
    <Icon size={16} className="text-muted-foreground" />
  </div>
);

const Register = ({ setIsRegister }) => {
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", password: "", role: "",
  });

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "phone") {
      let val = value.replace(/^\+92/, "0").replace(/\D/g, "");
      if (val.length > 0 && val[0] !== "0") val = "0" + val;
      if (val.length > 1 && val[1] !== "3") val = "03" + val.substring(2);
      if (val.length > 11) val = val.substring(0, 11);
      if (val.length > 4) val = val.substring(0, 4) + "-" + val.substring(4);
      value = val;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleRoleSelection = (selectedRole) =>
    setFormData({ ...formData, role: selectedRole });

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      phone: formData.phone.replace(/\D/g, "")
    };
    registerMutation.mutate(payload);
  };

  const registerMutation = useMutation({
    mutationFn: (reqData) => register(reqData),
    onSuccess: (res) => {
      enqueueSnackbar(res.data.message, { variant: "success" });
      setFormData({ name: "", email: "", phone: "", password: "", role: "" });
      setTimeout(() => setIsRegister(false), 1500);
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data?.message || "Registration failed", { variant: "error" });
    },
  });

  const fields = [
    { name: "name",     type: "text",     placeholder: "Full Name" },
    { name: "email",    type: "email",    placeholder: "Email address" },
    { name: "phone",    type: "text",     placeholder: "Phone Number (03XX-XXXXXXX)" },
    { name: "password", type: "password", placeholder: "Password" },
  ];

  const roles = ["Cashier", "Admin", "Super Admin"];

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="border border-[hsl(var(--border-strong))] rounded-[8px] overflow-hidden">
          {fields.map(({ name, type, placeholder }, index) => (
            <input
              key={name}
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              placeholder={placeholder}
              required
              className={`w-full bg-card px-4 py-4 text-[15px] text-foreground placeholder:text-muted outline-none focus:bg-[hsl(var(--surface-soft))] transition-colors ${
                index < fields.length - 1 ? "border-b border-[hsl(var(--border-strong))]" : ""
              }`}
            />
          ))}
        </div>

        {/* Role Selector */}
        <div>
          <label className="block text-[14px] font-bold text-foreground mb-3">Choose Role</label>
          <div className="flex gap-2 bg-[hsl(var(--surface-soft))] p-1 rounded-[9999px]">
            {roles.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => handleRoleSelection(role)}
                className={`flex-1 rounded-[9999px] px-3 py-2.5 text-[13px] font-semibold transition whitespace-nowrap border ${
                  formData.role === role
                    ? "border-foreground bg-foreground text-[hsl(var(--background))]"
                    : "border-transparent bg-transparent text-muted hover:text-foreground hover:bg-[rgba(0,0,0,0.03)]"
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={registerMutation.isPending || !formData.role}
          className="w-full btn btn-primary py-4 text-[16px] font-bold h-auto mt-8"
        >
          {registerMutation.isPending ? (
            <><FiLoader size={18} className="animate-spin" /> Creating Account…</>
          ) : (
            "Create Account"
          )}
        </button>
      </form>
    </div>
  );
};

export default Register;
