import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import axios from "axios";
import API_URL from "../config/api";
import Swal from "sweetalert2";
import { Trophy, Clock, CheckCircle2, Lock, Star, Zap } from "lucide-react";

const BattlePass = () => {
    const { user, checkAuth } = useAuth();
    const [loading, setLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState("");

    const rewards = [
        { level: 1, name: "Kit de Bienvenida PC", prize: "500 CC", icon: "🎁" },
        { level: 2, name: "Vehículo Básico", prize: "Habanero", icon: "🚗" },
        { level: 3, name: "Bonus de Dinero", prize: "1000 CC", icon: "💰" },
        { level: 4, name: "Caja Sorpresa", prize: "Lootbox Bronce", icon: "📦" },
        { level: 5, name: "Kit VIP Temporal", prize: "3 Días VIP", icon: "👑" },
    ];

    useEffect(() => {
        if (user?.battlePass?.lastClaimed) {
            const timer = setInterval(() => {
                const now = new Date();
                const last = new Date(user.battlePass.lastClaimed);
                const diff = 24 * 60 * 60 * 1000 - (now - last);

                if (diff <= 0) {
                    setTimeLeft("¡YA DISPONIBLE!");
                } else {
                    const h = Math.floor(diff / (1000 * 60 * 60));
                    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                    const s = Math.floor((diff % (1000 * 60)) / 1000);
                    setTimeLeft(`${h}h ${m}m ${s}s`);
                }
            }, 1000);
            return () => clearInterval(timer);
        } else {
            setTimeLeft("¡YA DISPONIBLE!");
        }
    }, [user]);

    const handleClaim = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(`${API_URL}/api/battlepass/claim`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            Swal.fire({
                title: "¡Nivel Superado!",
                text: `Has desbloqueado: ${res.data.reward.name}`,
                icon: "success",
                background: "#111",
                color: "#fff",
                confirmButtonColor: "#ff2e2e"
            });
            await checkAuth();
        } catch (err) {
            Swal.fire({
                title: "Bloqueado",
                text: err.response?.data?.error || "Error al reclamar",
                icon: "error",
                background: "#111",
                color: "#fff"
            });
        }
        setLoading(false);
    };

    if (user?.platform !== "PC") {
        return (
            <div className="min-h-screen bg-[#0a0a0a] pt-32 flex items-center justify-center p-4">
                <div className="glass-card p-12 rounded-[3.5rem] text-center max-w-lg">
                    <Lock size={64} className="text-primary mx-auto mb-6 opacity-20" />
                    <h1 className="text-3xl font-display font-black text-white mb-4 italic uppercase">Acceso Restringido</h1>
                    <p className="text-gray-500 font-medium">El Pase de Batalla es una recompensa exclusiva para ciudadanos que juegan en PC.</p>
                </div>
            </div>
        );
    }

    const currentLvl = user.battlePass?.currentLevel || 1;

    return (
        <div className="min-h-screen bg-[#0a0a0a] pt-40 pb-20 bg-grid relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                {/* HEADER */}
                <header className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
                    <div className="text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-1 bg-primary/10 rounded-full border border-primary/20 mb-4">
                            <Star size={14} className="text-primary fill-primary" />
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Exclusivo Ciudadanos PC</span>
                        </div>
                        <h1 className="text-6xl md:text-7xl font-display font-black text-white tracking-tighter uppercase italic">
                            Battle <span className="text-primary not-italic">Pass</span>
                        </h1>
                        <p className="text-xl text-gray-400 mt-2 font-medium">Temporada 1: El Despertar de La Palmilla</p>
                    </div>

                    <div className="glass-card p-8 rounded-[2.5rem] bg-white/[0.02] border-white/5 flex items-center gap-6">
                        <div className="text-right">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">Próximo Nivel en</p>
                            <p className="text-3xl font-display font-black text-secondary">{timeLeft}</p>
                        </div>
                        <button
                            onClick={handleClaim}
                            disabled={loading || timeLeft !== "¡YA DISPONIBLE!"}
                            className={`p-6 rounded-2xl transition-all shadow-xl ${timeLeft === "¡YA DISPONIBLE!"
                                    ? "bg-primary text-white shadow-primary/20 hover:scale-110 active:scale-95"
                                    : "bg-white/5 text-gray-600 grayscale cursor-not-allowed border border-white/5"
                                }`}
                        >
                            <Trophy size={32} />
                        </button>
                    </div>
                </header>

                {/* PROGRESS BAR */}
                <div className="glass-card p-10 rounded-[3rem] mb-12 border-white/5 bg-white/[0.01]">
                    <div className="flex justify-between items-end mb-6 px-2">
                        <div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Progreso Actual</p>
                            <p className="text-2xl font-black text-white">Nivel {currentLvl} <span className="text-gray-600">/ 5</span></p>
                        </div>
                        <p className="text-xs font-bold text-primary italic uppercase tracking-widest">
                            {Math.round(((currentLvl - 1) / 5) * 100)}% Completado
                        </p>
                    </div>
                    <div className="w-full h-8 bg-black/40 rounded-full p-2 border border-white/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentLvl - 1) / 5) * 100}%` }}
                            className="h-full bg-gradient-to-r from-primary to-[#ff6b6b] rounded-full shadow-[0_0_20px_rgba(255,46,46,0.5)]"
                        />
                    </div>
                </div>

                {/* REWARDS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    {rewards.map((reward, i) => {
                        const isClaimed = i + 1 < currentLvl;
                        const isCurrent = i + 1 === currentLvl;
                        const isLocked = i + 1 > currentLvl;

                        return (
                            <div
                                key={i}
                                className={`glass-card p-8 rounded-[2.5rem] relative transition-all duration-500 ${isCurrent ? "scale-105 border-primary shadow-2xl shadow-primary/10 bg-primary/5" : "opacity-80 scale-100 border-white/5"
                                    } ${isClaimed ? "grayscale-[0.8]" : ""}`}
                            >
                                {isClaimed && (
                                    <div className="absolute top-4 right-4 text-green-500">
                                        <CheckCircle2 size={24} />
                                    </div>
                                )}
                                {isLocked && (
                                    <div className="absolute top-4 right-4 text-gray-600">
                                        <Lock size={20} />
                                    </div>
                                )}

                                <div className="text-center">
                                    <span className="text-5xl mb-6 block drop-shadow-lg">{reward.icon}</span>
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Nivel {reward.level}</p>
                                    <h3 className={`text-sm font-black uppercase tracking-tight mb-4 ${isCurrent ? "text-white" : "text-gray-400"}`}>
                                        {reward.name}
                                    </h3>
                                    <div className={`text-[10px] font-black inline-block px-3 py-1 rounded-full ${isCurrent ? "bg-primary/20 text-primary border border-primary/30" : "bg-white/5 text-gray-600"
                                        }`}>
                                        {reward.prize}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default BattlePass;
