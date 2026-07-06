import React, { useEffect, useState } from "react";
import logo from "../assets/images/logo.png";
import restaurantImg from "../assets/images/restaurant-img.jpg";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";

const Auth = () => {
  const [isRegister, setIsRegister] = useState(false);

  useEffect(() => {
    document.title = "AL HAFIZ YAKHNI PULAO | Authentication";
  }, []);

  return (
    <div className="flex min-h-screen w-full font-sans bg-background relative overflow-hidden">
      
      {/* Left Pane - Image and Branding (Hidden on smaller screens) */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center flex-col">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={restaurantImg} 
            alt="Restaurant" 
            className="w-full h-full object-cover"
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/80 bg-gradient-to-t from-background via-black/60 to-transparent"></div>
        </div>
        
        {/* Branding Content */}
        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-center h-full">
            <div className="flex items-center justify-center h-24 w-24 rounded-3xl bg-gradient-to-br from-primary to-blue-500 shadow-glow mb-8 animate-slide-up">
              <img src={logo} alt="Logo" className="h-16 w-16 object-contain" />
            </div>
            <h1 className="text-4xl xl:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
              AL HAFIZ <br />
              <span className="text-primary">YAKHNI PULAO</span>
            </h1>
            <p className="text-base text-gray-300 max-w-md animate-slide-up" style={{ animationDelay: '200ms' }}>
              Experience the authentic taste of traditional Yakhni Pulao. 
              Our POS system ensures quick, seamless, and efficient service.
            </p>
        </div>
      </div>

      {/* Right Pane - Form */}
      <div className="w-full lg:w-1/2 flex flex-col relative h-screen">
        
        {/* Ambient glow for the form side */}
        <div className="absolute top-[-10%] right-[-5%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-5%] h-[400px] w-[400px] rounded-full bg-accent/5 blur-[100px] pointer-events-none lg:hidden" />

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto flex flex-col p-4 sm:p-12 scrollbar-hide">
          <div className="w-full max-w-[420px] mx-auto my-auto relative z-10 py-10 animate-slide-up">
            
            {/* Logo and Branding for Mobile */}
            <div className="flex lg:hidden flex-col items-center gap-2 mb-10">
              <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-blue-500 shadow-glow">
                <img src={logo} alt="Logo" className="h-10 w-10 object-contain" />
              </div>
              <h1 className="text-xl sm:text-3xl font-extrabold text-foreground tracking-tight text-center leading-tight">
                AL HAFIZ <br />
                <span className="text-gradient-primary">YAKHNI PULAO</span>
              </h1>
            </div>

            {/* Heading */}
            <div className="mb-8 lg:text-left text-center">
              <h2 className="text-3xl font-bold text-foreground tracking-tight mb-2">
                {isRegister ? "Create Account" : "Welcome back"}
              </h2>
              <p className="text-muted-foreground text-[15px]">
                {isRegister
                  ? "Register a new employee account to get started."
                  : "Enter your credentials to access the POS system."}
              </p>
            </div>

            {/* Form card */}
            <div className="bg-card/50 backdrop-blur-xl lg:bg-transparent lg:backdrop-blur-none lg:border-none lg:shadow-none rounded-2xl border border-border shadow-card p-7 lg:p-0 relative">
              {/* Subtle top gradient line only on mobile */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent rounded-t-2xl lg:hidden" />
              
              {isRegister ? (
                <Register setIsRegister={setIsRegister} />
              ) : (
                <Login />
              )}

              <div className="mt-8 pt-6 border-t border-border flex justify-center lg:justify-start">
                <p className="text-sm text-muted-foreground">
                  {isRegister ? "Already have an account? " : "Don't have an account? "}
                  <button
                    onClick={() => setIsRegister(!isRegister)}
                    className="text-primary font-bold hover:underline underline-offset-2 transition-all ml-1"
                  >
                    {isRegister ? "Sign in" : "Sign up"}
                  </button>
                </p>
              </div>
            </div>

          </div>
          
          {/* Footer note */}
          <div className="mt-auto pt-6 text-center lg:text-left">
            <p className="text-xs text-muted-foreground opacity-60">
              © {new Date().getFullYear()} AL HAFIZ YAKHNI PULAO • All rights reserved
            </p>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Auth;
