import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { Database, Trash2, ShieldAlert, PlusCircle, LayoutGrid, Users, DollarSign, Image as ImageIcon, AlignLeft, Package, BarChart3, Settings } from 'lucide-react';
import API_URL from '../config/api';

const Admin = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({ name: '', description: '', price: '', image: '' });

    useEffect(() => {
        if (user && user.role === 'admin') fetchData();
    }, [user]);

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        try {
            const [prodRes, userRes] = await Promise.all([
                axios.get(`${API_URL}/api/products`, { headers }),
                axios.get(`${API_URL}/api/users`, { headers })
            ]);
            setProducts(prodRes.data);
            setUsers(userRes.data);
        } catch (err) { }
    };

    const handleCreateProduct = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_URL}/api/products`, form, { headers: { Authorization: `Bearer ${token}` } });
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Entrada Creada en el Marketplace',
                showConfirmButton: false,
                timer: 2000,
                background: '#0a0a0a',
                color: '#fff'
            });
            setForm({ name: '', description: '', price: '', image: '' });
            fetchData();
        } catch (err) { Swal.fire('Error', 'Fallo al actualizar la base de datos.', 'error'); }
    };

    const handleDeleteProduct = async (id) => {
        const result = await Swal.fire({
            title: '¿Eliminar activo?',
            text: 'Esta acción eliminará el activo permanentemente de la tienda pública.',
            icon: 'warning',
            showCancelButton: true,
            background: '#0a0a0a',
            color: '#fff',
            confirmButtonColor: '#ff2e2e',
            cancelButtonColor: '#1a1a1a',
            confirmButtonText: 'Sí, eliminar'
        });
        if (!result.isConfirmed) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/api/products/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchData();
        } catch (err) { }
    };

    if (!user || user.role !== 'admin') return <Navigate to="/" />;

    return (
        <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-20 bg-grid relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Admin Header */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-6"
                    >
                        <div className="p-5 bg-primary/10 rounded-[2rem] border border-primary/20 text-primary shadow-[0_0_30px_rgba(255,46,46,0.15)]">
                            <ShieldAlert size={40} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">ADMINISTRATION_CONSOLE</span>
                            </div>
                            <h1 className="text-5xl font-display font-black text-white tracking-tighter uppercase">Nexus <span className="text-primary italic">Control</span></h1>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex gap-4"
                    >
                        <div className="glass-card px-8 py-4 rounded-3xl border border-white/5 flex flex-col items-center">
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Total Assets</span>
                            <span className="text-2xl font-display font-black text-white">{products.length}</span>
                        </div>
                        <div className="glass-card px-8 py-4 rounded-3xl border border-white/5 flex flex-col items-center">
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Server Status</span>
                            <span className="text-2xl font-display font-black text-green-500">STABLE</span>
                        </div>
                    </motion.div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Management Form - Left */}
                    <div className="lg:col-span-5">
                        <section className="glass-card rounded-[3rem] p-10 border border-white/5 sticky top-32">
                            <h2 className="text-2xl font-black text-white mb-10 flex items-center gap-3 uppercase tracking-tight">
                                <PlusCircle className="text-primary" /> Registrar Nuevo Activo
                            </h2>

                            <form onSubmit={handleCreateProduct} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Nombre del Activo</label>
                                    <div className="relative">
                                        <LayoutGrid size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" />
                                        <input type="text" required placeholder="Ej: Pack VIP Diamante" className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white focus:outline-none focus:border-primary transition-all text-sm font-medium" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Precio (CC)</label>
                                        <div className="relative">
                                            <DollarSign size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" />
                                            <input type="number" required placeholder="2500" className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white focus:outline-none focus:border-primary transition-all text-sm font-medium" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">URL de Imagen</label>
                                        <div className="relative">
                                            <ImageIcon size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" />
                                            <input type="text" placeholder="https://..." className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white focus:outline-none focus:border-primary transition-all text-sm font-medium" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Descripción y Especificaciones</label>
                                    <div className="relative">
                                        <AlignLeft size={18} className="absolute left-5 top-6 text-gray-600" />
                                        <textarea required placeholder="Describe las características técnicas..." className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white focus:outline-none focus:border-primary transition-all min-h-[160px] resize-none text-sm font-medium leading-relaxed" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                                    </div>
                                </div>

                                <button type="submit" className="w-full btn-card-primary py-5 font-black text-lg uppercase tracking-widest shadow-xl">
                                    PUBLICAR EN MARKETPLACE
                                </button>
                            </form>
                        </section>
                    </div>

                    {/* Inventory Feed - Right */}
                    <div className="lg:col-span-7">
                        <section className="glass-card rounded-[3rem] p-10 border border-white/5 min-h-[600px]">
                            <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-6">
                                <h2 className="text-2xl font-black text-white flex items-center gap-4 uppercase tracking-tight">
                                    <Database size={28} className="text-primary" /> Inventario Global
                                </h2>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/5 rounded-xl text-gray-500 hover:text-white transition-colors cursor-pointer"><BarChart3 size={18} /></div>
                                    <div className="p-2 bg-white/5 rounded-xl text-gray-500 hover:text-white transition-colors cursor-pointer"><Settings size={18} /></div>
                                </div>
                            </div>

                            <div className="space-y-5">
                                {products.length === 0 ? (
                                    <div className="py-24 flex flex-col items-center justify-center opacity-10">
                                        <Package size={80} className="mb-4" />
                                        <p className="text-xl font-black uppercase tracking-[0.3em]">Sincronizando...</p>
                                    </div>
                                ) : (
                                    products.map(p => (
                                        <motion.div
                                            key={p._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="group p-6 rounded-[2rem] bg-white/[0.01] border border-white/5 flex items-center justify-between hover:bg-white/[0.03] hover:border-primary/20 transition-all duration-500"
                                        >
                                            <div className="flex items-center gap-6">
                                                <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/5 bg-black/40">
                                                    <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-bold text-white group-hover:text-primary transition-colors tracking-tight">{p.name}</h4>
                                                    <div className="flex items-center gap-3 mt-1.5">
                                                        <span className="text-xs font-black text-primary">{p.price} <span className="text-[10px] text-gray-600 uppercase">Monedas</span></span>
                                                        <div className="w-1 h-1 rounded-full bg-gray-800"></div>
                                                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Activo Visible</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleDeleteProduct(p._id)}
                                                className="p-4 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all active:scale-90"
                                                title="Eliminar Activo"
                                            >
                                                <Trash2 size={24} />
                                            </button>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </section>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Admin;
