import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import {
  User,
  Wallet,
  History,
  Package,
  ShieldCheck,
  Crown,
  ChevronRight,
  LogOut,
  Coins,
  CreditCard,
  Clock,
  Monitor,
  Gamepad2,
  Link as LinkIcon,
  Save,
  MessageSquare,
  Briefcase,
} from "lucide-react";
import Swal from "sweetalert2";
import API_URL from "../config/api";

const Profile = () => {
  const { user, logout, checkAuth } = useAuth();
  const [logs, setLogs] = useState([]);
  const [linkForm, setLinkForm] = useState({
    pcUsername: "",
    consoleUsername: "",
    discordUsername: ""
  });

  useEffect(() => {
    if (user) {
      setLinkForm({
        pcUsername: user.pcUsername || "",
        consoleUsername: user.consoleUsername || "",
        discordUsername: user.discordUsername || ""
      });
    }
  }, [user]);

  const handleUpdateLinks = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`${API_URL}/api/users/profile/link`, linkForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await checkAuth();
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Cuentas vinculadas',
        showConfirmButton: false,
        timer: 3000,
        background: '#0a0a0a',
        color: '#fff'
      });
    } catch (err) {
      Swal.fire('Error', 'Fallo al vincular', 'error');
    }
  };

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/api/users/profile/logs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLogs(res.data);
      } catch (err) { }
    };
    if (user) fetchLogs();
  }, [user]);

  if (!user)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#0a0a0a]">
        <h1 className="text-4xl font-black text-white mb-8 uppercase tracking-widest opacity-20">
          System Locked
        </h1>
        <button className="btn-card-primary px-10 py-4">
          Authenticate via Discord
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-20 bg-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Profile Section */}
        <header className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-[3rem] p-10 md:p-12 border border-white/5 relative overflow-hidden flex flex-col lg:flex-row items-center gap-10"
          >
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 blur-[100px] pointer-events-none"></div>

            <div className="relative">
              <div className="w-40 h-40 rounded-[2.5rem] overflow-hidden border-4 border-white/5 shadow-2xl relative">
                <img
                  src={user.avatar}
                  className="w-full h-full object-cover"
                  alt=""
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-primary p-3 rounded-2xl shadow-xl shadow-primary/30 border-2 border-[#121212] flex items-center justify-center">
                <Crown size={20} className="text-white" />
              </div>
            </div>

            <div className="flex-1 text-center lg:text-left">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full border border-primary/20">
                  <ShieldCheck size={14} className="text-primary" />
                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                    {user.role || "Player"} Verified
                  </span>
                </div>
                {user.platform && (
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary/10 rounded-full border border-secondary/20">
                    {user.platform === "PC" ? <Monitor size={14} className="text-secondary" /> : <Gamepad2 size={14} className="text-secondary" />}
                    <span className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">
                      {user.platform} Player
                    </span>
                  </div>
                )}
              </div>
              <h1 className="text-5xl font-display font-black text-white mb-2 tracking-tighter uppercase">
                {user.username}
              </h1>
              <p className="text-gray-500 font-medium tracking-wide">
                ID de Cuenta:{" "}
                <span className="text-gray-300">
                  #PALM-{user._id.slice(-6).toUpperCase()}
                </span>
              </p>
            </div>

            <div className="flex gap-4 w-full lg:w-auto">
              <button
                onClick={logout}
                className="flex-1 lg:flex-none btn-card-secondary px-8 py-5 text-sm font-black uppercase tracking-widest text-red-500 hover:text-red-400"
              >
                <LogOut size={20} className="mr-2" /> Deauthenticate
              </button>
            </div>
          </motion.div>
        </header>

        {/* INFO CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* TRABAJO / NEGOCIO */}
          {user.job?.name && (
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="glass-card p-10 rounded-[3rem] border border-secondary/20 bg-secondary/5 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 blur-[60px] pointer-events-none"></div>
              <div className="flex items-center gap-5 mb-8">
                <div className="p-4 bg-secondary/20 rounded-2xl text-secondary">
                  <Briefcase size={28} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-1">Tu Negocio</p>
                  <h4 className="text-xl font-black text-white uppercase tracking-tighter leading-none">{user.job.name}</h4>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center px-4 py-3 bg-black/40 rounded-2xl">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Estado</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${user.job.isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${user.job.isOpen ? 'text-green-500' : 'text-red-500'}`}>
                      {user.job.isOpen ? 'ABIERTO' : 'CERRADO'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={async () => {
                    try {
                      const token = localStorage.getItem("token");
                      await axios.post(`${API_URL}/api/user/toggle-job`, {}, {
                        headers: { Authorization: `Bearer ${token}` }
                      });
                      checkAuth();
                      Swal.fire({
                        toast: true,
                        position: 'top-end',
                        icon: 'success',
                        title: 'Estado actualizado',
                        showConfirmButton: false,
                        timer: 2000,
                        background: '#0a0a0a',
                        color: '#fff'
                      });
                    } catch (e) { console.error(e); }
                  }}
                  className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${user.job.isOpen
                    ? "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20"
                    : "bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500/20"
                    }`}
                >
                  {user.job.isOpen ? 'CERRAR NEGOCIO' : 'ABRIR NEGOCIO'}
                </button>
              </div>
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Stats & Wallet - Left Side */}
          <div className="lg:col-span-4 space-y-8">
            <section className="glass-card rounded-[2.5rem] p-8 border border-white/5">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Cartera Global
                </h3>
                <div className="p-2 bg-white/5 rounded-xl text-gray-400">
                  <Wallet size={16} />
                </div>
              </div>
              <div className="mb-8">
                <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest block mb-2">
                  Disponible
                </span>
                <div className="flex items-end gap-2 text-secondary">
                  <span className="text-6xl font-black">{user.coins}</span>
                  <span className="text-sm font-bold uppercase tracking-widest mb-2 text-gray-500">
                    Monedas
                  </span>
                </div>
              </div>
              <button className="w-full btn-card-primary py-4 text-xs font-black uppercase tracking-widest shadow-xl">
                RECARGAR MONEDAS CC
              </button>
            </section>

            <section className="glass-card rounded-[2.5rem] p-8 border border-white/5">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Vincular Cuentas
                </h3>
                <div className="p-2 bg-white/5 rounded-xl text-secondary">
                  <LinkIcon size={16} />
                </div>
              </div>
              <div className="space-y-4">
                <div className="relative group">
                  <Monitor className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-secondary transition-colors" size={16} />
                  <input
                    type="text"
                    placeholder="ID de PC (Steam/Epic)"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-secondary/50 font-bold"
                    value={linkForm.pcUsername}
                    onChange={(e) => setLinkForm({ ...linkForm, pcUsername: e.target.value })}
                  />
                </div>
                <div className="relative group">
                  <Gamepad2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-primary transition-colors" size={16} />
                  <input
                    type="text"
                    placeholder="ID de Consola (PSN/Xbox)"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 font-bold"
                    value={linkForm.consoleUsername}
                    onChange={(e) => setLinkForm({ ...linkForm, consoleUsername: e.target.value })}
                  />
                </div>
                <div className="relative group">
                  <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#5865F2] transition-colors" size={16} />
                  <input
                    type="text"
                    placeholder="Usuario de Discord (ej: jose.dev)"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#5865F2]/50 font-bold"
                    value={linkForm.discordUsername}
                    onChange={(e) => setLinkForm({ ...linkForm, discordUsername: e.target.value })}
                  />
                </div>
                <button onClick={handleUpdateLinks} className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                  <Save size={14} /> Guardar Vinculación
                </button>
              </div>
            </section>

            <section className="glass-card rounded-[2.5rem] p-8 border border-white/5">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">
                Estado del Sistema
              </h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-white/[0.02] rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-sm font-bold text-gray-300">
                      Conexión Segura
                    </span>
                  </div>
                  <span className="text-[10px] font-black text-gray-600">
                    ONLINE
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/[0.02] rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                      <CreditCard size={16} />
                    </div>
                    <span className="text-sm font-bold text-gray-300">
                      Método de Pago
                    </span>
                  </div>
                  <span className="text-[10px] font-black text-gray-600">
                    PAYPAL/STRIPE
                  </span>
                </div>
              </div>
            </section>
          </div>

          {/* History & Table - Right Side */}
          <div className="lg:col-span-8">
            <section className="glass-card rounded-[2.5rem] p-10 border border-white/5 h-full">
              <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/5">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-secondary/10 rounded-2xl text-secondary">
                    <History size={24} />
                  </div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                    Historial de Transacciones
                  </h2>
                </div>
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                  {logs.length} Operaciones
                </span>
              </div>

              <div className="overflow-x-auto">
                {logs.length === 0 ? (
                  <div className="py-24 flex flex-col items-center justify-center opacity-10">
                    <Clock size={64} className="mb-4" />
                    <p className="text-xl font-black uppercase tracking-[0.3em]">
                      Sin registros
                    </p>
                  </div>
                ) : (
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] font-black text-gray-600 uppercase tracking-widest border-b border-white/5">
                        <th className="pb-4 px-4 font-black">
                          Artículo Adquirido
                        </th>
                        <th className="pb-4 px-4 font-black">N° de Ticket</th>
                        <th className="pb-4 px-4 font-black text-right">
                          Costo
                        </th>
                        <th className="pb-4 px-4 font-black text-right">
                          Fecha
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {logs.map((log, i) => (
                        <motion.tr
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="group hover:bg-white/[0.01] transition-all"
                        >
                          <td className="py-6 px-4">
                            <div className="flex items-center gap-4">
                              <div className="p-2 bg-white/5 rounded-xl text-gray-400 group-hover:text-primary transition-colors">
                                <Package size={18} />
                              </div>
                              <span className="text-sm font-bold text-white uppercase tracking-tight">
                                {log.productName || "Artículo Desconocido"}
                              </span>
                            </div>
                          </td>
                          <td className="py-6 px-4">
                            <code className="text-[10px] font-bold text-gray-500 break-all bg-white/5 px-2 py-1 rounded-md">
                              {log.ticketNumber || `#HASH-${log._id.slice(-10).toUpperCase()}`}
                            </code>
                          </td>
                          <td className="py-6 px-4 text-right">
                            <span className="text-sm font-black text-secondary">
                              -{log.price || 0} CC
                            </span>
                          </td>
                          <td className="py-6 px-4 text-right">
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                              {new Date(log.date || log.createdAt).toLocaleDateString()}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
