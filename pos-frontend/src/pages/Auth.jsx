import React, { useEffect, useState } from "react";
import logo from "../assets/images/logo.png";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";

const Auth = () => {
  const [isRegister, setIsRegister] = useState(false);

  useEffect(() => {
    document.title = "Restro | Authentication";
  }, []);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background sm:bg-[hsl(var(--surface-soft))] p-4 font-sans">
      <div className="w-full max-w-[480px] bg-card sm:rounded-[14px] sm:border sm:border-[hsl(var(--border-strong))] p-6 sm:p-10 sm:shadow-[rgba(0,0,0,0.1)_0_8px_24px] relative">
        <div className="flex flex-col items-center justify-center mb-10">
          <div className="text-center mb-6">
            <h2 className="text-[14px] font-bold text-muted uppercase tracking-widest mb-1">
              Al Hafiz
            </h2>
            <h3 className="text-[18px] font-black text-foreground uppercase tracking-tight">
              Yakhni Pulao
            </h3>
          </div>
          <h1 className="text-[24px] font-bold text-foreground tracking-tight text-center">
            {isRegister ? "Create an account" : "Log in to POS"}
          </h1>
        </div>

        {isRegister ? (
          <Register setIsRegister={setIsRegister} />
        ) : (
          <Login />
        )}

        <div className="mt-8 pt-6 flex items-center justify-center gap-1 text-[15px] border-t border-[hsl(var(--border-strong))]">
          <span className="text-foreground">
            {isRegister ? "Already have an account?" : "Don't have an account?"}
          </span>
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="font-bold text-foreground hover:underline underline-offset-2"
          >
            {isRegister ? "Log in" : "Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
