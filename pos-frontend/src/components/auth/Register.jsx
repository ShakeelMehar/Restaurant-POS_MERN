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
    registerMutation.mutate(formData);
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
    { name: "name",     icon: FiUser,  type: "text",     placeholder: "e.g. John Doe",         label: "Employee Name" },
    { name: "email",    icon: FiMail,  type: "email",    placeholder: "name@restaurant.com",   label: "Email Address" },
    { name: "phone",    icon: FiPhone, type: "text",   placeholder: "03XX-XXXXXXX",        label: "Phone Number" },
    { name: "password", icon: FiLock,  type: "password", placeholder: "••••••••",               label: "Password" },
  ];

  const roles = ["Cashier", "Admin", "Super Admin"];

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map(({ name, icon, type, placeholder, label }) => (
          <div key={name}>
            <label className="form-label">{label}</label>
            <div className="relative">
              <FieldIcon icon={icon} />
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                placeholder={placeholder}
                required
                className="input-base !pl-11"
              />
            </div>
          </div>
        ))}

        {/* Role Selector */}
        <div>
          <label className="form-label">Choose Role</label>
          <div className="flex gap-2 mt-1">
            {roles.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => handleRoleSelection(role)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-all duration-200 ${
                  formData.role === role
                    ? "bg-gradient-to-r from-primary to-amber-500 border-transparent text-primary-foreground shadow-md shadow-primary/30"
                    : "bg-secondary border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
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
          disabled={registerMutation.isPending}
          className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-primary to-amber-500 hover:from-amber-500 hover:to-primary text-primary-foreground font-bold rounded-xl py-3.5 mt-2 transition-all duration-200 shadow-md shadow-primary/30 hover:shadow-lg hover:shadow-primary/40 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {registerMutation.isPending ? (
            <><FiLoader size={18} className="animate-spin" /> Creating Account…</>
          ) : (
            <>Create Account <FiArrowRight size={18} /></>
          )}
        </button>
      </form>
    </div>
  );
};

export default Register;
