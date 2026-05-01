import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, LogOut, Menu, X, LogIn, Gamepad2, Coins } from 'lucide-react';
import API_URL from '../config/api';

const Navbar = () => {
const { user, login, logout } = useAuth();
const location = useLocation();
const [isScrolled, setIsScrolled] = useState(false);
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

useEffect(() => {
const handleScroll = () => setIsScrolled(window.scrollY > 20);
window.addEventListener('scroll', handleScroll);
return () => window.removeEventListener('scroll', handleScroll);
}, []);

const loginWithDiscord = () => {
window.location.href = `${API_URL}/api/auth/discord`;
};

const navLinks = [
{ name: 'Inicio', path: '/' },
{ name: 'Tienda', path: '/store' },
{ name: 'Categorías', path: '/store' },
{ name: 'Perfil', path: '/profile' },
];

return (
<motion.nav initial={{ y: -100 }} animate={{ y: 0 }} className={`fixed top-0 left-0 right-0 z-50 transition-all
    duration-300 ${ isScrolled ? 'py-3 bg-[#0a0a0acc]/90 backdrop-blur-xl border-b border-white/10'
    : 'py-6 bg-transparent' }`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
            <div
                className="p-2 bg-[#ff2e2e] rounded-xl shadow-[0_0_20px_rgba(255,46,46,0.5)] group-hover:rotate-12 transition-transform">
                <Gamepad2 size={24} className="text-white" />
            </div>
            <span className="text-2xl font-display font-black tracking-tighter text-white">
                LA<span className="text-[#ff2e2e] tracking-normal">PALMILLA</span>
            </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-2">
                {navLinks.map((link) => (
                <Link key={link.name} to={link.path} className={`px-5 py-2 rounded-xl text-sm font-bold transition-all
                    ${ location.pathname===link.path ? 'text-white bg-[#ff2e2e] shadow-lg shadow-[#ff2e2e]/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5' }`}>
                {link.name}
                </Link>
                ))}
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-4">
                {user ? (
                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end mr-2">
                        <span
                            className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">Balance</span>
                        <div className="flex items-center gap-2 text-[#ffd000] font-black">
                            <Coins size={14} />
                            <span>{user.coins} CC</span>
                        </div>
                    </div>
                    <Link to="/profile"
                        className="flex items-center gap-3 p-1 pl-4 bg-white/5 rounded-2xl border border-white/5 hover:border-[#ff2e2e]/50 transition-all group">
                    <span
                        className="text-sm font-bold text-white group-hover:text-[#ff2e2e] transition-colors">{user.username}</span>
                    <img src={user.avatar} className="w-10 h-10 rounded-xl" alt="" />
                    </Link>
                    <button onClick={logout}
                        className="p-3 text-gray-500 hover:text-[#ff2e2e] hover:bg-[#ff2e2e]/10 rounded-xl transition-all">
                        <LogOut size={20} />
                    </button>
                </div>
                ) : (
                <button onClick={loginWithDiscord}
                    className="flex items-center gap-3 bg-[#5865F2] hover:bg-[#4752C4] text-white px-6 py-3 rounded-xl font-bold transition-all hover:scale-[1.05] shadow-lg active:scale-95">
                    <LogIn size={18} />
                    Login with Discord
                </button>
                )}
                <button className="p-3 text-gray-400 hover:text-white transition-colors relative">
                    <ShoppingCart size={22} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-[#ff2e2e] rounded-full"></span>
                </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4">
                <button onClick={()=> setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-400">
                    {isMobileMenuOpen ?
                    <X size={28} /> :
                    <Menu size={28} />}
                </button>
            </div>

        </div>
    </div>

    {/* Mobile Menu Overlay */}
    <AnimatePresence>
        {isMobileMenuOpen && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0,
            height: 0 }} className="md:hidden bg-[#0a0a0a] border-b border-white/10 overflow-hidden">
            <div className="p-6 space-y-4">
                {navLinks.map((link) => (
                <Link key={link.name} to={link.path} onClick={()=> setIsMobileMenuOpen(false)}
                className="block p-4 rounded-2xl text-xl font-bold text-white hover:bg-[#ff2e2e]/20 transition-all"
                >
                {link.name}
                </Link>
                ))}
                <div className="pt-4 mt-4 border-t border-white/10">
                    {user ? (
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl">
                            <img src={user.avatar} className="w-12 h-12 rounded-xl" alt="" />
                            <div>
                                <p className="font-bold text-white">{user.username}</p>
                                <p className="text-[#ffd000] font-black">{user.coins} CC</p>
                            </div>
                        </div>
                        <button onClick={logout}
                            className="w-full p-4 bg-red-500/10 text-red-500 rounded-2xl font-bold">Logout</button>
                    </div>
                    ) : (
                    <button onClick={loginWithDiscord}
                        className="w-full flex items-center justify-center gap-3 bg-[#5865F2] text-white p-5 rounded-2xl font-bold text-lg">
                        <LogIn size={20} /> Login with Discord
                    </button>
                    )}
                </div>
            </div>
        </motion.div>
        )}
    </AnimatePresence>
</motion.nav>
);
};

export default Navbar;