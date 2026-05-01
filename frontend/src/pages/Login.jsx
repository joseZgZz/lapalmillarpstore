import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { LogIn, Mail, Lock, Shield } from "lucide-react";

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(formData.email, formData.password);
            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: "Bienvenido de nuevo",
                showConfirmButton: false,
                timer: 2000,
                background: "#0a0a0a",
                color: "#fff",
            });
            navigate("/store");
        } catch (err) {
            Swal.fire("Error", "Credenciales inválidas o cuenta no activa.", "error");
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center py-20 px-4 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/5 blur-[150px] rounded-full"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full glass-card rounded-[3rem] p-12 border border-white/5 relative z-10"
            >
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="p-4 bg-[#ffd000]/10 rounded-2xl text-[#ffd000] mb-6 ring-1 ring-[#ffd000]/20">
                        <Shield size={40} />
                    </div>
                    <h1 className="text-4xl font-display font-black text-white italic tracking-tighter uppercase mb-2">
                        Acceso <span className="text-secondary">Seguro</span>
                    </h1>
                    <p className="text-gray-500 font-medium whitespace-nowrap">
                        Gestiona tus activos y recompensas premium.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative group">
                        <Mail
                            className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-secondary transition-colors"
                            size={20}
                        />
                        <input
                            type="email"
                            placeholder="Email de la cuenta"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary/50 transition-all font-bold"
                            onChange={(e) =>
                                setFormData({ ...formData, email: e.target.value })
                            }
                            required
                        />
                    </div>

                    <div className="relative group">
                        <Lock
                            className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-secondary transition-colors"
                            size={20}
                        />
                        <input
                            type="password"
                            placeholder="Contraseña Maestra"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary/50 transition-all font-bold"
                            onChange={(e) =>
                                setFormData({ ...formData, password: e.target.value })
                            }
                            required
                        />
                    </div>

                    <button className="w-full btn-card-primary !bg-[#ffd000] !text-black py-5 rounded-2xl font-black text-lg shadow-xl shadow-[#ffd000]/10 transform hover:-translate-y-1 transition-all active:scale-95 uppercase tracking-widest mt-4">
                        ACCEDER AHORA
                    </button>
                </form>

                <div className="mt-10 pt-8 border-t border-white/5 text-center">
                    <p className="text-gray-500 text-sm font-medium">
                        ¿Nuevo en la ciudad?{" "}
                        <Link
                            to="/register"
                            className="text-secondary hover:underline font-black"
                        >
                            Crea tu cuenta aquí
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
