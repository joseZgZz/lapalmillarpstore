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
    const [activeTab, setActiveTab] = useState('products');

    // Forms
    const [prodForm, setProdForm] = useState({ name: '', description: '', price: '', image: '', images: '', category: '' });
    const [isEditing, setIsEditing] = useState(null);

    // Quick Category Input
    const [catNameInput, setCatNameInput] = useState('');

    const [manualBalanceForm, setManualBalanceForm] = useState({ username: '', amount: '', action: 'add' });
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        if (user && user.role === 'admin') fetchData();
    }, [user, activeTab]);

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        try {
            const [prods, cats, announ, usrs, purch] = await Promise.all([
                axios.get(`${API_URL}/api/products`, { headers }),
                axios.get(`${API_URL}/api/categories`),
                axios.get(`${API_URL}/api/announcements`),
                axios.get(`${API_URL}/api/users`, { headers }),
                axios.get(`${API_URL}/api/admin/purchases`, { headers })
            ]);
            setProducts(prods.data);
            setCategories(cats.data);
            setAnnouncements(announ.data);
            setUsers(usrs.data);
            setPurchases(purch.data);

            if (!prodForm.category && cats.data.length > 0) {
                setProdForm(prev => ({ ...prev, category: cats.data[0].name }));
            }
        } catch (err) { }
    };

    const handleSaveProduct = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const imagesArray = prodForm.images.split(',').map(img => img.trim()).filter(img => img !== '');
            const payload = { ...prodForm, images: imagesArray };
            if (isEditing) {
                await axios.put(`${API_URL}/api/products/${isEditing}`, payload, { headers: { Authorization: `Bearer ${token}` } });
            } else {
                await axios.post(`${API_URL}/api/products`, payload, { headers: { Authorization: `Bearer ${token}` } });
            }
            setProdForm({ name: '', description: '', price: '', image: '', images: '', category: categories[0]?.name || '' });
            setIsEditing(null);
            fetchData();
            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Producto Guardado', showConfirmButton: false, timer: 2000, background: '#0a0a0a', color: '#fff' });
        } catch (err) { }
    };

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
        if (!catNameInput) return Swal.fire('Error', 'Escribe el nombre para borrar', 'error');
        const cat = categories.find(c => c.name.toLowerCase() === catNameInput.toLowerCase());
        if (!cat) return Swal.fire('Error', 'No encontrada', 'error');
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/api/categories/${cat._id}`, { headers: { Authorization: `Bearer ${token}` } });
            setCatNameInput('');
            fetchData();
            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Borrada', showConfirmButton: false, timer: 2000, background: '#0a0a0a', color: '#fff' });
        } catch (err) { }
    };

    if (!user || user.role !== 'admin') return <Navigate to="/" />;

    return (
        <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-20 bg-grid relative overflow-hidden">
            <div className="absolute top-0 right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="flex items-center gap-6">
                        <div className="p-5 bg-primary/10 rounded-[2.5rem] border border-primary/20 text-primary"><ShieldAlert size={40} /></div>
                        <div>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">ADMIN_PORTAL_V3.0</span>
                            <h1 className="text-5xl font-display font-black text-white uppercase mt-1">Nexus <span className="text-primary italic">Control</span></h1>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* LEFT COLUMN: FORM HUB */}
                    <div className="lg:col-span-5 space-y-12">

                        {/* PRODUCT FORM */}
                        <section className="glass-card rounded-[3.5rem] p-10 border border-white/5 relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 blur-3xl"></div>
                            <h2 className="text-2xl font-display font-black text-white flex items-center gap-4 uppercase tracking-tighter mb-8 leading-none">
                                {isEditing ? <Edit3 className="text-secondary" /> : <PlusCircle className="text-primary" />}
                                {isEditing ? 'Editar Producto' : 'Crear Producto'}
                            </h2>
                            <form onSubmit={handleSaveProduct} className="space-y-4">
                                <input type="text" placeholder="Nombre" className="admin-input" value={prodForm.name} onChange={e => setProdForm({ ...prodForm, name: e.target.value })} required />
                                <input type="number" placeholder="Precio CC" className="admin-input" value={prodForm.price} onChange={e => setProdForm({ ...prodForm, price: e.target.value })} required />
                                <select className="admin-input" value={prodForm.category} onChange={e => setProdForm({ ...prodForm, category: e.target.value })} required>
                                    <option value="">Seleccionar Categoría...</option>
                                    {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                                </select>
                                <input type="text" placeholder="Imagen Portada (URL)" className="admin-input" value={prodForm.image} onChange={e => setProdForm({ ...prodForm, image: e.target.value })} required />
                                <textarea placeholder="Galería Extra (URL1, URL2, ...)" className="admin-input min-h-[60px] text-[10px]" value={prodForm.images} onChange={e => setProdForm({ ...prodForm, images: e.target.value })} />
                                <textarea placeholder="Descripción..." className="admin-input min-h-[100px]" value={prodForm.description} onChange={e => setProdForm({ ...prodForm, description: e.target.value })} required />
                                <button type="submit" className={`w-full py-5 rounded-3xl font-black text-xs tracking-widest ${isEditing ? 'bg-secondary text-black' : 'btn-card-primary'}`}>
                                    {isEditing ? 'ACTUALIZAR ARTÍCULO' : 'PUBLICAR ARTÍCULO'}
                                </button>
                                {isEditing && <button type="button" onClick={() => { setIsEditing(null); setProdForm({ name: '', description: '', price: '', image: '', images: '', category: '' }); }} className="w-full py-2 text-gray-500 font-bold text-[10px] uppercase tracking-widest">CANCELAR</button>}
                            </form>
                        </section>

                        {/* CATEGORY MANAGEMENT - NOW DIRECTLY BELOW */}
                        <section className="glass-card rounded-[3.5rem] p-10 border border-white/5 relative overflow-hidden bg-white/[0.01]">
                            <h2 className="text-2xl font-display font-black text-white flex items-center gap-4 uppercase tracking-tighter mb-4 leading-none">
                                <Layers className="text-secondary" /> Gestionar Categorías
                            </h2>
                            <p className="text-xs text-gray-500 font-bold mb-8 leading-relaxed uppercase tracking-widest">Crea o elimina secciones de la tienda</p>

                            <div className="space-y-4">
                                <input type="text" placeholder="Nombre de categoría (VIP, Coches...)" className="admin-input border-secondary/20" value={catNameInput} onChange={e => setCatNameInput(e.target.value)} />
                                <div className="flex gap-4">
                                    <button onClick={handleCreateCategory} className="flex-1 py-4 bg-secondary text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">AÑADIR</button>
                                    <button onClick={handleDeleteCategoryByName} className="flex-1 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">BORRAR</button>
                                </div>
                            </div>

                            <div className="mt-10 flex flex-wrap gap-2">
                                {categories.map(c => (
                                    <span key={c._id} onClick={() => setCatNameInput(c.name)} className="px-5 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-gray-400 cursor-pointer hover:border-secondary hover:text-secondary transition-all uppercase tracking-widest">{c.name}</span>
                                ))}
                            </div>
                        </section>

                    </div>

                    {/* RIGHT COLUMN: LISTS */}
                    <div className="lg:col-span-7 space-y-12">

                        {/* PRODUCT LIST */}
                        <section className="glass-card rounded-[3.5rem] p-10 border border-white/5">
                            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-10">Catálogo en Vivo</h3>
                            <div className="space-y-4 max-h-[700px] overflow-y-auto pr-4 no-scrollbar">
                                {products.map(p => (
                                    <div key={p._id} className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-3xl group hover:border-primary/30 transition-all">
                                        <div className="flex items-center gap-5">
                                            <img src={p.image} className="w-14 h-14 rounded-2xl object-cover shadow-2xl" alt="" />
                                            <div>
                                                <h4 className="font-bold text-white text-sm">{p.name}</h4>
                                                <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">{p.price} CC • <span className="text-secondary">{p.category}</span></p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => { setIsEditing(p._id); setProdForm({ name: p.name, description: p.description, price: p.price, image: p.image, images: p.images?.join(', ') || '', category: p.category }); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="p-3 bg-white/5 rounded-xl text-gray-500 hover:text-secondary hover:bg-secondary/10 transition-all"><Edit3 size={18} /></button>
                                            <button onClick={() => {
                                                Swal.fire({ title: '¿Seguro?', icon: 'warning', showCancelButton: true, background: '#0a0a0a', color: '#fff' }).then(res => {
                                                    if (res.isConfirmed) {
                                                        const token = localStorage.getItem('token');
                                                        axios.delete(`${API_URL}/api/products/${p._id}`, { headers: { Authorization: `Bearer ${token}` } }).then(() => fetchData());
                                                    }
                                                });
                                            }} className="p-3 bg-white/5 rounded-xl text-gray-500 hover:text-primary hover:bg-primary/10 transition-all"><Trash2 size={18} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* QUICK COIN MANAGEMENT */}
                        <section className="glass-card rounded-[3.5rem] p-10 border border-white/5 bg-secondary/[0.02]">
                            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-8">Gestión de Economía</h3>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <input type="text" placeholder="Usuario" className="admin-input flex-1" value={manualBalanceForm.username} onChange={e => setManualBalanceForm({ ...manualBalanceForm, username: e.target.value })} />
                                <input type="number" placeholder="Monto" className="admin-input w-full sm:w-32" value={manualBalanceForm.amount} onChange={e => setManualBalanceForm({ ...manualBalanceForm, amount: e.target.value })} />
                                <div className="flex gap-2">
                                    <button onClick={() => { const f = { ...manualBalanceForm, action: 'add' }; axios.post(`${API_URL}/api/users/manage-coins`, f, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }).then(() => fetchData()); }} className="px-6 py-4 bg-secondary text-black rounded-2xl font-black text-[10px] uppercase">AÑADIR</button>
                                    <button onClick={() => { const f = { ...manualBalanceForm, action: 'remove' }; axios.post(`${API_URL}/api/users/manage-coins`, f, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }).then(() => fetchData()); }} className="px-6 py-4 bg-primary text-white rounded-2xl font-black text-[10px] uppercase">QUITAR</button>
                                </div>
                            </div>
                        </section>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default Admin;
