import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { login } from "../../https/index";
import { enqueueSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiArrowRight, FiLoader } from "react-icons/fi";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate(formData);
  };

  const loginMutation = useMutation({
    mutationFn: (reqData) => login(reqData),
    onSuccess: (res) => {
      const { _id, name, email, phone, role } = res.data.data;
      dispatch(setUser({ _id, name, email, phone, role }));
      navigate("/");
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data?.message || "Login failed", { variant: "error" });
    },
  });

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="form-label">Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiMail size={16} className="text-muted-foreground" />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@restaurant.com"
              required
              className="input-base pl-11"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="form-label">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiLock size={16} className="text-muted-foreground" />
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="input-base pl-11"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-primary to-amber-500 hover:from-amber-500 hover:to-primary text-primary-foreground font-bold rounded-xl py-3.5 mt-2 transition-all duration-200 shadow-md shadow-primary/30 hover:shadow-lg hover:shadow-primary/40 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loginMutation.isPending ? (
            <><FiLoader size={18} className="animate-spin" /> Authenticating…</>
          ) : (
            <>Sign Into POS <FiArrowRight size={18} /></>
          )}
        </button>
      </form>
    </div>
  );
};

export default Login;
