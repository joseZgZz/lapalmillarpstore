import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Bell, Calendar, ChevronRight, Zap, Star, ShieldCheck, Trophy, Info } from 'lucide-react';
import API_URL from '../config/api';

const Announcements = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/announcements`);
                setNews(res.data);
            } catch (err) { }
            setLoading(false);
        };
        fetchAnnouncements();
    }, []);

    const getIcon = (category) => {
        if (category === 'Alert') return ShieldCheck;
        if (category === 'Event') return Trophy;
        return Zap;
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-20 bg-grid overflow-hidden">
            <div className="max-w-5xl mx-auto px-4 relative z-10">

                <header className="mb-20 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-3 px-6 py-2 bg-primary/10 rounded-full border border-primary/20 mb-6"
                    >
                        <Bell size={18} className="text-primary animate-bounce-soft" />
                        <span className="text-xs font-black text-primary uppercase tracking-[0.4em]">Intelligence Feed</span>
                    </motion.div>
                    <h1 className="text-6xl md:text-7xl font-display font-black text-white tracking-tighter uppercase mb-6 leading-none">
                        ÚLTIMAS <span className="text-primary italic">NOVEDADES</span>
                    </h1>
                    <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto tracking-tight">
                        Mantente al tanto de todas las actualizaciones, eventos y cambios críticos dentro del ecosistema de La Palmilla RP.
                    </p>
                </header>

                <div className="space-y-8">
                    {loading ? (
                        <div className="text-center py-20 opacity-20"><Zap size={60} className="mx-auto animate-pulse" /></div>
                    ) : news.length === 0 ? (
                        <div className="glass-card rounded-[3rem] p-20 border border-white/5 text-center">
                            <Info size={48} className="text-gray-600 mx-auto mb-6" />
                            <h3 className="text-2xl font-bold text-white mb-2">Sin anuncios recientes</h3>
                            <p className="text-gray-500">Estamos preparando grandes cosas. ¡Vuelve pronto!</p>
                        </div>
                    ) : (
                        news.map((item, i) => {
                            const Icon = getIcon(item.category);
                            return (
                                <motion.article
                                    key={item._id}
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    viewport={{ once: true }}
                                    className="glass-card rounded-[3rem] p-10 border border-white/5 group hover:border-primary/30 transition-all duration-500 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-40 h-40 opacity-10 blur-[80px] pointer-events-none" style={{ backgroundColor: item.category === 'Alert' ? '#ff2e2e' : item.category === 'Event' ? '#ffd000' : '#3b82f6' }}></div>

                                    <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                                        <div className={`p-6 rounded-[2rem] bg-white/5 text-white shadow-xl flex items-center justify-center border border-white/5`}>
                                            <Icon size={40} className={item.category === 'Update' ? 'text-blue-500' : item.category === 'Alert' ? 'text-primary' : 'text-secondary'} />
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center gap-4 mb-3">
                                                <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                                    <Calendar size={12} />
                                                    {new Date(item.date).toLocaleDateString()}
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-widest ${item.category === 'Alert' ? 'bg-primary' : item.category === 'Event' ? 'bg-secondary' : 'bg-blue-500'}`}>
                                                    {item.category}
                                                </span>
                                            </div>
                                            <h2 className="text-3xl font-bold text-white mb-4 group-hover:text-primary transition-colors tracking-tight uppercase leading-tight">
                                                {item.title}
                                            </h2>
                                            <p className="text-lg text-gray-500 font-medium leading-relaxed mb-6">
                                                {item.content}
                                            </p>
                                        </div>
                                    </div>
                                </motion.article>
                            )
                        })
                    )}
                </div>

                <div className="mt-20 glass-card rounded-[2.5rem] p-12 border border-white/5 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/5 blur-[50px] pointer-events-none"></div>
                    <div className="relative z-10 flex flex-col items-center">
                        <Star size={40} className="text-secondary mb-6" />
                        <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">¿Quieres ser el primero en saberlo?</h3>
                        <p className="text-gray-500 font-medium mb-8 max-w-lg">Configura las notificaciones en nuestro servidor de Discord para recibir alertas instantáneas en tu dispositivo.</p>
                        <button className="bg-[#5865F2] hover:bg-[#4752C4] text-white px-10 py-5 rounded-2xl font-black text-lg transition-all hover:scale-105 active:scale-95 shadow-xl shadow-[#5865F2]/20">
                            UNIRSE A DISCORD OFICIAL
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Announcements;
