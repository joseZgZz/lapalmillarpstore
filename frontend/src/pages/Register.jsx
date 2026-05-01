import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import {
  UserPlus,
  Mail,
  Lock,
  User,
  Calendar,
  LogIn,
  Gamepad2,
} from "lucide-react";
import API_URL from "../config/api";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    birthdate: "",
  });
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(
        formData.username,
        formData.email,
        formData.password,
        formData.birthdate,
      );
      Swal.fire({
        title: "¡Cuenta Creada!",
        text: "Bienvenido a la comunidad de La Palmilla RP.",
        icon: "success",
        background: "#0a0a0a",
        color: "#fff",
        confirmButtonColor: "#ff2e2e",
      });
      navigate("/store");
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.error || "No se pudo crear la cuenta",
        "error",
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center pt-20 pb-10 px-4 relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/5 blur-[120px] rounded-full"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full glass-card rounded-[3rem] p-10 border border-white/5 relative z-10"
      >
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="p-4 bg-primary/10 rounded-2xl text-primary mb-6 ring-1 ring-primary/20">
            <UserPlus size={40} />
          </div>
          <h1 className="text-4xl font-display font-black text-white italic tracking-tighter uppercase mb-2">
            Crear <span className="text-primary">Cuenta</span>
          </h1>
          <p className="text-gray-500 font-medium">
            Únete a la nueva era del Roleplay premium.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative group">
            <User
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-primary transition-colors"
              size={20}
            />
            <input
              type="text"
              placeholder="Nombre de Usuario"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all font-bold"
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
            />
          </div>

          <div className="relative group">
            <Mail
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-primary transition-colors"
              size={20}
            />
            <input
              type="email"
              placeholder="Correo Electrónico"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all font-bold"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          <div className="relative group">
            <Lock
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-primary transition-colors"
              size={20}
            />
            <input
              type="password"
              placeholder="Contraseña"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all font-bold"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>

          <div className="relative group">
            <Calendar
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-primary transition-colors"
              size={20}
            />
            <input
              type="date"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all font-bold"
              onChange={(e) =>
                setFormData({ ...formData, birthdate: e.target.value })
              }
              required
            />
          </div>

          <button className="w-full btn-card-primary py-5 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 transform hover:-translate-y-1 transition-all active:scale-95 uppercase tracking-widest mt-4">
            FINALIZAR REGISTRO
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-white/5 text-center">
          <p className="text-gray-500 font-bold mb-4">
            O regístrate con servicios
          </p>
          <button className="w-full flex items-center justify-center gap-3 bg-[#5865F2] hover:bg-[#4752C4] text-white p-4 rounded-2xl font-bold transition-all mb-6">
            <Gamepad2 size={20} /> Discord Auth
          </button>

          <p className="text-gray-500 text-sm font-medium">
            ¿Ya tienes una cuenta?{" "}
            <Link
              to="/login"
              className="text-primary hover:underline font-black"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
