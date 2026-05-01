import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShieldCheck, Zap } from "lucide-react";

const AuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
      checkAuth().then(() => {
        setTimeout(() => {
          navigate("/store");
        }, 1500);
      });
    } else {
      navigate("/");
    }
  }, [searchParams, navigate, checkAuth]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] relative overflow-hidden">
      <div className="absolute w-96 h-96 bg-primary/20 blur-[150px] rounded-full animate-pulse"></div>

      <div className="relative glass-card p-12 rounded-[3rem] flex flex-col items-center text-center glow-border animate-fade-in-up">
        <div className="w-24 h-24 bg-primary/10 rounded-[2.5rem] border border-primary/20 flex items-center justify-center mb-8 relative">
          <ShieldCheck size={48} className="text-primary" />
          <Zap
            size={24}
            className="text-secondary absolute -top-2 -right-2 animate-bounce"
          />
        </div>

        <h2 className="text-3xl font-display font-black text-white mb-2">
          AUTH_SYNCHRONIZED
        </h2>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-ping"></div>
          <p className="text-gray-500 font-bold uppercase tracking-[0.4em] text-[10px]">
            Secure Gateway Initiated
          </p>
        </div>

        <div className="mt-12 w-48 h-1 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-secondary w-full animate-loading-bar"></div>
        </div>
      </div>
    </div>
  );
};

export default AuthSuccess;
