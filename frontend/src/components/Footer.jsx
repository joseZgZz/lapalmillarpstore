import React from "react";
import { Link } from "react-router-dom";
import { Gamepad2 } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-[#0a0a0a] border-t border-white/5 py-10 text-center">
            <Link to="/" className="flex items-center justify-center gap-3 mb-4">
                <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
                <span className="text-xl font-bold text-white uppercase">
                    La Palmilla Store
                </span>
            </Link>
            <p className="text-gray-500 text-xs">
                © 2026 La Palmilla Store. Todos los derechos reservados.
            </p>
        </footer>
    );
};

export default Footer;
