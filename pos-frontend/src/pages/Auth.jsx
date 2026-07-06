import React, { useEffect, useState } from "react";
import restaurant from "../assets/images/restaurant-img.jpg"
import logo from "../assets/images/logo.png"
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";

const Auth = () => {
  const [isRegister, setIsRegister] = useState(false);

  useEffect(() => {
    document.title = "POS | Authentication"
  }, [])

  return (
    <div className="flex min-h-screen w-full font-inter bg-background">
      {/* Left Section - Hero Image with Overlay */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center bg-cover overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#c6893f]/30 to-[#0a0a0a]/90 z-10 mix-blend-multiply"></div>
        <img className="absolute w-full h-full object-cover scale-105" src={restaurant} alt="Restaurant Image" />
        <div className="absolute inset-0 bg-black/50 z-10 backdrop-blur-[2px]"></div>
        
        <div className="relative z-20 flex flex-col justify-center h-full px-16 xl:px-24">
          <div className="mb-8 inline-block">
            <div className="bg-background/60 backdrop-blur-md p-5 rounded-3xl border border-white/10 shadow-2xl">
              <img src={logo} alt="Restro Logo" className="h-16 w-16" />
            </div>
          </div>
          <h1 className="text-5xl xl:text-6xl font-extrabold text-white mb-6 leading-tight">
            Elevate your <br/><span className="text-whiteccent">restaurant</span> <br/>management.
          </h1>
          <blockquote className="text-lg xl:text-xl text-gray-300 border-l-4 border-accent pl-6 italic font-medium">
            "Serve customers the best food with prompt and friendly service in a welcoming atmosphere, and they’ll keep coming back."
          </blockquote>
        </div>
      </div>

      {/* Right Section - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-16 relative overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-[-15%] right-[-10%] w-[600px] h-[600px] bg-accent rounded-full blur-[150px] opacity-10 pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-primary rounded-full blur-[120px] opacity-5 pointer-events-none"></div>
        
        <div className="w-full max-w-md relative z-10">
          <div className="flex flex-col items-center lg:items-start mb-10">
            <div className="lg:hidden flex flex-col items-center gap-4 mb-10">
               <div className="bg-background p-4 rounded-2xl border border-border shadow-lg">
                 <img src={logo} alt="Restro Logo" className="h-12 w-12" />
               </div>
               <span className="text-2xl font-bold text-white tracking-widest uppercase">Restro</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">
              {isRegister ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="text-muted-foreground text-lg">
              {isRegister ? "Register a new employee account" : "Enter your credentials to access the POS"}
            </p>
          </div>

          {/* Form Components */}  
          <div className="bg-background p-8 rounded-3xl border border-border shadow-2xl relative">
            {isRegister ? <Register setIsRegister={setIsRegister} /> : <Login />}
            
            <div className="flex justify-center mt-6">
              <p className="text-sm text-muted-foreground">
                {isRegister ? "Already have an account? " : "Don't have an account? "}
                <button onClick={() => setIsRegister(!isRegister)} className="text-whiteccent font-semibold hover:underline cursor-pointer">
                  {isRegister ? "Sign in" : "Sign up"}
                </button>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Auth;
