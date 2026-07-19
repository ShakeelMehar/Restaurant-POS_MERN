import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { login } from "../../https/index";
import { enqueueSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slices/userSlice";
import { ensureTenantCache } from "../../utils/db";
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
        onSuccess: async (res) => {
            const { _id, name, email, phone, role, restaurantId, forcePasswordChange } = res.data.data;
            if (res.data.accessToken) {
                localStorage.setItem("accessToken", res.data.accessToken);
            }
            // Purge the offline cache if it belongs to a different restaurant —
            // must happen before any catalog download or queue replay kicks in
            await ensureTenantCache(restaurantId);
            dispatch(setUser({ _id, name, email, phone, role, restaurantId, forcePasswordChange }));
            navigate("/");
        },
        onError: (error) => {
            enqueueSnackbar(error?.response?.data?.message || "Login failed", {
                variant: "error",
            });
        },
    });

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit} className="space-y-0">
                <div className="border mb-2 border-[hsl(var(--border-strong))] rounded-[8px] overflow-hidden">
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email address"
                        required
                        className="w-full bg-card px-4 py-4 text-[15px] text-foreground placeholder:text-muted outline-none border-b border-[hsl(var(--border-strong))] focus:bg-[hsl(var(--surface-soft))] transition-colors"
                    />
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                        required
                        className="w-full bg-card px-4 py-4 text-[15px] text-foreground placeholder:text-muted outline-none focus:bg-[hsl(var(--surface-soft))] transition-colors"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loginMutation.isPending}
                    className="w-full btn btn-primary py-4 text-[16px] font-bold mt-8 h-auto">
                    {loginMutation.isPending ? (
                        <>
                            <FiLoader size={18} className="animate-spin" />{" "}
                            Authenticating…
                        </>
                    ) : (
                        "Login"
                    )}
                </button>
            </form>
        </div>
    );
};

export default Login;
