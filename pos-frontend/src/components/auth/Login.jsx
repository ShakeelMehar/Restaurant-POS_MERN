import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query"
import { login } from "../../https/index"
import { enqueueSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
 
const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const[formData, setFormData] = useState({
      email: "",
      password: "",
    });
  
    const handleChange = (e) => {
      setFormData({...formData, [e.target.name]: e.target.value});
    }

  
    const handleSubmit = (e) => {
      e.preventDefault();
      loginMutation.mutate(formData);
    }

    const loginMutation = useMutation({
      mutationFn: (reqData) => login(reqData),
      onSuccess: (res) => {
          const { data } = res;
          console.log(data);
          const { _id, name, email, phone, role } = data.data;
          dispatch(setUser({ _id, name, email, phone, role }));
          navigate("/");
      },
      onError: (error) => {
        const { response } = error;
        enqueueSnackbar(response.data.message, { variant: "error" });
      }
    })

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-300 text-sm font-semibold mb-2 ml-1">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@restaurant.com"
              className="w-full bg-[#1a1a1a] border border-[#333] text-white rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-[#c6893f] focus:ring-1 focus:ring-[#c6893f] transition-all shadow-inner"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-gray-300 text-sm font-semibold mb-2 ml-1">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full bg-[#1a1a1a] border border-[#333] text-white rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-[#c6893f] focus:ring-1 focus:ring-[#c6893f] transition-all shadow-inner"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full bg-gradient-to-r from-[#c6893f] to-[#a56c2d] hover:from-[#d19752] hover:to-[#b87c38] text-white font-bold rounded-xl py-4 mt-2 transition-all shadow-[0_0_20px_rgba(198,137,63,0.3)] hover:shadow-[0_0_25px_rgba(198,137,63,0.5)] active:scale-[0.98] flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loginMutation.isPending ? "Authenticating..." : "Sign Into POS"}
          {!loginMutation.isPending && (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          )}
        </button>
      </form>
    </div>
  );
};

export default Login;
