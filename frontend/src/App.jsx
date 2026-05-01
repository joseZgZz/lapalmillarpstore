import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Store from "./pages/Store";
import ProductDetails from "./pages/ProductDetails";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import BattlePass from "./pages/BattlePass";
import Announcements from "./pages/Announcements";
import Login from "./pages/Login";
import Register from "./pages/Register";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/" />;
  return children;
};

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/store" element={<Store />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route path="/battlepass" element={<BattlePass />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
