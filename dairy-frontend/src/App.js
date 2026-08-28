import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layout & Components
import Navbar from "./components/Navbar";

// Core Pages
import Home from "./pages/Home";

// Shop / Customer Pages
import ShopDashboard from "./pages/shop/ShopDashboard";
import Cart from "./pages/shop/Cart";
import AddressPage from "./pages/shop/AddressPage";
import PaymentPage from "./pages/shop/PaymentPage";
import OrderStatus from "./pages/shop/OrderStatus";
import OrderHistory from "./pages/shop/OrderHistory";
import UserDashboard from "./pages/shop/UserDashboard";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";

// Staff Pages
import StaffDashboard from "./pages/staff/StaffDashboard";

// Route Guard
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    try {
      const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(savedCart);
    } catch (err) {
      console.error("Cart load error:", err);
      setCart([]);
    }

    // Listen for cart updates from other components (e.g. Home add-to-cart)
    const handleStorage = () => {
      try {
        const updated = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(updated);
      } catch (_) {}
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <BrowserRouter>
      <Navbar cart={cart} />

      <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />

          {/* PROTECTED CHECKOUT FLOW */}
          <Route
            path="/address"
            element={
              <ProtectedRoute>
                <AddressPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-status"
            element={
              <ProtectedRoute>
                <OrderStatus />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrderHistory />
              </ProtectedRoute>
            }
          />

          {/* USER DASHBOARD */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          {/* SHOP DASHBOARD (PROTECTED) */}
          <Route
            path="/shop"
            element={
              <ProtectedRoute role="shop">
                <ShopDashboard setCart={setCart} />
              </ProtectedRoute>
            }
          />

          {/* ADMIN ROUTES (PROTECTED) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute role="admin">
                <AdminOrders />
              </ProtectedRoute>
            }
          />

          {/* STAFF ROUTE (PROTECTED) */}
          <Route
            path="/staff"
            element={
              <ProtectedRoute role="staff">
                <StaffDashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 NOT FOUND */}
          <Route
            path="*"
            element={
              <div
                style={{
                  minHeight: "80vh",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  padding: "40px 20px",
                  fontFamily: "'Outfit', sans-serif",
                  background: "var(--dn-page-bg, #f0f6ff)",
                }}
              >
                <h1 style={{ fontSize: "72px", color: "#0b57a4", margin: "0 0 12px" }}>
                  404
                </h1>
                <h2 style={{ fontSize: "24px", color: "var(--dn-text, #1e293b)", margin: "0 0 16px" }}>
                  Page Not Found
                </h2>
                <p style={{ color: "var(--dn-muted, #64748b)", maxWidth: "420px", margin: "0 0 24px" }}>
                  The page you are looking for does not exist or has been moved.
                </p>
                <a
                  href="/"
                  style={{
                    padding: "12px 24px",
                    borderRadius: "12px",
                    background: "#0b57a4",
                    color: "#fff",
                    textDecoration: "none",
                    fontWeight: "600",
                  }}
                >
                  Back to Home
                </a>
              </div>
            }
          />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
