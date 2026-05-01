import React from "react";
import { Link } from "react-router-dom";
import { Gamepad2 } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/5 py-10 text-center">
      <Link to="/" className="flex items-center justify-center gap-3 mb-4">
        <Gamepad2 size={24} className="text-[#ff2e2e]" />
        <span className="text-xl font-bold text-white uppercase">
          Nexus Store
        </span>
      </Link>
      <p className="text-gray-500 text-xs">
        © 2026 Nexus Store. Todos los derechos reservados.
      </p>
    </footer>
  );
};

export default Footer;
