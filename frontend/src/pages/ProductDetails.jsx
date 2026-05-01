import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ArrowLeft, ShieldCheck, Zap, Globe, Cpu, CreditCard, ChevronRight, Package, Info, Image as ImageIcon } from 'lucide-react';
import API_URL from '../config/api';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, buyProduct } = useAuth();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImg, setActiveImg] = useState(0);

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
            title: '¿CONFIRMAR ADQUISICIÓN?',
            html: `
                <div class="text-left space-y-4">
                    <p class="text-gray-400 text-sm">Estás a punto de canjear <span class="text-secondary font-bold">${product.price} Coins</span> por <span class="text-white font-bold">${product.name}</span>.</p>
                    <div class="p-4 bg-primary/10 border border-primary/20 rounded-2xl">
                        <p class="text-[10px] font-black text-primary uppercase tracking-widest mb-1">AVISO IMPORTANTE</p>
                        <p class="text-xs text-gray-400 leading-relaxed">Esta transacción se realiza con <b>Nexus Coins</b> (moneda virtual). Al confirmar, aceptas que esta operación es <b>FINAL Y NO REEMBOLSABLE</b> bajo ninguna circunstancia.</p>
                    </div>
                </div>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'SÍ, CONOZCO LOS TÉRMINOS Y COMPRO',
            cancelButtonText: 'CANCELAR',
            background: '#0a0a0a',
            color: '#fff',
            confirmButtonColor: '#ff2e2e',
            cancelButtonColor: '#1a1a1a',
            customClass: {
                confirmButton: 'font-black uppercase tracking-widest text-xs py-4 px-8 rounded-xl',
                cancelButton: 'font-black uppercase tracking-widest text-xs py-4 px-8 rounded-xl'
            }
        });

        if (result.isConfirmed) {
            try {
                const data = await buyProduct(product._id);
                Swal.fire({
                    title: '¡COMPRA EXITOSA!',
                    html: `
                        <div class="space-y-6">
                            <p class="text-gray-400 text-sm">Has desbloqueado <b>${product.name}</b> satisfactoriamente.</p>
                            <div class="p-6 bg-white/5 rounded-[2rem] border border-white/10 border-dashed">
                                <p class="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2">TICKET DE TRANSACCIÓN</p>
                                <p class="text-3xl font-black text-secondary tracking-tighter">${data.ticketNumber}</p>
                            </div>
                            <p class="text-[10px] text-gray-600 font-bold uppercase tracking-widest leading-relaxed">Guarda este número para cualquier reclamación o soporte técnico en Discord.</p>
                        </div>
                    `,
                    icon: 'success',
                    background: '#0a0a0a',
                    color: '#fff',
                    confirmButtonText: 'ENTENDIDO',
                    confirmButtonColor: '#ffd000',
                    customClass: {
                        confirmButton: 'w-full font-black uppercase tracking-widest text-xs py-4 rounded-xl'
                    }
                });
            } catch (err) {
                Swal.fire('Error', err.response?.data?.error || 'Fallo en la transacción', 'error');
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

    const allImages = [product.image, ...(product.images || [])];

    return (
        <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-20 relative overflow-hidden bg-grid">
            <div className="absolute top-0 left-[-5%] w-[40%] h-[40%] bg-primary/5 blur-[150px] rounded-full pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                <button onClick={() => navigate('/store')} className="flex items-center gap-2 text-gray-500 hover:text-white font-bold transition-all mb-10 group">
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> VOLVER AL CATÁLOGO
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                    {/* Visual Asset - Left */}
                    <div className="lg:col-span-7 flex flex-col gap-8">
                        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="glass-card rounded-[3rem] overflow-hidden border border-white/5 relative bg-black/50">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={activeImg}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    src={allImages[activeImg]}
                                    className="w-full h-auto min-h-[500px] object-cover"
                                    alt=""
                                />
                            </AnimatePresence>
                            <div className="absolute top-8 left-8 z-20">
                                <div className="bg-[#ff2e2e] text-white text-[10px] font-black px-5 py-2 rounded-xl shadow-2xl uppercase tracking-widest">RECURSO PREMIUM</div>
                            </div>
                        </motion.div>

                        {/* Thumbnails */}
                        {allImages.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                                {allImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImg(idx)}
                                        className={`shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all ${activeImg === idx ? 'border-primary' : 'border-white/5 opacity-50 hover:opacity-100'}`}
                                    >
                                        <img src={img} className="w-full h-full object-cover" alt="" />
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="glass-card rounded-[3rem] p-10 border border-white/5">
                            <h2 className="text-2xl font-display font-black text-white mb-6 border-b border-white/5 pb-6 flex items-center gap-4">
                                <Info className="text-primary" size={24} /> Descripción del activo
                            </h2>
                            <p className="text-lg text-gray-400 leading-relaxed font-medium whitespace-pre-wrap">{product.description}</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 pt-12 border-t border-white/5">
                                <div className="flex items-center gap-5 p-5 bg-white/[0.02] rounded-3xl border border-white/5">
                                    <div className="p-3 bg-primary/10 rounded-2xl text-primary"><ShieldCheck size={24} /></div>
                                    <div><h4 className="font-bold text-white text-sm">Protección Escrow</h4><p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Transferencia Segura</p></div>
                                </div>
                                <div className="flex items-center gap-5 p-5 bg-white/[0.02] rounded-3xl border border-white/5">
                                    <div className="p-3 bg-secondary/10 rounded-2xl text-secondary"><Globe size={24} /></div>
                                    <div><h4 className="font-bold text-white text-sm">Entrega Mundial</h4><p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Sync Automática</p></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Transaction Panel - Right */}
                    <motion.aside initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-5 flex flex-col gap-8 sticky top-32">
                        <div className="glass-card rounded-[3rem] p-10 glow-border border-[#ff2e2e]/20 relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 blur-[80px] pointer-events-none"></div>

                            <div className="flex items-center gap-3 mb-8">
                                <Package size={20} className="text-primary" />
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Checkout Seguro</span>
                            </div>

                            <h1 className="text-4xl font-display font-black text-white mb-6 tracking-tight leading-tight uppercase">{product.name}</h1>

                            <div className="mb-10 bg-black/40 rounded-3xl p-8 border border-white/5">
                                <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Inversión Necesaria</p>
                                <div className="flex items-end gap-2">
                                    <span className="text-5xl font-black text-secondary">{product.price}</span>
                                    <span className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1.5">Monedas Nexus</span>
                                </div>
                            </div>

                            <button onClick={handlePurchase} className="w-full btn-card-primary py-6 font-black text-lg shadow-[0_20px_40px_rgba(255,46,46,0.3)] group uppercase tracking-widest">
                                <ShoppingCart size={22} className="group-hover:rotate-[-10deg] transition-transform" /> CONFIRMAR PAGO
                            </button>

                            <div className="mt-8 flex items-center justify-center gap-6 opacity-30">
                                <CreditCard size={20} /> <Globe size={20} /> <Cpu size={20} />
                            </div>
                        </div>

                        <div className="glass-card rounded-3xl p-8 border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/[0.04] transition-all">
                            <div className="flex items-center gap-5">
                                <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500"><Info size={24} /></div>
                                <div><h4 className="font-bold text-white">¿Soporte Técnico?</h4><p className="text-xs text-gray-500 font-medium font-bold">Ticket en nuestro Discord</p></div>
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
