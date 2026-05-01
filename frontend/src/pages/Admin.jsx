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
    History, Ticket, Edit3, Plus, Hash, Layers
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
    const [isEditing, setIsEditing] = useState(null); // ID of product being edited
    const [catForm, setCatForm] = useState({ name: '', icon: 'Package', order: 0 });
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
                Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Producto Actualizado', showConfirmButton: false, timer: 2000, background: '#0a0a0a', color: '#fff' });
            } else {
                await axios.post(`${API_URL}/api/products`, payload, { headers: { Authorization: `Bearer ${token}` } });
                Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Producto Creado', showConfirmButton: false, timer: 2000, background: '#0a0a0a', color: '#fff' });
            }
            setProdForm({ name: '', description: '', price: '', image: '', images: '', category: categories[0]?.name || '' });
            setIsEditing(null);
            fetchData();
        } catch (err) { Swal.fire('Error', 'Operación fallida', 'error'); }
    };

    const handleEditProduct = (p) => {
        setIsEditing(p._id);
        setProdForm({
            name: p.name,
            description: p.description,
            price: p.price,
            image: p.image,
            images: p.images?.join(', ') || '',
            category: p.category
        });
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

    // --- CATEGORY ACTIONS ---
    const handleSaveCategory = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_URL}/api/categories`, catForm, { headers: { Authorization: `Bearer ${token}` } });
            setCatForm({ name: '', icon: 'Package', order: 0 });
            fetchData();
            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Categoría Creada', showConfirmButton: false, timer: 2000, background: '#0a0a0a', color: '#fff' });
        } catch (err) { }
    };

    const handleDeleteCategory = async (id) => {
        const result = await Swal.fire({ title: '¿Borrar categoría?', text: 'Los productos en esta categoría no se borrarán pero perderán su filtro.', icon: 'warning', showCancelButton: true, background: '#0a0a0a', color: '#fff' });
        if (!result.isConfirmed) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/api/categories/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchData();
        } catch (err) { }
    };

    // --- ANNOUNCEMENT ACTIONS ---
    const handleCreateAnnouncement = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_URL}/api/announcements`, announForm, { headers: { Authorization: `Bearer ${token}` } });
            setAnnounForm({ title: '', content: '', category: 'Update', color: 'bg-blue-500' });
            fetchData();
            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Publicado', showConfirmButton: false, timer: 2000, background: '#0a0a0a', color: '#fff' });
        } catch (err) { }
    };

    const handleDeleteAnnouncement = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/api/announcements/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchData();
        } catch (err) { }
    };

    const handleManualBalance = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_URL}/api/users/manage-coins`, manualBalanceForm, { headers: { Authorization: `Bearer ${token}` } });
            setManualBalanceForm({ username: '', amount: '', action: 'add' });
            fetchData();
            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Balance Actualizado', showConfirmButton: false, timer: 2000, background: '#0a0a0a', color: '#fff' });
        } catch (err) { Swal.fire('Error', err.response?.data?.error || 'Fallo', 'error'); }
    };

    const handleDeleteUser = async (id) => {
        const result = await Swal.fire({ title: '¿ELIMINAR?', showCancelButton: true, background: '#0a0a0a', color: '#fff' });
        if (!result.isConfirmed) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/api/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            setSelectedUser(null);
            fetchData();
        } catch (err) { }
    };

    if (!user || user.role !== 'admin') return <Navigate to="/" />;

    return (
        <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-20 bg-grid relative overflow-hidden">
            <div className="absolute top-0 right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-6">
                        <div className="p-5 bg-primary/10 rounded-[2rem] border border-primary/20 text-primary">
                            <ShieldAlert size={40} />
                        </div>
                        <div>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">ADMINISTRATION_CORE</span>
                            <h1 className="text-5xl font-display font-black text-white uppercase mt-1">Nexus <span className="text-primary italic">Control</span> <span className="text-[10px] text-primary align-top">v2</span></h1>
                        </div>
                    </motion.div>

                    <nav className="flex bg-white/5 p-2 rounded-[2rem] border border-white/5 overflow-x-auto no-scrollbar max-w-full">
                        {[
                            { id: 'products', name: 'Tienda', icon: LayoutGrid },
                            { id: 'categories', name: 'Categorías', icon: Layers },
                            { id: 'announcements', name: 'Anuncios', icon: Bell },
                            { id: 'users', name: 'Usuarios', icon: Users },
                            { id: 'purchases', name: 'Ventas', icon: History }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest whitespace-nowrap
                                ${activeTab === tab.id ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                            >
                                <tab.icon size={14} /> {tab.name}
                            </button>
                        ))}
                    </nav>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    <div className="lg:col-span-12">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="grid grid-cols-1 lg:grid-cols-12 gap-10"
                            >
                                {/* LEFT COLUMN: FORM */}
                                <div className="lg:col-span-5">
                                    <section className="glass-card rounded-[3.5rem] p-10 border border-white/5">
                                        {activeTab === 'products' ? (
                                            <form onSubmit={handleSaveProduct} className="space-y-6">
                                                <h2 className="text-xl font-black text-white flex items-center gap-4 uppercase tracking-tighter">
                                                    {isEditing ? <Edit3 className="text-secondary" /> : <PlusCircle className="text-primary" />}
                                                    {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
                                                </h2>
                                                <div className="space-y-4">
                                                    <input type="text" placeholder="Nombre" className="admin-input" value={prodForm.name} onChange={e => setProdForm({ ...prodForm, name: e.target.value })} required />
                                                    <input type="number" placeholder="Precio" className="admin-input" value={prodForm.price} onChange={e => setProdForm({ ...prodForm, price: e.target.value })} required />
                                                    <select className="admin-input" value={prodForm.category} onChange={e => setProdForm({ ...prodForm, category: e.target.value })} required>
                                                        {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                                                    </select>
                                                    <input type="text" placeholder="Imagen Portada (URL)" className="admin-input" value={prodForm.image} onChange={e => setProdForm({ ...prodForm, image: e.target.value })} required />
                                                    <textarea placeholder="Galería de Imágenes (URLs separadas por comas)" className="admin-input min-h-[80px] text-[10px]" value={prodForm.images} onChange={e => setProdForm({ ...prodForm, images: e.target.value })} />
                                                    <textarea placeholder="Descripción..." className="admin-input min-h-[150px] resize-none" value={prodForm.description} onChange={e => setProdForm({ ...prodForm, description: e.target.value })} required />
                                                </div>
                                                <div className="flex gap-4">
                                                    <button type="submit" className={`flex-1 py-5 rounded-3xl font-black text-xs tracking-widest ${isEditing ? 'bg-secondary text-black' : 'btn-card-primary'}`}>
                                                        {isEditing ? 'GUARDAR CAMBIOS' : 'CREAR PRODUCTO'}
                                                    </button>
                                                    {isEditing && (
                                                        <button type="button" onClick={() => { setIsEditing(null); setProdForm({ name: '', description: '', price: '', image: '', images: '', category: categories[0]?.name || '' }); }} className="px-6 bg-white/5 text-white rounded-3xl font-black text-[10px]">CANCELAR</button>
                                                    )}
                                                </div>
                                            </form>
                                        ) : activeTab === 'categories' ? (
                                            <form onSubmit={handleSaveCategory} className="space-y-6">
                                                <h2 className="text-xl font-black text-white flex items-center gap-4 uppercase tracking-tighter"><Layers className="text-primary" /> Nueva Categoría</h2>
                                                <div className="space-y-4">
                                                    <input type="text" placeholder="Nombre de Categoría" className="admin-input" value={catForm.name} onChange={e => setCatForm({ ...catForm, name: e.target.value })} required />
                                                    <input type="text" placeholder="Icono (Lucide name: Car, Star, etc)" className="admin-input" value={catForm.icon} onChange={e => setCatForm({ ...catForm, icon: e.target.value })} />
                                                    <input type="number" placeholder="Orden" className="admin-input" value={catForm.order} onChange={e => setCatForm({ ...catForm, order: e.target.value })} />
                                                </div>
                                                <button type="submit" className="w-full btn-card-primary py-5 rounded-3xl font-black text-xs tracking-widest">AÑADIR CATEGORÍA</button>
                                            </form>
                                        ) : activeTab === 'announcements' ? (
                                            <form onSubmit={handleCreateAnnouncement} className="space-y-6">
                                                <h2 className="text-xl font-black text-white flex items-center gap-4 uppercase tracking-tighter"><Bell className="text-primary" /> Crear Novedad</h2>
                                                <div className="space-y-4">
                                                    <input type="text" placeholder="Título" className="admin-input" value={announForm.title} onChange={e => setAnnounForm({ ...announForm, title: e.target.value })} required />
                                                    <select className="admin-input" value={announForm.category} onChange={e => setAnnounForm({ ...announForm, category: e.target.value })}>
                                                        <option value="Update">Update</option>
                                                        <option value="Alert">Alert</option>
                                                        <option value="Event">Event</option>
                                                    </select>
                                                    <textarea placeholder="Contenido..." className="admin-input min-h-[150px]" value={announForm.content} onChange={e => setAnnounForm({ ...announForm, content: e.target.value })} required />
                                                </div>
                                                <button type="submit" className="w-full py-5 rounded-3xl font-black text-xs tracking-widest bg-blue-500 text-white">POSTEAR</button>
                                            </form>
                                        ) : activeTab === 'users' ? (
                                            <div className="space-y-6">
                                                <h2 className="text-xl font-black text-white flex items-center gap-4 uppercase tracking-tighter"><DollarSign className="text-secondary" /> Gestión de Balance</h2>
                                                <form onSubmit={handleManualBalance} className="space-y-4">
                                                    <input type="text" placeholder="Nombre de Usuario" className="admin-input" value={manualBalanceForm.username} onChange={e => setManualBalanceForm({ ...manualBalanceForm, username: e.target.value })} required />
                                                    <input type="number" placeholder="Cantidad" className="admin-input" value={manualBalanceForm.amount} onChange={e => setManualBalanceForm({ ...manualBalanceForm, amount: e.target.value })} required />
                                                    <div className="flex gap-2">
                                                        <button type="button" onClick={() => setManualBalanceForm({ ...manualBalanceForm, action: 'add' })} className={`flex-1 py-3 rounded-2xl font-black text-[10px] ${manualBalanceForm.action === 'add' ? 'bg-secondary text-black' : 'bg-white/5 opacity-50'}`}>AÑADIR</button>
                                                        <button type="button" onClick={() => setManualBalanceForm({ ...manualBalanceForm, action: 'remove' })} className={`flex-1 py-3 rounded-2xl font-black text-[10px] ${manualBalanceForm.action === 'remove' ? 'bg-primary text-white' : 'bg-white/5 opacity-50'}`}>QUITAR</button>
                                                    </div>
                                                    <button type="submit" className="w-full btn-card-primary py-5 rounded-3xl font-black text-xs tracking-widest">APLICAR</button>
                                                </form>
                                                {selectedUser && (
                                                    <div className="pt-8 mt-8 border-t border-white/5 text-center">
                                                        <img src={selectedUser.avatar} className="w-12 h-12 rounded-xl mx-auto mb-3" alt="" />
                                                        <p className="text-xs font-black text-white uppercase mb-4">{selectedUser.username}</p>
                                                        <button onClick={() => handleDeleteUser(selectedUser._id)} className="w-full py-3 bg-primary/10 text-primary rounded-xl text-[10px] font-black hover:bg-primary hover:text-white transition-all">ELIMINAR CUENTA</button>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-center py-20 opacity-30">
                                                <History size={60} className="mx-auto mb-4" />
                                                <p className="font-black uppercase tracking-widest text-[10px]">Auditoría de Sistemas</p>
                                            </div>
                                        )}
                                    </section>
                                </div>

                                {/* RIGHT COLUMN: LIST/DATA */}
                                <div className="lg:col-span-7">
                                    <section className="glass-card rounded-[3.5rem] p-10 border border-white/5 min-h-[600px]">
                                        {activeTab === 'products' ? (
                                            <div className="space-y-4">
                                                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-8">Gestión de Catálogo</h3>
                                                {products.map(p => (
                                                    <div key={p._id} className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-[2rem] group hover:bg-white/[0.04]">
                                                        <div className="flex items-center gap-4">
                                                            <img src={p.image} className="w-12 h-12 rounded-xl object-cover" alt="" />
                                                            <div>
                                                                <h4 className="font-bold text-white text-sm">{p.name}</h4>
                                                                <p className="text-[10px] font-black uppercase text-secondary tracking-widest">{p.price} CC • <span className="text-gray-600">{p.category}</span></p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button onClick={() => handleEditProduct(p)} className="p-3 text-gray-500 hover:text-secondary"><Edit3 size={18} /></button>
                                                            <button onClick={() => handleDeleteProduct(p._id)} className="p-3 text-gray-500 hover:text-primary"><Trash2 size={18} /></button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : activeTab === 'categories' ? (
                                            <div className="space-y-4">
                                                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-8">Arquitectura de la Tienda</h3>
                                                {categories.map(c => (
                                                    <div key={c._id} className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-[2rem]">
                                                        <div className="flex items-center gap-4">
                                                            <div className="p-3 bg-primary/10 text-primary rounded-xl"><Layers size={20} /></div>
                                                            <div>
                                                                <h4 className="font-bold text-white text-sm uppercase tracking-tighter">{c.name}</h4>
                                                                <p className="text-[10px] text-gray-600">Prioridad: {c.order} • Icono: {c.icon}</p>
                                                            </div>
                                                        </div>
                                                        <button onClick={() => handleDeleteCategory(c._id)} className="p-3 text-gray-700 hover:text-primary"><Trash2 size={18} /></button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : activeTab === 'users' ? (
                                            <div className="space-y-3">
                                                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-8">Usuarios Dashboard</h3>
                                                {users.map(u => (
                                                    <div key={u._id} onClick={() => setSelectedUser(u)} className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-all ${selectedUser?._id === u._id ? 'bg-secondary/10 border-secondary/50' : 'bg-white/[0.01] border-white/5'}`}>
                                                        <div className="flex items-center gap-4">
                                                            <img src={u.avatar} className="w-8 h-8 rounded-lg" alt="" />
                                                            <div>
                                                                <h4 className="font-bold text-white text-xs">{u.username}</h4>
                                                                <p className="text-[9px] text-gray-600 uppercase font-black">{u.coins} CC</p>
                                                            </div>
                                                        </div>
                                                        <ChevronRight size={14} className="text-gray-800" />
                                                    </div>
                                                ))}
                                            </div>
                                        ) : activeTab === 'purchases' ? (
                                            <div className="space-y-5">
                                                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-8">Registro de Ventas</h3>
                                                {purchases.map(pur => (
                                                    <div key={pur._id} className="p-6 bg-white/[0.02] border border-white/5 rounded-[2.5rem]">
                                                        <div className="flex justify-between items-center mb-4">
                                                            <div className="flex items-center gap-3">
                                                                <Ticket className="text-secondary" size={16} />
                                                                <span className="text-xs font-black text-white">{pur.ticketNumber}</span>
                                                            </div>
                                                            <span className="text-[10px] font-bold text-gray-700">{new Date(pur.date).toLocaleDateString()}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <div>
                                                                <p className="text-[9px] font-black text-gray-500 uppercase">Cliente</p>
                                                                <p className="text-sm font-bold text-white">{pur.username}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-[9px] font-black text-gray-500 uppercase">Producto</p>
                                                                <p className="text-sm font-bold text-primary italic">{pur.productName}</p>
                                                            </div>
                                                        </div>
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
