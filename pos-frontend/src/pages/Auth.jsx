import React, { useEffect, useState } from "react";
import logo from "../assets/images/logo.png";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";

const Auth = () => {
  const [isRegister, setIsRegister] = useState(false);

  useEffect(() => {
    document.title = "AL HAFIZ YAKHNI PULAO | Authentication";
  }, []);

  return (
    <div className="flex min-h-screen w-full font-sans bg-background items-center justify-center relative overflow-hidden p-6 sm:p-10">
      {/* Ambient glow */}
      <div className="absolute top-[-10%] right-[-5%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] h-[400px] w-[400px] rounded-full bg-accent/5 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-[420px] relative z-10 animate-slide-up">
        {/* Logo and Branding */}
        <div className="flex flex-col items-center gap-4 mb-10">
          <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-amber-500 shadow-glow">
            <img src={logo} alt="Logo" className="h-10 w-10 object-contain" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight text-center leading-tight">
            AL HAFIZ <br />
            <span className="text-gradient-gold">YAKHNI PULAO</span>
          </h1>
        </div>

        {/* Heading */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-foreground tracking-tight mb-2">
            {isRegister ? "Create Account" : "Welcome back"}
          </h2>
          <p className="text-muted-foreground text-[14px]">
            {isRegister
              ? "Register a new employee account"
              : "Enter your credentials to access the POS"}
          </p>
        </div>

        {/* Form card */}
        <div className="bg-card rounded-2xl border border-border shadow-card p-7 relative">
          {/* Subtle top gradient line */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent rounded-t-2xl" />
          {isRegister ? (
            <Register setIsRegister={setIsRegister} />
          ) : (
            <Login />
          )}

          <div className="mt-6 pt-5 border-t border-border flex justify-center">
            <p className="text-sm text-muted-foreground">
              {isRegister ? "Already have an account? " : "Don't have an account? "}
              <button
                onClick={() => setIsRegister(!isRegister)}
                className="text-primary font-bold hover:underline underline-offset-2 transition-all"
              >
                {isRegister ? "Sign in" : "Sign up"}
              </button>
            </p>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-muted-foreground mt-8 opacity-60">
          © {new Date().getFullYear()} AL HAFIZ YAKHNI PULAO • All rights reserved
        </p>
      </div>
    </div>
  );
};

export default Auth;
