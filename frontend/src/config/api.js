// Configuración centralizada de la API
// En desarrollo usa: http://localhost:5000
// En producción usa la variable de entorno VITE_API_URL configurada en Vercel
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default API_URL;
