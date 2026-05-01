import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import axios from "axios";
import {
  ShoppingCart,
  Zap,
  Shield,
  Sparkles,
  Gamepad2,
  ChevronRight,
  Users,
  Server,
  Crown,
} from "lucide-react";
import API_URL from "../config/api";

const Home = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/api/products`, {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });
        setFeatured(res.data.slice(0, 4));
      } catch (err) {}
    };
    fetchFeatured();
  }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(loginEmail, loginPassword);
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: "Credenciales inválidas",
        icon: "error",
        background: "#0a0a0a",
        color: "#fff",
      });
    }
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen relative overflow-x-hidden">
      {/* HEROBANNER - TEBEX STYLE */}
      <section className="relative w-full min-h-screen flex items-center justify-center pt-24 bg-grid">
        {/* Background Decor */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[150px] rounded-full"></div>
          <div className="absolute bottom-0 left-[-10%] w-[30%] h-[30%] bg-secondary/10 blur-[120px] rounded-full"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 mb-8">
              <Sparkles size={16} className="text-secondary animate-pulse" />
              <span className="text-xs font-black uppercase tracking-[0.3em] text-white">
                Official Server Store
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-display font-black text-white mb-6 tracking-tighter leading-none">
              LA PALMILLA <span className="text-primary italic">RP</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto font-medium">
              Mejora tu experiencia en el servidor con los kits VIP, vehículos
              exclusivos y recursos premium de nuestra tienda oficial.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button
                onClick={() => navigate("/store")}
                className="group relative bg-[#ff2e2e] text-white px-10 py-5 rounded-2xl font-black text-xl flex items-center gap-3 transition-all hover:scale-[1.05] shadow-[0_20px_40px_rgba(255,46,46,0.3)] hover:shadow-[0_25px_50px_rgba(255,46,46,0.5)] active:scale-95"
              >
                <ShoppingCart size={24} />
                ENTRAR A LA TIENDA
                <ChevronRight
                  size={24}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>

              {!user && (
                <button
                  onClick={() =>
                    document
                      .getElementById("login-section")
                      .scrollIntoView({ behavior: "smooth" })
                  }
                  className="bg-white/5 hover:bg-white/10 text-white px-10 py-5 rounded-2xl font-black text-xl border border-white/10 transition-all active:scale-95"
                >
                  INGRESAR
                </button>
              )}
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-20 pointer-events-none">
          <div className="w-1 h-10 bg-gradient-to-b from-white to-transparent rounded-full"></div>
        </div>
      </section>

      {/* FEATURED CARDS */}
      <section className="max-w-7xl mx-auto px-4 py-32">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="text-left">
            <h2 className="text-4xl font-display font-black text-white mb-2 tracking-tight uppercase">
              Lo más buscado
            </h2>
            <div className="w-20 h-1.5 bg-primary rounded-full"></div>
          </div>
          <button
            onClick={() => navigate("/store")}
            className="text-gray-400 font-bold hover:text-primary transition-colors flex items-center gap-2 group"
          >
            Ver todo el catálogo{" "}
            <ChevronRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featured.length > 0
            ? featured.map((product, i) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="glass-card rounded-[2rem] overflow-hidden group cursor-pointer border border-white/5 hover:border-primary/50 transition-all duration-300"
                >
                  <div className="h-56 relative overflow-hidden bg-black/40">
                    <img
                      src={product.image}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      alt=""
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-60"></div>
                    <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                      VENTA HOT
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-6 font-medium line-clamp-1">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">
                          Desde
                        </span>
                        <span className="text-2xl font-black text-secondary">
                          {product.price}{" "}
                          <span className="text-sm font-bold text-gray-400 uppercase">
                            CC
                          </span>
                        </span>
                      </div>
                      <div className="p-3 bg-white/5 rounded-xl border border-white/10 group-hover:bg-primary group-hover:border-primary transition-all shadow-xl group-hover:shadow-primary/20">
                        <ShoppingCart
                          size={20}
                          className="group-hover:text-white"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            : Array(4)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="glass-card rounded-[2rem] h-96 animate-pulse opacity-50"
                  ></div>
                ))}
        </div>
      </section>

      {/* INFO BLOCKS */}
      <section
        id="login-section"
        className="py-32 bg-white/[0.01] border-y border-white/5"
      >
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center text-center p-8 bg-[#111] rounded-[2.5rem] border border-white/5">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 shadow-[0_0_30px_rgba(255,46,46,0.1)]">
              <Zap size={32} />
            </div>
            <h4 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">
              Entrega Instantánea
            </h4>
            <p className="text-gray-400 font-medium">
              Todos los recursos se entregan automáticamente segundos después de
              la compra dentro del servidor.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-8 bg-[#111] rounded-[2.5rem] border border-white/5">
            <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary mb-6 shadow-[0_0_30px_rgba(255,208,0,0.1)]">
              <Shield size={32} />
            </div>
            <h4 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">
              Pagos Seguros
            </h4>
            <p className="text-gray-400 font-medium">
              Contamos con los sistemas de pago más seguros para proteger tus
              datos y transacciones.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-8 bg-[#111] rounded-[2.5rem] border border-white/5">
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mb-6 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
              <Crown size={32} />
            </div>
            <h4 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">
              Soporte 24/7
            </h4>
            <p className="text-gray-400 font-medium">
              Nuestro equipo técnico está siempre disponible para ayudarte con
              cualquier problema o duda.
            </p>
          </div>
        </div>
      </section>

      {/* LOGIN PORTAL */}
      {!user && (
        <section className="py-32 relative">
          <div className="max-w-4xl mx-auto px-4">
            <div className="glass-card rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] pointer-events-none"></div>

              <div className="relative z-10 text-center max-w-xl mx-auto">
                <h3 className="text-4xl md:text-5xl font-display font-black text-white mb-4 tracking-tighter uppercase">
                  Área de Clientes
                </h3>
                <p className="text-gray-400 mb-12 font-medium">
                  Ingresa para gestionar tus compras, ver tu balance y acceder a
                  recompensas exclusivas.
                </p>

                <form onSubmit={handleLogin} className="space-y-6 text-left">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="tu@email.com"
                      className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary transition-all"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                      Contraseña
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary transition-all"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full btn-card-primary py-5 font-black text-lg shadow-xl uppercase tracking-widest"
                  >
                    AUTHENTICATE SYSTEM
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* STATS SECTION */}
      <section className="py-32 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/5 pt-32">
          <div className="text-center">
            <span className="text-6xl font-display font-black text-white block mb-2 tracking-tighter">
              5.000+
            </span>
            <span className="text-xs font-black text-primary uppercase tracking-[0.4em]">
              Usuarios Activos
            </span>
          </div>
          <div className="text-center">
            <span className="text-6xl font-display font-black text-white block mb-2 tracking-tighter">
              1.200+
            </span>
            <span className="text-xs font-black text-secondary uppercase tracking-[0.4em]">
              Ventas Totales
            </span>
          </div>
          <div className="text-center">
            <span className="text-6xl font-display font-black text-white block mb-2 tracking-tighter">
              24/7
            </span>
            <span className="text-xs font-black text-blue-500 uppercase tracking-[0.4em]">
              Monitorización
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
