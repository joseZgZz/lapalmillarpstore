import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, User, Menu, X, LogIn, LogOut, Shield, Zap, ChevronRight } from 'lucide-react';

const Navbar = () => {
const { user, loginWithDiscord, logout } = useAuth();
const location = useLocation();
const [isScrolled, setIsScrolled] = useState(false);
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

useEffect(() => {
const handleScroll = () => setIsScrolled(window.scrollY > 20);
window.addEventListener('scroll', handleScroll);
return () => window.removeEventListener('scroll', handleScroll);
}, []);

const navLinks = [
{ name: 'Inicio', path: '/' },
{ name: 'Tienda', path: '/store' },
{ name: 'Novedades', path: '/announcements' },
];

return (
<nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'py-4' : 'py-8' }`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`relative glass-card rounded-[2.5rem] border border-white/10 px-6 py-3 flex items-center
            justify-between transition-all duration-500 ${isScrolled
            ? 'shadow-2xl shadow-black/50 bg-[#0a0a0a]/90 backdrop-blur-xl' : 'bg-[#0a0a0a]/40' }`}>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
            <div
                className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform">
                <Zap className="text-white fill-white" size={20} />
            </div>
            <span className="text-2xl font-display font-black text-white tracking-tighter uppercase italic">NEXUS <span
                    className="text-primary not-italic">RP</span></span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-2">
                {navLinks.map((link) => (
                <Link key={link.name} to={link.path} className={`px-6 py-2.5 rounded-2xl text-xs font-black uppercase
                    tracking-widest transition-all ${location.pathname===link.path
                    ? 'bg-white/10 text-white shadow-inner' : 'text-gray-400 hover:text-white hover:bg-white/5' }`}>
                {link.name}
                </Link>
                ))}
                {user?.role === 'admin' && (
                <Link to="/admin" className={`px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest
                    transition-all flex items-center gap-2 ${location.pathname==='/admin' ? 'bg-primary text-white'
                    : 'text-primary hover:bg-primary/10' }`}>
                <Shield size={14} /> PANEL
                </Link>
                )}
            </div>

            {/* User Area */}
            <div className="hidden md:flex items-center gap-4">
                {user ? (
                <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                    <Link to="/profile" className="flex items-center gap-3 group">
                    <div className="text-right">
                        <p className="text-[10px] font-black text-gray-500 uppercase leading-none mb-1">Bienvenido,</p>
                        <p className="text-xs font-bold text-white group-hover:text-primary transition-colors">
                            {user.username}</p>
                    </div>
                    <img src={user.avatar}
                        className="w-10 h-10 rounded-2xl border-2 border-white/5 group-hover:border-primary/50 transition-all shadow-xl"
                        alt="" />
                    </Link>
                    <button onClick={logout}
                        className="p-2.5 bg-white/5 hover:bg-primary/10 text-gray-400 hover:text-primary rounded-2xl transition-all">
                        <LogOut size={18} />
                    </button>
                </div>
                ) : (
                <button onClick={loginWithDiscord}
                    className="flex items-center gap-3 px-8 py-3.5 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20">
                    <LogIn size={18} /> CONECTAR DISCORD
                </button>
                )}
            </div>

            {/* Mobile Controls */}
            <div className="md:hidden flex items-center gap-4">
                <button onClick={()=> setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-400">
                    {isMobileMenuOpen ?
                    <X size={28} /> :
                    <Menu size={28} />}
                </button>
            </div>

        </div>
    </div>

    {/* Mobile Menu */}
    <AnimatePresence>
        {isMobileMenuOpen && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0,
            height: 0 }} className="md:hidden bg-[#0a0a0a] border-b border-white/10 overflow-hidden">
            <div className="p-6 space-y-4">
                {navLinks.map((link) => (
                <Link key={link.name} to={link.path} onClick={()=> setIsMobileMenuOpen(false)} className="block p-4
                rounded-2xl text-xl font-bold text-white hover:bg-white/5 transition-all">
                {link.name}
                </Link>
                ))}
                {user?.role === 'admin' && (
                <Link to="/admin" onClick={()=> setIsMobileMenuOpen(false)} className="block p-4 rounded-2xl text-xl
                font-bold text-primary hover:bg-primary/5 transition-all flex items-center gap-3">
                <Shield size={20} /> PANEL ADMIN
                </Link>
                )}
                <div className="pt-4 mt-4 border-t border-white/10">
                    {user ? (
                    <Link to="/profile" onClick={()=> setIsMobileMenuOpen(false)} className="flex items-center gap-4 p-4
                    bg-white/5 rounded-2xl">
                    <img src={user.avatar} className="w-12 h-12 rounded-xl" alt="" />
                    <div>
                        <p className="text-sm font-bold text-white">{user.username}</p>
                        <p className="text-xs text-gray-500">{user.coins} Coins</p>
                    </div>
                    </Link>
                    ) : (
                    <button onClick={loginWithDiscord}
                        className="w-full py-5 bg-primary text-white rounded-3xl font-black text-sm uppercase tracking-widest">CONECTAR
                        DISCORD</button>
                    )}
                </div>
            </div>
        </motion.div>
        )}
    </AnimatePresence>
</nav>
);
};

export default Navbar;