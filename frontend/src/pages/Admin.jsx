import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Database, Trash2, ShieldAlert, PlusCircle, LayoutGrid, Users,
    DollarSign, Image as ImageIcon, AlignLeft, Package, BarChart3,
    Settings, Bell, Calendar, X, Check, Save, Zap, Coins, ChevronRight,
    History, Ticket
} from 'lucide-react';
import API_URL from '../config/api';

const Admin = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [users, setUsers] = useState([]);
    const [purchases, setPurchases] = useState([]);
    const [activeTab, setActiveTab] = useState('products'); // products, announcements, users, purchases

    // Forms
    const [prodForm, setProdForm] = useState({ name: '', description: '', price: '', image: '', category: 'VIP' });
    const [announForm, setAnnounForm] = useState({ title: '', content: '', category: 'Update', color: 'bg-blue-500' });
    const [manualBalanceForm, setManualBalanceForm] = useState({ username: '', amount: '', action: 'add' });
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        if (user && user.role === 'admin') fetchData();
    }, [user, activeTab]);

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        try {
            if (activeTab === 'products') {
                const res = await axios.get(`${API_URL}/api/products`, { headers });
                setProducts(res.data);
            } else if (activeTab === 'announcements') {
                const res = await axios.get(`${API_URL}/api/announcements`);
                setAnnouncements(res.data);
            } else if (activeTab === 'users') {
                const res = await axios.get(`${API_URL}/api/users`, { headers });
                setUsers(res.data);
            } else if (activeTab === 'purchases') {
                const res = await axios.get(`${API_URL}/api/admin/purchases`, { headers });
                setPurchases(res.data);
            }
        } catch (err) { }
    };

    // --- PRODUCT ACTIONS ---
    const handleCreateProduct = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_URL}/api/products`, prodForm, { headers: { Authorization: `Bearer ${token}` } });
            Swal.fire({
                toast: true, position: 'top-end', icon: 'success', title: 'Activo Publicado',
                showConfirmButton: false, timer: 2000, background: '#0a0a0a', color: '#fff'
            });
            setProdForm({ name: '', description: '', price: '', image: '', category: 'VIP' });
            fetchData();
        } catch (err) { Swal.fire('Error', 'No se pudo crear el producto', 'error'); }
    };

    const handleDeleteProduct = async (id) => {
        const result = await Swal.fire({
            title: '¿Eliminar activo?', icon: 'warning', showCancelButton: true,
            background: '#0a0a0a', color: '#fff', confirmButtonColor: '#ff2e2e'
        });
        if (!result.isConfirmed) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/api/products/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchData();
        } catch (err) { }
    };

    // --- ANNOUNCEMENT ACTIONS ---
    const handleCreateAnnouncement = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_URL}/api/announcements`, announForm, { headers: { Authorization: `Bearer ${token}` } });
            Swal.fire({
                toast: true, position: 'top-end', icon: 'success', title: 'Anuncio Publicado',
                showConfirmButton: false, timer: 2000, background: '#0a0a0a', color: '#fff'
            });
            setAnnounForm({ title: '', content: '', category: 'Update', color: 'bg-blue-500' });
            fetchData();
        } catch (err) { Swal.fire('Error', 'Fallo al publicar anuncio', 'error'); }
    };

    const handleDeleteAnnouncement = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/api/announcements/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchData();
        } catch (err) { }
    };

    const handleDeleteUser = async (id) => {
        const result = await Swal.fire({
            title: '¿ELIMINAR USUARIO?',
            text: "Esta acción es irreversible y borrará todos sus datos.",
            icon: 'warning', showCancelButton: true,
            background: '#0a0a0a', color: '#fff', confirmButtonColor: '#ff2e2e',
            confirmButtonText: 'SÍ, ELIMINAR'
        });
        if (!result.isConfirmed) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/api/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            setSelectedUser(null);
            fetchData();
            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Usuario Eliminado', showConfirmButton: false, timer: 1500, background: '#0a0a0a', color: '#fff' });
        } catch (err) { Swal.fire('Error', err.response?.data?.error || 'No se pudo eliminar', 'error'); }
    };

    const handleManualBalance = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_URL}/api/users/manage-coins`, manualBalanceForm, { headers: { Authorization: `Bearer ${token}` } });
            Swal.fire({
                toast: true, position: 'top-end', icon: 'success', title: 'Operación Exitosa',
                showConfirmButton: false, timer: 2000, background: '#0a0a0a', color: '#fff'
            });
            setManualBalanceForm({ username: '', amount: '', action: 'add' });
            fetchData();
        } catch (err) {
            Swal.fire('Error', err.response?.data?.error || 'No se pudo realizar la operación', 'error');
        }
    };

    if (!user || user.role !== 'admin') return <Navigate to="/" />;

    return (
        <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-20 bg-grid relative overflow-hidden">
            <div className="absolute top-0 right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Admin Header */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-6">
                        <div className="p-5 bg-primary/10 rounded-[2rem] border border-primary/20 text-primary shadow-[0_0_30px_rgba(255,46,46,0.15)]">
                            <ShieldAlert size={40} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">ADMINISTRATION_CORE</span>
                            </div>
                            <h1 className="text-5xl font-display font-black text-white tracking-tighter uppercase">Nexus <span className="text-primary italic">Control</span></h1>
                        </div>
                    </motion.div>

                    {/* Navigation Tabs */}
                    <div className="flex bg-white/5 p-2 rounded-[2rem] border border-white/5 overflow-x-auto no-scrollbar max-w-full">
                        {[
                            { id: 'products', name: 'Tienda', icon: LayoutGrid },
                            { id: 'announcements', name: 'Anuncios', icon: Bell },
                            { id: 'users', name: 'Usuarios', icon: Users },
                            { id: 'purchases', name: 'Ventas', icon: History }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 px-8 py-3 rounded-2xl transition-all font-black text-xs uppercase tracking-widest whitespace-nowrap
                                ${activeTab === tab.id ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                            >
                                <tab.icon size={16} /> {tab.name}
                            </button>
                        ))}
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Management Form Area */}
                    <div className="lg:col-span-5">
                        <section className="glass-card rounded-[3.5rem] p-10 border border-white/5 sticky top-32">
                            {activeTab === 'products' ? (
                                <form onSubmit={handleCreateProduct} className="space-y-6">
                                    <h2 className="text-xl font-black text-white mb-8 flex items-center gap-4 uppercase tracking-tighter">
                                        <PlusCircle className="text-primary" /> Registrar Activo
                                    </h2>
                                    <div className="space-y-4">
                                        <input type="text" placeholder="Nombre del Producto" className="admin-input" value={prodForm.name} onChange={e => setProdForm({ ...prodForm, name: e.target.value })} required />
                                        <input type="number" placeholder="Precio (Monedas)" className="admin-input" value={prodForm.price} onChange={e => setProdForm({ ...prodForm, price: e.target.value })} required />
                                        <input type="text" placeholder="URL Imagen" className="admin-input" value={prodForm.image} onChange={e => setProdForm({ ...prodForm, image: e.target.value })} required />
                                        <select className="admin-input appearance-none" value={prodForm.category} onChange={e => setProdForm({ ...prodForm, category: e.target.value })}>
                                            <option value="VIP">💎 Categoría: VIP</option>
                                            <option value="Vehículos">🚗 Categoría: Vehículos</option>
                                            <option value="Dinero">💰 Categoría: Dinero</option>
                                            <option value="Legal">⚖️ Categoría: Legal</option>
                                            <option value="Ilegal">🔫 Categoría: Ilegal</option>
                                        </select>
                                        <textarea placeholder="Descripción detallada..." className="admin-input min-h-[150px] resize-none" value={prodForm.description} onChange={e => setProdForm({ ...prodForm, description: e.target.value })} required />
                                    </div>
                                    <button type="submit" className="w-full btn-card-primary py-5 rounded-3xl font-black text-lg tracking-[0.2em]">PUBLICAR ARTÍCULO</button>
                                </form>
                            ) : activeTab === 'announcements' ? (
                                <form onSubmit={handleCreateAnnouncement} className="space-y-6">
                                    <h2 className="text-xl font-black text-white mb-8 flex items-center gap-4 uppercase tracking-tighter">
                                        <Bell className="text-primary" /> Crear Novedad
                                    </h2>
                                    <div className="space-y-4">
                                        <input type="text" placeholder="Título del Anuncio" className="admin-input" value={announForm.title} onChange={e => setAnnounForm({ ...announForm, title: e.target.value })} required />
                                        <select className="admin-input appearance-none" value={announForm.category} onChange={e => setAnnounForm({ ...announForm, category: e.target.value })}>
                                            <option value="Update">Update / Parche</option>
                                            <option value="Alert">Alerta / Mantenimiento</option>
                                            <option value="Event">Evento Especial</option>
                                        </select>
                                        <textarea placeholder="Contenido del anuncio..." className="admin-input min-h-[150px] resize-none" value={announForm.content} onChange={e => setAnnounForm({ ...announForm, content: e.target.value })} required />
                                    </div>
                                    <button type="submit" className="w-full btn-card-primary py-5 rounded-3xl font-black text-lg tracking-[0.2em] !bg-blue-500">POSTEAR ANUNCIO</button>
                                </form>
                            ) : activeTab === 'users' ? (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                                    <h2 className="text-xl font-black text-white mb-8 flex items-center gap-4 uppercase tracking-tighter">
                                        <DollarSign className="text-secondary" size={24} /> Gestión de Balance
                                    </h2>

                                    <form onSubmit={handleManualBalance} className="space-y-4">
                                        <div className="space-y-4">
                                            <input
                                                type="text"
                                                placeholder="Nombre Exacto del Usuario"
                                                className="admin-input"
                                                value={manualBalanceForm.username}
                                                onChange={e => setManualBalanceForm({ ...manualBalanceForm, username: e.target.value })}
                                                required
                                            />
                                            <input
                                                type="number"
                                                placeholder="Cantidad de Monedas"
                                                className="admin-input"
                                                value={manualBalanceForm.amount}
                                                onChange={e => setManualBalanceForm({ ...manualBalanceForm, amount: e.target.value })}
                                                required
                                            />
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setManualBalanceForm({ ...manualBalanceForm, action: 'add' })}
                                                    className={`flex-1 py-3 rounded-2xl font-black text-[10px] tracking-widest transition-all ${manualBalanceForm.action === 'add' ? 'bg-secondary text-black shadow-lg shadow-secondary/20' : 'bg-white/5 text-gray-500'}`}
                                                >AÑADIR</button>
                                                <button
                                                    type="button"
                                                    onClick={() => setManualBalanceForm({ ...manualBalanceForm, action: 'remove' })}
                                                    className={`flex-1 py-3 rounded-2xl font-black text-[10px] tracking-widest transition-all ${manualBalanceForm.action === 'remove' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white/5 text-gray-500'}`}
                                                >QUITAR</button>
                                            </div>
                                        </div>
                                        <button type="submit" className="w-full btn-card-primary py-5 rounded-3xl font-black text-sm tracking-[0.2em]">APLICAR CAMBIOS</button>
                                    </form>

                                    {selectedUser && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-8 mt-8 border-t border-white/5 text-center">
                                            <div className="flex items-center gap-4 mb-4 justify-center">
                                                <img src={selectedUser.avatar} className="w-10 h-10 rounded-xl" alt="" />
                                                <div className="text-left">
                                                    <h4 className="font-bold text-white text-xs uppercase">{selectedUser.username}</h4>
                                                    <p className="text-[10px] text-gray-500 font-bold">Estado: Seleccionado</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteUser(selectedUser._id)}
                                                className="w-full py-3 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-xl text-[10px] font-black tracking-widest transition-all"
                                            >ELIMINAR CUENTA DEFINITIVAMENTE</button>
                                        </motion.div>
                                    )}
                                </motion.div>
                            ) : (
                                <div className="text-center py-20 opacity-30">
                                    <History size={60} className="mx-auto mb-4" />
                                    <p className="font-black uppercase tracking-widest text-xs">Historial de Ventas</p>
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Content View Area */}
                    <div className="lg:col-span-7">
                        <section className="glass-card rounded-[3.5rem] p-10 border border-white/5 min-h-[600px] relative overflow-hidden">
                            <AnimatePresence mode="wait">
                                {activeTab === 'products' ? (
                                    <motion.div key="prods" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
                                        <h3 className="text-sm font-black text-gray-500 uppercase tracking-[0.4em] mb-8">Catálogo Disponible ({products.length})</h3>
                                        {products.map(p => (
                                            <div key={p._id} className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-[2.5rem] group hover:bg-white/[0.04] transition-all">
                                                <div className="flex items-center gap-6">
                                                    <img src={p.image} className="w-16 h-16 rounded-2xl object-cover" alt="" />
                                                    <div>
                                                        <h4 className="font-bold text-white group-hover:text-primary transition-colors">{p.name}</h4>
                                                        <div className="flex items-center gap-3 mt-1.5 font-black uppercase text-[10px] tracking-widest">
                                                            <span className="text-primary">{p.price} CC</span>
                                                            <span className="text-gray-700">•</span>
                                                            <span className="text-blue-500">{p.category}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button onClick={() => handleDeleteProduct(p._id)} className="p-4 text-gray-700 hover:text-primary transition-all"><Trash2 size={22} /></button>
                                            </div>
                                        ))}
                                    </motion.div>
                                ) : activeTab === 'announcements' ? (
                                    <motion.div key="anns" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
                                        <h3 className="text-sm font-black text-gray-500 uppercase tracking-[0.4em] mb-8">Timeline de Novedades ({announcements.length})</h3>
                                        {announcements.map(a => (
                                            <div key={a._id} className="p-6 bg-white/[0.02] border border-white/5 rounded-[2.5rem] flex items-center justify-between group">
                                                <div className="flex items-center gap-6">
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${a.color} bg-opacity-10 text-white`}>
                                                        <Zap size={24} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-white uppercase text-sm tracking-tight">{a.title}</h4>
                                                        <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-1">{a.category} • {new Date(a.date).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <button onClick={() => handleDeleteAnnouncement(a._id)} className="p-4 text-gray-700 hover:text-primary transition-all"><Trash2 size={20} /></button>
                                            </div>
                                        ))}
                                    </motion.div>
                                ) : activeTab === 'users' ? (
                                    <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                                        <h3 className="text-sm font-black text-gray-500 uppercase tracking-[0.4em] mb-8">Población Registrada ({users.length})</h3>
                                        {users.map(u => (
                                            <div
                                                key={u._id}
                                                onClick={() => setSelectedUser(u)}
                                                className={`flex items-center justify-between p-5 border rounded-3xl cursor-pointer transition-all ${selectedUser?._id === u._id ? 'bg-secondary/10 border-secondary/50' : 'bg-white/[0.01] border-white/5 hover:border-white/20'}`}
                                            >
                                                <div className="flex items-center gap-5">
                                                    <img src={u.avatar} className="w-10 h-10 rounded-xl" alt="" />
                                                    <div>
                                                        <h4 className="font-bold text-white text-sm">{u.username}</h4>
                                                        <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">{u.role} • {u.email}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-secondary font-black text-xs">{u.coins} CC</span>
                                                    <ChevronRight size={16} className="text-gray-700" />
                                                </div>
                                            </div>
                                        ))}
                                    </motion.div>
                                ) : (
                                    <motion.div key="purchases" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                                        <h3 className="text-sm font-black text-gray-500 uppercase tracking-[0.4em] mb-8">Auditoría de Transacciones ({purchases.length})</h3>
                                        {purchases.map(pur => (
                                            <div key={pur._id} className="p-6 bg-white/[0.02] border border-white/5 rounded-[2.5rem] group hover:bg-white/[0.04] transition-all">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="p-3 bg-secondary/10 rounded-2xl text-secondary"><Ticket size={20} /></div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">ID TICKET</p>
                                                            <h4 className="text-lg font-black text-white tracking-tighter">{pur.ticketNumber}</h4>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Importe</p>
                                                        <p className="text-secondary font-black">{pur.price} CC</p>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                                                    <div>
                                                        <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Cliente</p>
                                                        <p className="text-sm font-bold text-white">{pur.username}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Producto</p>
                                                        <p className="text-sm font-bold text-primary italic uppercase">{pur.productName}</p>
                                                    </div>
                                                </div>
                                                <p className="mt-4 text-center text-[10px] font-bold text-gray-700 uppercase tracking-widest">Fecha: {new Date(pur.date).toLocaleString()}</p>
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </section>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Admin;
