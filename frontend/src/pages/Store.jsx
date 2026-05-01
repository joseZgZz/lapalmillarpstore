import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Search, Filter, Coins, Check, Tag as TagIcon, Package, ChevronRight, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config/api';

const Store = () => {
const { user } = useAuth();
const navigate = useNavigate();
const [products, setProducts] = useState([]);
const [categories, setCategories] = useState(['VIP', 'Vehículos', 'Dinero', 'Legal', 'Ilegal']);
const [activeCategory, setActiveCategory] = useState('VIP');
const [search, setSearch] = useState('');

useEffect(() => {
const fetchProducts = async () => {
try {
const token = localStorage.getItem('token');
const res = await axios.get(`${API_URL}/api/products`, {
headers: { Authorization: token ? `Bearer ${token}` : '' }
});
setProducts(res.data);
} catch (err) { }
};
fetchProducts();
}, []);

const filteredProducts = products.filter(p => {
const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
p.description.toLowerCase().includes(search.toLowerCase());
const matchesCategory = p.category === activeCategory;
return matchesSearch && matchesCategory;
});

return (
<div className="min-h-screen bg-[#0a0a0a] pt-32 pb-20 relative overflow-hidden bg-grid">

    {/* Background Ambience */}
    <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-primary/5 blur-[150px] rounded-full pointer-events-none">
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row gap-8">

        {/* SIDEBAR */}
        <aside className="w-full lg:w-72 shrink-0">
            <div className="sticky top-32 space-y-6">
                {user && (
                <div className="glass-card rounded-3xl p-6 border border-primary/20">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-2 bg-secondary/20 rounded-xl text-secondary">
                            <Coins size={20} />
                        </div>
                        <div>
                            <p
                                className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                                Tu Balance</p>
                            <span className="text-xl font-black text-white">{user.coins} <span
                                    className="text-sm font-bold text-gray-500">CC</span></span>
                        </div>
                    </div>
                    <button
                        className="w-full py-3 bg-white/5 border border-white/10 rounded-xl font-bold text-xs hover:bg-white/10 transition-all">
                        RECARGAR MONEDAS
                    </button>
                </div>
                )}

                <div className="glass-card rounded-3xl p-4 border border-white/5">
                    <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] px-4 mb-4 mt-2">
                        Navegación</h3>
                    <div className="space-y-1">
                        {categories.map(cat => (
                        <button key={cat} onClick={()=> setActiveCategory(cat)}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold
                            transition-all group ${
                            activeCategory === cat
                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                            >
                            <div className="flex items-center gap-3">
                                <TagIcon size={18} className={activeCategory===cat ? 'text-white'
                                    : 'text-gray-600 group-hover:text-primary' } />
                                <span className="text-sm">{cat}</span>
                            </div>
                            {activeCategory === cat &&
                            <Check size={14} />}
                        </button>
                        ))}
                    </div>
                </div>

                <div className="glass-card rounded-3xl p-6 border border-white/5 text-center">
                    <Zap size={32} className="text-secondary mx-auto mb-4" />
                    <h4 className="text-sm font-black text-white uppercase tracking-tighter mb-2">Acceso Premium</h4>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">Únete a nuestro club VIP y obtén un
                        15% de descuento.</p>
                </div>
            </div>
        </aside>

        {/* PRODUCT PANELS */}
        <main className="flex-1">
            <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-5xl font-display font-black text-white tracking-tighter uppercase mb-2">TIENDA
                        <span className="text-primary italic">NEXUS</span>
                    </h1>
                    <div className="flex items-center gap-2 text-gray-500">
                        <span className="text-xs font-bold uppercase tracking-widest">{activeCategory}</span>
                        <ChevronRight size={12} />
                        <span className="text-xs font-bold uppercase tracking-widest text-primary">Catálogo</span>
                    </div>
                </div>

                <div className="relative group">
                    <Search size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-primary transition-colors" />
                    <input type="text" placeholder="Buscar..."
                        className="bg-[#111] border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white focus:outline-none focus:border-primary transition-all w-full sm:w-80 shadow-2xl"
                        value={search} onChange={e=> setSearch(e.target.value)}
                    />
                </div>
            </div>

            <AnimatePresence mode='wait'>
                <motion.div key={activeCategory} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{
                    opacity: 0, y: -10 }} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filteredProducts.length === 0 ? (
                    <div className="col-span-full py-40 flex flex-col items-center justify-center opacity-20">
                        <Package size={80} className="mb-6" />
                        <p className="text-xl font-black uppercase tracking-widest">Sin productos</p>
                    </div>
                    ) : (
                    filteredProducts.map((p) => (
                    <motion.div key={p._id} whileHover={{ y: -5 }} onClick={()=> navigate(`/product/${p._id}`)}
                        className="glass-card rounded-[2.5rem] overflow-hidden group cursor-pointer border
                        border-white/5 hover:border-primary/50 transition-all flex flex-col"
                        >
                        <div className="h-60 relative overflow-hidden bg-black/40">
                            <img src={p.image}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                alt="" />
                            <div className="absolute top-6 left-6 z-20">
                                <div
                                    className="bg-primary text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl">
                                    PREMIUM</div>
                            </div>
                        </div>
                        <div className="p-8 flex flex-col flex-1">
                            <div className="flex-1">
                                <h3
                                    className="text-2xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                                    {p.name}</h3>
                                <p className="text-sm text-gray-500 line-clamp-2 mb-8">{p.description}</p>
                            </div>
                            <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                                <div className="flex flex-col">
                                    <span
                                        className="text-[10px] text-gray-600 font-black uppercase tracking-widest">Inversión</span>
                                    <span className="text-2xl font-black text-secondary">{p.price} <span
                                            className="text-[10px] text-gray-500">CC</span></span>
                                </div>
                                <button
                                    className="btn-card-primary px-8 py-3.5 text-xs uppercase tracking-widest font-black">
                                    ADQUIRIR
                                </button>
                            </div>
                        </div>
                    </motion.div>
                    ))
                    )}
                </motion.div>
            </AnimatePresence>
        </main>
    </div>
</div>
);
};

export default Store;