import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import {
  Database,
  Trash2,
  ShieldAlert,
  PlusCircle,
  LayoutGrid,
  Users,
  DollarSign,
  Image as ImageIcon,
  AlignLeft,
  Package,
  BarChart3,
  Settings,
  Bell,
  Calendar,
  X,
  Check,
  Save,
  Zap,
  Coins,
  ChevronRight,
  History,
  Ticket,
  Edit3,
  Plus,
  Hash,
  Layers,
  ImagePlus,
} from "lucide-react";
import API_URL from "../config/api";

const Admin = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [users, setUsers] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [categories, setCategories] = useState([]);

  const [prodForm, setProdForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    images: "",
    category: "",
  });
  const [isEditing, setIsEditing] = useState(null);
  const [catNameInput, setCatNameInput] = useState("");
  const [manualBalanceForm, setManualBalanceForm] = useState({
    username: "",
    amount: "",
    action: "add",
  });

  useEffect(() => {
    if (user && user.role === "admin") {
      console.log("Admin detectado, cargando datos...");
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    // Fetch products & categories separately to avoid full crash
    try {
      const res = await axios.get(`${API_URL}/api/products`, { headers });
      setProducts(res.data);
    } catch (e) {
      console.error("Error productos", e);
    }

    try {
      const res = await axios.get(`${API_URL}/api/categories`);
      if (Array.isArray(res.data)) {
        setCategories(res.data);
        if (res.data.length > 0 && !prodForm.category) {
          setProdForm((prev) => ({ ...prev, category: res.data[0].name }));
        }
      }
    } catch (e) {
      console.error("Error categorías", e);
    }

    try {
      const res = await axios.get(`${API_URL}/api/users`, { headers });
      setUsers(res.data);
    } catch (e) {}

    try {
      const res = await axios.get(`${API_URL}/api/admin/purchases`, {
        headers,
      });
      setPurchases(res.data);
    } catch (e) {}
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const imagesArray = prodForm.images
        .split(",")
        .map((img) => img.trim())
        .filter((img) => img !== "");
      const payload = { ...prodForm, images: imagesArray };
      if (isEditing) {
        await axios.put(`${API_URL}/api/products/${isEditing}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${API_URL}/api/products`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setProdForm({
        name: "",
        description: "",
        price: "",
        image: "",
        images: "",
        category: categories[0]?.name || "",
      });
      setIsEditing(null);
      fetchData();
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "¡Guardado!",
        showConfirmButton: false,
        timer: 2000,
        background: "#0a0a0a",
        color: "#fff",
      });
    } catch (err) {
      Swal.fire("Error", "Fallo al guardar", "error");
    }
  };

  const handleCreateCategory = async () => {
    if (!catNameInput) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/api/categories`,
        { name: catNameInput, icon: "Package" },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setCatNameInput("");
      fetchData();
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Categoría Creada",
        background: "#0a0a0a",
        color: "#fff",
      });
    } catch (err) {}
  };

  const handleDeleteCategoryByName = async () => {
    if (!catNameInput) return;
    const cat = categories.find(
      (c) => c.name.toLowerCase() === catNameInput.toLowerCase(),
    );
    if (!cat)
      return Swal.fire("No encontrada", "Escribe el nombre exacto", "error");
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/api/categories/${cat._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCatNameInput("");
      fetchData();
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Borrada",
        background: "#0a0a0a",
        color: "#fff",
      });
    } catch (err) {}
  };

  const handleCoinsAction = async (action) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/api/users/manage-coins`,
        { ...manualBalanceForm, action },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setManualBalanceForm({ username: "", amount: "", action: "add" });
      fetchData();
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Balance Actualizado",
        background: "#0a0a0a",
        color: "#fff",
      });
    } catch (err) {
      Swal.fire("Error", "Fallo", "error");
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="glass-card p-10 text-center max-w-md">
          <ShieldAlert size={60} className="text-primary mx-auto mb-6" />
          <h1 className="text-2xl font-black text-white mb-4 uppercase">
            ACCESO RESTRINGIDO
          </h1>
          <p className="text-gray-500 mb-8 font-bold">
            No tienes permisos de administrador o no has iniciado sesión.
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="btn-card-primary px-8 py-3"
          >
            VOLVER AL INICIO
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-20 bg-grid relative overflow-hidden">
      <div className="absolute top-0 right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <header className="mb-16">
          <div className="flex items-center gap-6">
            <div className="p-5 bg-primary/10 rounded-[2.5rem] border border-primary/20 text-primary">
              <ShieldAlert size={40} />
            </div>
            <div>
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">
                SISTEMA_CORE_V3.1
              </span>
              <h1 className="text-5xl font-display font-black text-white uppercase mt-1">
                Nexus <span className="text-primary italic">Control</span>
              </h1>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* HUB DE CREACIÓN (IZQUIERDA) */}
          <div className="lg:col-span-5 space-y-8">
            {/* 1. CREAR PRODUCTO */}
            <section className="glass-card rounded-[3.5rem] p-10 border border-white/5 bg-[#111]/40">
              <h2 className="text-2xl font-display font-black text-white flex items-center gap-4 uppercase tracking-tighter mb-6">
                {isEditing ? (
                  <Edit3 className="text-secondary" />
                ) : (
                  <PlusCircle className="text-primary" />
                )}
                {isEditing ? "EDITAR PRODUCTO" : "NUEVO PRODUCTO"}
              </h2>
              <form onSubmit={handleSaveProduct} className="space-y-4">
                <input
                  type="text"
                  placeholder="Nombre"
                  className="admin-input"
                  value={prodForm.name}
                  onChange={(e) =>
                    setProdForm({ ...prodForm, name: e.target.value })
                  }
                  required
                />
                <input
                  type="number"
                  placeholder="Precio CC"
                  className="admin-input"
                  value={prodForm.price}
                  onChange={(e) =>
                    setProdForm({ ...prodForm, price: e.target.value })
                  }
                  required
                />
                <select
                  className="admin-input"
                  value={prodForm.category}
                  onChange={(e) =>
                    setProdForm({ ...prodForm, category: e.target.value })
                  }
                  required
                >
                  <option value="">-- Elige Categoría --</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="URL Imagen Principal"
                  className="admin-input"
                  value={prodForm.image}
                  onChange={(e) =>
                    setProdForm({ ...prodForm, image: e.target.value })
                  }
                  required
                />
                <textarea
                  placeholder="Galería extra (url1, url2...)"
                  className="admin-input min-h-[60px] text-[10px]"
                  value={prodForm.images}
                  onChange={(e) =>
                    setProdForm({ ...prodForm, images: e.target.value })
                  }
                />
                <textarea
                  placeholder="Descripción..."
                  className="admin-input min-h-[100px]"
                  value={prodForm.description}
                  onChange={(e) =>
                    setProdForm({ ...prodForm, description: e.target.value })
                  }
                  required
                />
                <button
                  type="submit"
                  className={`w-full py-5 rounded-3xl font-black text-xs tracking-widest ${isEditing ? "bg-secondary text-black" : "btn-card-primary"}`}
                >
                  {isEditing ? "GUARDAR CAMBIOS" : "PUBLICAR PRODUCTO"}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(null);
                      setProdForm({
                        name: "",
                        description: "",
                        price: "",
                        image: "",
                        images: "",
                        category: "",
                      });
                    }}
                    className="w-full mt-2 text-gray-500 font-bold text-[10px] uppercase"
                  >
                    CANCELAR
                  </button>
                )}
              </form>
            </section>

            {/* 2. GESTIONAR CATEGORÍAS (DEBAJO DEL PRODUCTO) */}
            <section className="glass-card rounded-[3.5rem] p-10 border border-white/5 bg-secondary/[0.02]">
              <h2 className="text-2xl font-display font-black text-white flex items-center gap-4 uppercase tracking-tighter mb-4">
                <Layers className="text-secondary" /> CONFIGURAR CATEGORÍAS
              </h2>
              <p className="text-[10px] text-gray-500 font-black mb-8 uppercase tracking-widest leading-loose">
                Escribe el nombre y usa los botones para añadir o quitar
                secciones de la tienda.
              </p>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="VIP, Vehículos, Dinero..."
                  className="admin-input border-secondary/20"
                  value={catNameInput}
                  onChange={(e) => setCatNameInput(e.target.value)}
                />
                <div className="flex gap-4">
                  <button
                    onClick={handleCreateCategory}
                    className="flex-1 py-4 bg-secondary text-black rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-secondary/10"
                  >
                    AÑADIR
                  </button>
                  <button
                    onClick={handleDeleteCategoryByName}
                    className="flex-1 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/10"
                  >
                    ELIMINAR
                  </button>
                </div>
              </div>
              <div className="mt-8 flex flex-wrap gap-2">
                {categories.map((c) => (
                  <span
                    key={c._id}
                    onClick={() => setCatNameInput(c.name)}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black text-gray-500 hover:text-secondary hover:border-secondary cursor-pointer transition-all uppercase"
                  >
                    {c.name}
                  </span>
                ))}
              </div>
            </section>
          </div>

          {/* LISTADOS (DERECHA) */}
          <div className="lg:col-span-7 space-y-10">
            <section className="glass-card rounded-[3.5rem] p-10 border border-white/5">
              <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-10">
                Artículos en Venta
              </h3>
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4 no-scrollbar">
                {products.map((p) => (
                  <div
                    key={p._id}
                    className="flex items-center justify-between p-5 bg-white/[0.01] border border-white/5 rounded-3xl group"
                  >
                    <div className="flex items-center gap-5">
                      <img
                        src={p.image}
                        className="w-14 h-14 rounded-2xl object-cover shadow-2xl"
                        alt=""
                      />
                      <div>
                        <h4 className="font-bold text-white text-sm">
                          {p.name}
                        </h4>
                        <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">
                          {p.price} CC •{" "}
                          <span className="text-secondary">{p.category}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setIsEditing(p._id);
                          setProdForm({
                            name: p.name,
                            description: p.description,
                            price: p.price,
                            image: p.image,
                            images: p.images?.join(", ") || "",
                            category: p.category,
                          });
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="p-3 text-gray-500 hover:text-secondary bg-white/5 rounded-xl"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={async () => {
                          const res = await Swal.fire({
                            title: "¿Borrar?",
                            icon: "warning",
                            showCancelButton: true,
                            background: "#0a0a0a",
                            color: "#fff",
                          });
                          if (res.isConfirmed) {
                            const token = localStorage.getItem("token");
                            await axios.delete(
                              `${API_URL}/api/products/${p._id}`,
                              { headers: { Authorization: `Bearer ${token}` } },
                            );
                            fetchData();
                          }
                        }}
                        className="p-3 text-gray-500 hover:text-primary bg-white/5 rounded-xl"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="glass-card rounded-[3.5rem] p-10 border border-white/5">
              <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-8">
                Gestión de Coins
              </h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Usuario"
                  className="admin-input flex-1"
                  value={manualBalanceForm.username}
                  onChange={(e) =>
                    setManualBalanceForm({
                      ...manualBalanceForm,
                      username: e.target.value,
                    })
                  }
                />
                <input
                  type="number"
                  placeholder="Coins"
                  className="admin-input w-28"
                  value={manualBalanceForm.amount}
                  onChange={(e) =>
                    setManualBalanceForm({
                      ...manualBalanceForm,
                      amount: e.target.value,
                    })
                  }
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCoinsAction("add")}
                    className="px-6 py-4 bg-secondary text-black rounded-2xl font-black text-[10px] uppercase"
                  >
                    DAR
                  </button>
                  <button
                    onClick={() => handleCoinsAction("remove")}
                    className="px-6 py-4 bg-primary text-white rounded-2xl font-black text-[10px] uppercase"
                  >
                    QUITAR
                  </button>
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
