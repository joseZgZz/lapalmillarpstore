import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowLeft, ShieldCheck, Zap, Globe, Cpu, CreditCard, ChevronRight, Package, Info } from 'lucide-react';
import API_URL from '../config/api';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, buyProduct } = useAuth();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${API_URL}/api/products/${id}`, {
                    headers: { Authorization: token ? `Bearer ${token}` : '' }
                });
                setProduct(res.data);
            } catch (err) { }
            setLoading(false);
        };
        fetchProduct();
    }, [id]);

    const handlePurchase = async () => {
        if (!user) {
            Swal.fire({ title: 'Atención', text: 'Debes iniciar sesión para comprar.', icon: 'warning', background: '#0a0a0a', color: '#fff' });
            return;
        }

        const result = await Swal.fire({
            title: 'Confirmar Adquisición',
            text: `¿Estás seguro de adquirir ${product.name} por ${product.price} monedas?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, adquirir ahora',
            cancelButtonText: 'Cancelar',
            background: '#0a0a0a',
            color: '#fff',
            confirmButtonColor: '#ff2e2e',
            cancelButtonColor: '#1a1a1a'
        });

        if (result.isConfirmed) {
            try {
                await buyProduct(product._id);
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'Activo desbloqueado correctamente. Consulta tu inventario en el servidor.',
                    icon: 'success',
                    background: '#0a0a0a',
                    color: '#fff'
                });
            } catch (err) {
                Swal.fire('Error', err.response?.data?.message || 'Fallo en la transacción', 'error');
            }
        }
    };

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-[#0a0a0a]">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
    );

    if (!product) return (
        <div className="h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white">
            <h1 className="text-4xl font-black mb-4">404: ASSET NOT FOUND</h1>
            <button onClick={() => navigate('/store')} className="btn-card-secondary px-8 py-3">VOLVER A LA TIENDA</button>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-20 relative overflow-hidden bg-grid">
            {/* Background Ambience */}
            <div className="absolute top-0 left-[-5%] w-[40%] h-[40%] bg-primary/5 blur-[150px] rounded-full pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Back Link */}
                <button
                    onClick={() => navigate('/store')}
                    className="flex items-center gap-2 text-gray-500 hover:text-white font-bold transition-all mb-10 group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    VOLVER AL CATÁLOGO
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                    {/* Visual Asset - Left */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-7 flex flex-col gap-8"
                    >
                        <div className="glass-card rounded-[3rem] overflow-hidden border border-white/5 relative">
                            <div className="absolute top-8 left-8 z-20">
                                <div className="bg-[#ff2e2e] text-white text-xs font-black px-5 py-2 rounded-xl shadow-2xl">RECURSO PREMIUM</div>
                            </div>
                            <img src={product.image} className="w-full h-auto min-h-[500px] object-cover" alt="" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60"></div>
                        </div>

                        {/* Extended Details UI */}
                        <div className="glass-card rounded-[3rem] p-10 border border-white/5">
                            <h2 className="text-3xl font-display font-black text-white mb-8 border-b border-white/5 pb-6">Descripción del activo</h2>
                            <div className="prose prose-invert max-w-none">
                                <p className="text-xl text-gray-400 leading-relaxed font-medium">
                                    {product.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 pt-12 border-t border-white/5">
                                <div className="flex items-center gap-5 p-5 bg-white/[0.02] rounded-3xl border border-white/5">
                                    <div className="p-3 bg-primary/10 rounded-2xl text-primary"><ShieldCheck size={24} /></div>
                                    <div>
                                        <h4 className="font-bold text-white leading-none mb-1">Protección Escrow</h4>
                                        <p className="text-xs text-gray-500 uppercase tracking-widest font-black">Transferencia Segura</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-5 p-5 bg-white/[0.02] rounded-3xl border border-white/5">
                                    <div className="p-3 bg-secondary/10 rounded-2xl text-secondary"><Globe size={24} /></div>
                                    <div>
                                        <h4 className="font-bold text-white leading-none mb-1">Entrega Mundial</h4>
                                        <p className="text-xs text-gray-500 uppercase tracking-widest font-black">Sync Automática</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Transaction Panel - Right */}
                    <motion.aside
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-5 flex flex-col gap-8 sticky top-32"
                    >
                        <div className="glass-card rounded-[3rem] p-10 glow-border border-[#ff2e2e]/20 relative overflow-hidden">
                            {/* Accent Decoration */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 blur-[80px] pointer-events-none"></div>

                            <div className="flex items-center gap-3 mb-8">
                                <Package size={20} className="text-primary" />
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Checkpoint de Adquisición</span>
                            </div>

                            <h1 className="text-4xl font-display font-black text-white mb-6 tracking-tight leading-tight uppercase">{product.name}</h1>

                            <div className="mb-10 bg-black/40 rounded-3xl p-8 border border-white/5">
                                <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Inversión Final</p>
                                <div className="flex items-end gap-2">
                                    <span className="text-5xl font-black text-secondary">{product.price}</span>
                                    <span className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1.5">Monedas Nexus</span>
                                </div>
                            </div>

                            <div className="space-y-4 mb-10">
                                <div className="flex items-center gap-3 text-sm font-medium text-gray-300">
                                    <div className="w-2 h-2 rounded-full bg-[#ff2e2e]"></div>
                                    <span>Activación instantánea tras la compra.</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm font-medium text-gray-300">
                                    <div className="w-2 h-2 rounded-full bg-[#ff2e2e]"></div>
                                    <span>Vínculo permanente a tu cuenta de Discord.</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm font-medium text-gray-300">
                                    <div className="w-2 h-2 rounded-full bg-secondary"></div>
                                    <span>Recurso optimizado al 100% (High Perforamnce).</span>
                                </div>
                            </div>

                            <button
                                onClick={handlePurchase}
                                className="w-full btn-card-primary py-6 font-black text-lg shadow-[0_20px_40px_rgba(255,46,46,0.3)] group uppercase tracking-widest"
                            >
                                <ShoppingCart size={22} className="group-hover:rotate-[-10deg] transition-transform" /> CONFIRMAR PAGO
                            </button>

                            <div className="mt-8 flex items-center justify-center gap-6 opacity-30">
                                <CreditCard size={20} />
                                <Globe size={20} />
                                <Cpu size={20} />
                            </div>
                        </div>

                        {/* Secondary Support Box */}
                        <div className="glass-card rounded-[2.5rem] p-8 border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/[0.04] transition-all">
                            <div className="flex items-center gap-5">
                                <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500"><Info size={24} /></div>
                                <div>
                                    <h4 className="font-bold text-white">¿Tienes dudas?</h4>
                                    <p className="text-xs text-gray-500 font-medium">Contacta con soporte técnico</p>
                                </div>
                            </div>
                            <ChevronRight size={20} className="text-gray-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </div>
                    </motion.aside>

                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
