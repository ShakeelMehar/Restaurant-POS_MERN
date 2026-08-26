import React, { useEffect, useState } from "react";
import restaurant from "../assets/images/restaurant-img.jpg";
import logo from "../assets/images/logo.png";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";

const Auth = () => {
  const [isRegister, setIsRegister] = useState(false);

  useEffect(() => {
    document.title = "POS | Authentication";
  }, []);

  return (
    <div className="flex min-h-screen w-full font-sans bg-background">
      {/* ── LEFT HERO ── */}
      <div className="hidden lg:flex w-[45%] xl:w-1/2 relative overflow-hidden">
        {/* Base image */}
        <img
          className="absolute inset-0 w-full h-full object-cover scale-105"
          src={restaurant}
          alt="Restaurant"
        />
        {/* Rich gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/75" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        {/* Amber glow accent */}
        <div className="absolute bottom-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-primary/20 blur-[100px] pointer-events-none" />
        <div className="absolute top-[-5%] right-[-10%] h-[300px] w-[300px] rounded-full bg-accent/10 blur-[80px] pointer-events-none" />

        {/* Content */}
        <div className="relative z-20 flex flex-col justify-between h-full px-12 xl:px-16 py-12">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-11 w-11 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg">
              <img src={logo} alt="Logo" className="h-7 w-7 object-contain" />
            </div>
            <span className="text-xl font-extrabold text-white tracking-tight">Restro</span>
          </div>

          {/* Main copy */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">Restaurant Management</span>
            </div>
            <h1 className="text-5xl xl:text-6xl font-extrabold text-white leading-[1.1] mb-6">
              Elevate your <br />
              <span className="text-gradient-gold">restaurant</span> <br />
              experience.
            </h1>
            <blockquote className="text-base xl:text-lg text-white/70 border-l-2 border-primary/60 pl-5 italic leading-relaxed max-w-sm">
              "Serve customers the best food with prompt and friendly service in a welcoming atmosphere."
            </blockquote>
          </div>

          {/* Stats row */}
          <div className="flex gap-6">
            {[
              { value: "2k+", label: "Orders Served" },
              { value: "98%", label: "Satisfaction" },
              { value: "24/7", label: "Uptime" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span className="text-2xl font-extrabold text-white">{stat.value}</span>
                <span className="text-xs text-white/50 font-medium">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT FORM PANEL ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-primary/8 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-accent/5 blur-[100px] pointer-events-none" />

        <div className="w-full max-w-[420px] relative z-10 animate-slide-up">
          {/* Mobile logo */}
          <div className="lg:hidden flex flex-col items-center gap-3 mb-8">
            <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-amber-500 shadow-glow">
              <img src={logo} alt="Logo" className="h-9 w-9 object-contain" />
            </div>
            <span className="text-xl font-extrabold text-foreground tracking-tight">Restro</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-2">
              {isRegister ? "Create Account" : "Welcome back"}
            </h2>
            <p className="text-muted-foreground text-[15px]">
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
          <p className="text-center text-xs text-muted-foreground mt-5 opacity-60">
            © {new Date().getFullYear()} Restro POS • All rights reserved
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
