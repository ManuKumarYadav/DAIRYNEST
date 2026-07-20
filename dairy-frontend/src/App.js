import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import Navbar from "./components/Navbar";
import AdminOrders from "./pages/admin/AdminOrders";
import PaymentPage from "./pages/PaymentPage";
import Cart from "./pages/shop/Cart";
import OrderStatus from "./pages/OrderStatus";
import OrderHistory from "./pages/orderHistory";
import AddressPage from "./pages/shop/AddressPage";


import Home from "./pages/Home";

import AdminDashboard from "./pages/admin/AdminDashboard";
import StaffDashboard from "./pages/staff/StaffDashboard";
import ShopDashboard from "./pages/shop/ShopDashboard";

import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    try {
      const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(savedCart);
    } catch (err) {
      console.log("Cart load error:", err);
      setCart([]);
    }
  }, []);

  return (
    <BrowserRouter>
      <Navbar cart={cart} />

      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/payment" element={<PaymentPage />} />   
        <Route path="/order-status" element={<OrderStatus />} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="/address" element={<AddressPage />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff"
          element={
            <ProtectedRoute role="staff">
              <StaffDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/shop"
          element={
            <ProtectedRoute role="shop">
              <ShopDashboard setCart={setCart} />
            </ProtectedRoute>
          }
        />

        <Route path="/cart" element={<Cart />} />

        <Route path="*" element={<h2>404 Page Not Found</h2>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
