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
    History, Ticket, Edit3, Plus, Hash, Layers, ImagePlus
} from 'lucide-react';
import API_URL from '../config/api';

const Admin = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [users, setUsers] = useState([]);
    const [purchases, setPurchases] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeTab, setActiveTab] = useState('products'); // products, announcements, users, purchases, categories

    // Forms
    const [prodForm, setProdForm] = useState({ name: '', description: '', price: '', image: '', images: '', category: '' });
    const [isEditing, setIsEditing] = useState(null);

    const [catNameInput, setCatNameInput] = useState(''); // Simple input for the new request
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
                const catRes = await axios.get(`${API_URL}/api/categories`);
                setCategories(catRes.data);
                if (!prodForm.category && catRes.data.length > 0) {
                    setProdForm(prev => ({ ...prev, category: catRes.data[0].name }));
                }
            } else if (activeTab === 'announcements') {
                const res = await axios.get(`${API_URL}/api/announcements`);
                setAnnouncements(res.data);
            } else if (activeTab === 'users') {
                const res = await axios.get(`${API_URL}/api/users`, { headers });
                setUsers(res.data);
            } else if (activeTab === 'purchases') {
                const res = await axios.get(`${API_URL}/api/admin/purchases`, { headers });
                setPurchases(res.data);
            } else if (activeTab === 'categories') {
                const res = await axios.get(`${API_URL}/api/categories`);
                setCategories(res.data);
            }
        } catch (err) { }
    };

    // --- PRODUCT ACTIONS ---
    const handleSaveProduct = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const imagesArray = prodForm.images.split(',').map(img => img.trim()).filter(img => img !== '');
            const payload = { ...prodForm, images: imagesArray };

            if (isEditing) {
                await axios.put(`${API_URL}/api/products/${isEditing}`, payload, { headers: { Authorization: `Bearer ${token}` } });
                Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Actualizado', showConfirmButton: false, timer: 2000, background: '#0a0a0a', color: '#fff' });
            } else {
                await axios.post(`${API_URL}/api/products`, payload, { headers: { Authorization: `Bearer ${token}` } });
                Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Creado', showConfirmButton: false, timer: 2000, background: '#0a0a0a', color: '#fff' });
            }
            setProdForm({ name: '', description: '', price: '', image: '', images: '', category: categories[0]?.name || '' });
            setIsEditing(null);
            fetchData();
        } catch (err) { Swal.fire('Error', 'Fallo en la operación', 'error'); }
    };

    const handleEditProduct = (p) => {
        setIsEditing(p._id);
        setProdForm({ name: p.name, description: p.description, price: p.price, image: p.image, images: p.images?.join(', ') || '', category: p.category });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteProduct = async (id) => {
        const result = await Swal.fire({ title: '¿Eliminar?', icon: 'warning', showCancelButton: true, background: '#0a0a0a', color: '#fff' });
        if (!result.isConfirmed) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/api/products/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchData();
        } catch (err) { }
    };

    // --- SIMPLE CATEGORY ACTIONS ---
    const handleCreateCategory = async () => {
        if (!catNameInput) return Swal.fire('Error', 'Escribe un nombre', 'error');
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_URL}/api/categories`, { name: catNameInput, icon: 'Package', order: categories.length }, { headers: { Authorization: `Bearer ${token}` } });
            setCatNameInput('');
            fetchData();
            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Categoría Creada', showConfirmButton: false, timer: 2000, background: '#0a0a0a', color: '#fff' });
        } catch (err) { }
    };

    const handleDeleteCategoryByName = async () => {
        if (!catNameInput) return Swal.fire('Error', 'Escribe el nombre exacto para borrar', 'error');
        const catToDelete = categories.find(c => c.name.toLowerCase() === catNameInput.toLowerCase());
        if (!catToDelete) return Swal.fire('Error', 'Categoría no encontrada', 'error');

        const result = await Swal.fire({ title: `¿Borrar "${catToDelete.name}"?`, icon: 'warning', showCancelButton: true, background: '#0a0a0a', color: '#fff' });
        if (!result.isConfirmed) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/api/categories/${catToDelete._id}`, { headers: { Authorization: `Bearer ${token}` } });
            setCatNameInput('');
            fetchData();
            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Categoría Eliminada', showConfirmButton: false, timer: 2000, background: '#0a0a0a', color: '#fff' });
        } catch (err) { }
    };

    // --- OTHER ACTIONS ---
    const handleManualBalance = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_URL}/api/users/manage-coins`, manualBalanceForm, { headers: { Authorization: `Bearer ${token}` } });
            setManualBalanceForm({ username: '', amount: '', action: 'add' });
            fetchData();
            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Balance Actualizado', showConfirmButton: false, timer: 2000, background: '#0a0a0a', color: '#fff' });
        } catch (err) { }
    };

    if (!user || user.role !== 'admin') return <Navigate to="/" />;

    return (
        <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-20 bg-grid relative overflow-hidden">
            <div className="absolute top-0 right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                    <div className="flex items-center gap-6">
                        <div className="p-5 bg-primary/10 rounded-[2rem] border border-primary/20 text-primary"><ShieldAlert size={40} /></div>
                        <div>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">ADMIN_SYSTEM_V2.5</span>
                            <h1 className="text-5xl font-display font-black text-white uppercase mt-1">Nexus <span className="text-primary italic">Control</span></h1>
                        </div>
                    </div>

                    <nav className="flex bg-white/5 p-2 rounded-[2rem] border border-white/5 overflow-x-auto no-scrollbar">
                        {[
                            { id: 'products', name: 'Tienda', icon: LayoutGrid },
                            { id: 'categories', name: 'Categorías', icon: Layers },
                            { id: 'users', name: 'Usuarios', icon: Users },
                            { id: 'purchases', name: 'Ventas', icon: History }
                        ].map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest ${activeTab === tab.id ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
                                <tab.icon size={14} /> {tab.name}
                            </button>
                        ))}
                    </nav>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-12">
                        <AnimatePresence mode="wait">
                            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                                {/* LEFT COLUMN */}
                                <div className="lg:col-span-5">
                                    <section className="glass-card rounded-[3.5rem] p-10 border border-white/5">
                                        {activeTab === 'categories' ? (
                                            <div className="space-y-8">
                                                <div>
                                                    <h2 className="text-xl font-black text-white uppercase tracking-tighter mb-6 flex items-center gap-3"><Layers className="text-primary" /> Gestión de Categorías</h2>
                                                    <p className="text-xs text-gray-500 mb-6 font-bold leading-relaxed">Escribe el nombre de la sección que quieres crear (ej: VIP, Vehículos) o el nombre exacto de una existente para eliminarla.</p>

                                                    <div className="space-y-4">
                                                        <input type="text" placeholder="Nombre de categoría..." className="admin-input" value={catNameInput} onChange={e => setCatNameInput(e.target.value)} />
                                                        <div className="flex gap-4">
                                                            <button onClick={handleCreateCategory} className="flex-1 py-4 bg-secondary text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-secondary/10">CREAR</button>
                                                            <button onClick={handleDeleteCategoryByName} className="flex-1 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/10">ELIMINAR</button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="pt-8 border-t border-white/5">
                                                    <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Ayuda Visual</h3>
                                                    <div className="p-6 bg-white/[0.02] rounded-3xl border border-white/10 space-y-3">
                                                        <div className="flex items-center gap-3 text-xs text-gray-400 font-bold"><Check size={14} className="text-secondary" /> Las categorías aparecen solas en la tienda.</div>
                                                        <div className="flex items-center gap-3 text-xs text-gray-400 font-bold"><Check size={14} className="text-secondary" /> Puedes crear tantas como necesites.</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : activeTab === 'products' ? (
                                            <form onSubmit={handleSaveProduct} className="space-y-6">
                                                <h2 className="text-xl font-black text-white flex items-center gap-4 uppercase tracking-tighter">
                                                    {isEditing ? <Edit3 className="text-secondary" /> : <PlusCircle className="text-primary" />}
                                                    {isEditing ? 'Editando Producto' : 'Nuevo Producto'}
                                                </h2>
                                                <div className="space-y-4">
                                                    <input type="text" placeholder="Nombre del Producto" className="admin-input" value={prodForm.name} onChange={e => setProdForm({ ...prodForm, name: e.target.value })} required />
                                                    <input type="number" placeholder="Precio en CC" className="admin-input" value={prodForm.price} onChange={e => setProdForm({ ...prodForm, price: e.target.value })} required />
                                                    <select className="admin-input" value={prodForm.category} onChange={e => setProdForm({ ...prodForm, category: e.target.value })} required>
                                                        <option value="">-- Elige Categoría --</option>
                                                        {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                                                    </select>
                                                    <input type="text" placeholder="Imagen Principal (URL)" className="admin-input" value={prodForm.image} onChange={e => setProdForm({ ...prodForm, image: e.target.value })} required />
                                                    <textarea placeholder="Galería extra (urls separadas por coma)" className="admin-input min-h-[60px] text-[10px]" value={prodForm.images} onChange={e => setProdForm({ ...prodForm, images: e.target.value })} />
                                                    <textarea placeholder="Descripción del artículo..." className="admin-input min-h-[120px]" value={prodForm.description} onChange={e => setProdForm({ ...prodForm, description: e.target.value })} required />
                                                </div>
                                                <button type="submit" className={`w-full py-5 rounded-3xl font-black text-xs tracking-widest ${isEditing ? 'bg-secondary text-black' : 'btn-card-primary'}`}>
                                                    {isEditing ? 'GUARDAR CAMBIOS' : 'CREAR PRODUCTO'}
                                                </button>
                                                {isEditing && <button type="button" onClick={() => { setIsEditing(null); setProdForm({ name: '', description: '', price: '', image: '', images: '', category: categories[0]?.name || '' }); }} className="w-full mt-2 py-3 text-gray-500 font-black text-[10px] uppercase">CANCELAR EDICIÓN</button>}
                                            </form>
                                        ) : activeTab === 'users' ? (
                                            <div className="space-y-6">
                                                <h2 className="text-xl font-black text-white flex items-center gap-4 uppercase tracking-tighter"><DollarSign className="text-secondary" /> Balance de Coins</h2>
                                                <form onSubmit={handleManualBalance} className="space-y-4">
                                                    <input type="text" placeholder="Usuario" className="admin-input" value={manualBalanceForm.username} onChange={e => setManualBalanceForm({ ...manualBalanceForm, username: e.target.value })} required />
                                                    <input type="number" placeholder="Cantidad" className="admin-input" value={manualBalanceForm.amount} onChange={e => setManualBalanceForm({ ...manualBalanceForm, amount: e.target.value })} required />
                                                    <div className="flex gap-2">
                                                        <button type="button" onClick={() => setManualBalanceForm({ ...manualBalanceForm, action: 'add' })} className={`flex-1 py-3 rounded-2xl font-black text-[10px] ${manualBalanceForm.action === 'add' ? 'bg-secondary text-black' : 'bg-white/5 opacity-50'}`}>AÑADIR</button>
                                                        <button type="button" onClick={() => setManualBalanceForm({ ...manualBalanceForm, action: 'remove' })} className={`flex-1 py-3 rounded-2xl font-black text-[10px] ${manualBalanceForm.action === 'remove' ? 'bg-primary text-white' : 'bg-white/5 opacity-50'}`}>QUITAR</button>
                                                    </div>
                                                    <button type="submit" className="w-full btn-card-primary py-5 rounded-3xl font-black text-xs tracking-widest">ENVIAR</button>
                                                </form>
                                            </div>
                                        ) : null}
                                    </section>
                                </div>

                                {/* RIGHT COLUMN (LISTS) */}
                                <div className="lg:col-span-7">
                                    <section className="glass-card rounded-[3.5rem] p-10 border border-white/5 min-h-[600px]">
                                        {activeTab === 'categories' ? (
                                            <div className="space-y-4">
                                                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-8">Categorías Actuales</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {categories.map(c => (
                                                        <div key={c._id} onClick={() => setCatNameInput(c.name)} className="p-6 bg-white/[0.02] border border-white/10 rounded-3xl hover:bg-white/[0.05] cursor-pointer transition-all flex items-center justify-between group">
                                                            <div>
                                                                <span className="text-xs font-black text-white uppercase tracking-tighter">{c.name}</span>
                                                                <p className="text-[9px] text-gray-600 font-bold uppercase mt-1">Configurada</p>
                                                            </div>
                                                            <div className="p-3 bg-white/5 rounded-2xl text-gray-500 group-hover:text-primary"><Layers size={18} /></div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : activeTab === 'products' ? (
                                            <div className="space-y-4">
                                                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-8">Catálogo Disponible</h3>
                                                {products.map(p => (
                                                    <div key={p._id} className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-[2.5rem] group hover:bg-white/[0.04]">
                                                        <div className="flex items-center gap-5">
                                                            <img src={p.image} className="w-14 h-14 rounded-2xl object-cover" alt="" />
                                                            <div>
                                                                <h4 className="font-bold text-white text-sm">{p.name}</h4>
                                                                <p className="text-[10px] font-black uppercase text-secondary tracking-widest">{p.price} CC • <span className="text-gray-600">{p.category}</span></p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button onClick={() => handleEditProduct(p)} className="p-3 text-gray-500 hover:text-secondary bg-white/5 rounded-xl"><Edit3 size={18} /></button>
                                                            <button onClick={() => handleDeleteProduct(p._id)} className="p-3 text-gray-500 hover:text-primary bg-white/5 rounded-xl"><Trash2 size={18} /></button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : activeTab === 'users' ? (
                                            <div className="space-y-3">
                                                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-8">Usuarios Dashboard</h3>
                                                {users.map(u => (
                                                    <div key={u._id} onClick={() => setSelectedUser(u)} className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-all ${selectedUser?._id === u._id ? 'bg-secondary/10 border-secondary/50' : 'bg-white/[0.01] border-white/5'}`}>
                                                        <div className="flex items-center gap-4"><img src={u.avatar} className="w-8 h-8 rounded-lg" alt="" /><div><h4 className="font-bold text-white text-xs">{u.username}</h4><p className="text-[9px] text-gray-600 uppercase font-black">{u.coins} CC</p></div></div><ChevronRight size={14} className="text-gray-800" />
                                                    </div>
                                                ))}
                                            </div>
                                        ) : activeTab === 'purchases' ? (
                                            <div className="space-y-5">
                                                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-8">Auditoría Transaccional</h3>
                                                {purchases.map(pur => (
                                                    <div key={pur._id} className="p-6 bg-white/[0.02] border border-white/5 rounded-[2.5rem]">
                                                        <div className="flex justify-between items-center mb-4"><div className="flex items-center gap-3"><Ticket className="text-secondary" size={16} /><span className="text-xs font-black text-white">{pur.ticketNumber}</span></div><span className="text-[10px] font-bold text-gray-700">{new Date(pur.date).toLocaleDateString()}</span></div>
                                                        <div className="flex justify-between"><div><p className="text-[9px] font-black text-gray-500 uppercase">Cliente</p><p className="text-sm font-bold text-white">{pur.username}</p></div><div className="text-right"><p className="text-[9px] font-black text-gray-500 uppercase">Producto</p><p className="text-sm font-bold text-primary italic">{pur.productName}</p></div></div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : null}
                                    </section>
                                </div>

                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;
