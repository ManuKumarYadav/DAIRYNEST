import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/BackButton";
import { API_BASE_URL, getImageUrl } from "../../api/config";

const persistUser = (nextUser) => {
  const { password, ...safe } = nextUser || {};
  localStorage.setItem("user", JSON.stringify(safe));
  window.dispatchEvent(new Event("dn-user-updated"));
  return safe;
};

const UserDashboard = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [cartCount, setCartCount] = useState(0);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");
  const [profileErr, setProfileErr] = useState("");

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("user"));
      if (!stored) {
        navigate("/");
        return;
      }
      setUser(stored);
      setForm({
        name: stored.name || "",
        phone: stored.phone || "",
        address: stored.address || "",
        city: stored.city || "",
        pincode: stored.pincode || "",
      });

      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartCount(cart.length);

      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      (async () => {
        try {
          const meRes = await fetch(
            `${API_BASE_URL}/api/users/me?email=${encodeURIComponent(stored.email || stored.userId || "")}`,
            { headers }
          );
          if (meRes.ok) {
            const data = await meRes.json();
            const merged = persistUser({ ...stored, ...data });
            setUser(merged);
            setForm({
              name: merged.name || "",
              phone: merged.phone || "",
              address: merged.address || "",
              city: merged.city || "",
              pincode: merged.pincode || "",
            });
          }
        } catch (_) {}

        try {
          setLoadingOrders(true);
          const orderRes = await fetch(`${API_BASE_URL}/api/orders/my`, { headers });
          const orderData = await orderRes.json();
          if (Array.isArray(orderData)) setOrders(orderData);
          else setOrders(JSON.parse(localStorage.getItem("latestOrders")) || []);
        } catch (_) {
          setOrders(JSON.parse(localStorage.getItem("latestOrders")) || []);
        } finally {
          setLoadingOrders(false);
        }
      })();
    } catch (e) {
      navigate("/");
    }
  }, [navigate]);

  const authHeaders = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };

  const handleFormChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setProfileMsg("");
    setProfileErr("");
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileMsg("");
    setProfileErr("");

    if (!form.name.trim()) {
      setProfileErr("Name is required.");
      return;
    }
    if (form.phone && !/^\d{10}$/.test(form.phone.trim())) {
      setProfileErr("Enter a valid 10-digit phone number.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          pincode: form.pincode.trim(),
          email: user.email || user.userId || "",
          userId: user._id,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || data.error || "Could not save profile");

      const safe = persistUser({ ...user, ...data.user });
      setUser(safe);
      localStorage.setItem(
        "address",
        JSON.stringify({
          name: safe.name,
          phone: safe.phone,
          address: safe.address,
          city: safe.city,
          pincode: safe.pincode,
        })
      );
      setProfileMsg("Profile saved.");
    } catch (err) {
      const fallback = persistUser({ ...user, ...form, name: form.name.trim() });
      setUser(fallback);
      localStorage.setItem(
        "address",
        JSON.stringify({
          name: fallback.name,
          phone: fallback.phone,
          address: fallback.address,
          city: fallback.city,
          pincode: fallback.pincode,
        })
      );
      setProfileErr(err.message || "Saved on this device only. Server update failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarPick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setProfileErr("Please choose an image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setProfileErr("Image must be 2MB or smaller.");
      return;
    }

    setUploading(true);
    setProfileMsg("");
    setProfileErr("");

    try {
      const fd = new FormData();
      fd.append("avatar", file);
      fd.append("email", user.email || user.userId || "");
      fd.append("userId", user._id || "");
      const res = await fetch(`${API_BASE_URL}/api/users/avatar`, {
        method: "POST",
        headers: authHeaders(),
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || data.error || "Upload failed");
      const safe = persistUser({ ...user, ...data.user });
      setUser(safe);
      setProfileMsg("Profile picture updated.");
    } catch (err) {
      const reader = new FileReader();
      reader.onload = () => {
        const safe = persistUser({ ...user, avatar: reader.result });
        setUser(safe);
        setProfileErr(err.message || "Saved picture on this device only.");
      };
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
    }
  };

  if (!user) return null;

  const totalSpent = orders.reduce((sum, o) => sum + (o.totalAmount || o.amount || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === "pending" || o.status === "processing").length;
  const deliveredOrders = orders.filter((o) => o.status === "delivered" || o.status === "Delivered").length;
  const initial = user.name ? user.name.charAt(0).toUpperCase() : "U";
  const avatarSrc = user.avatar ? getImageUrl(user.avatar) : "";

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "orders", label: "Orders" },
    { id: "profile", label: "Profile" },
  ];

  const statusColor = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "delivered") return { bg: "#d1fae5", color: "#065f46" };
    if (s === "pending") return { bg: "#fef3c7", color: "#92400e" };
    if (s === "processing") return { bg: "#dbeafe", color: "#1e40af" };
    if (s === "cancelled") return { bg: "#fee2e2", color: "#991b1b" };
    return { bg: "#f3f4f6", color: "#374151" };
  };

  const Avatar = ({ size = 70, className = "" }) => (
    <div className={`dn-avatar-face ${className}`} style={{ width: size, height: size, fontSize: size * 0.42 }}>
      {avatarSrc ? <img src={avatarSrc} alt={user.name || "Profile"} /> : initial}
    </div>
  );

  return (
    <main className="dn-dashboard">
      <div className="dn-dash-container">
        <BackButton to="/" label="Back to Home" />

        <div className="dn-dash-header">
          <button
            type="button"
            className="dn-dash-avatar-btn"
            onClick={() => setActiveTab("profile")}
            aria-label="Edit profile picture"
          >
            <Avatar size={72} />
          </button>
          <div className="dn-dash-intro">
            <h1 className="dn-dash-welcome">Hello, {user.name?.split(" ")[0] || "Customer"}</h1>
            <p className="dn-dash-email">{user.email || user.userId}</p>
            <span className="dn-dash-role-badge">{user.role?.toUpperCase() || "SHOP"} ACCOUNT</span>
          </div>
          <button className="dn-dash-logout-btn" onClick={handleLogout}>
            Sign Out
          </button>
        </div>

        <div className="dn-dash-stats">
          <div className="dn-stat-card">
            <div>
              <p className="dn-stat-label">Total Orders</p>
              <strong className="dn-stat-value">{orders.length}</strong>
            </div>
          </div>
          <div className="dn-stat-card">
            <div>
              <p className="dn-stat-label">Delivered</p>
              <strong className="dn-stat-value">{deliveredOrders}</strong>
            </div>
          </div>
          <div className="dn-stat-card">
            <div>
              <p className="dn-stat-label">In Progress</p>
              <strong className="dn-stat-value">{pendingOrders}</strong>
            </div>
          </div>
          <div className="dn-stat-card accent">
            <div>
              <p className="dn-stat-label">Total Spent</p>
              <strong className="dn-stat-value">₹{totalSpent.toFixed(0)}</strong>
            </div>
          </div>
          <button type="button" className="dn-stat-card" onClick={() => navigate("/cart")}>
            <div>
              <p className="dn-stat-label">Cart Items</p>
              <strong className="dn-stat-value">{cartCount}</strong>
            </div>
          </button>
        </div>

        <div className="dn-dash-tabs" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`dn-dash-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="dn-dash-section">
            <h2 className="dn-section-title">Quick actions</h2>
            <div className="dn-quick-actions">
              <button className="dn-qa-card" onClick={() => navigate("/shop")}>
                <strong>Browse products</strong>
                <p>Shop fresh dairy</p>
              </button>
              <button className="dn-qa-card" onClick={() => navigate("/cart")}>
                <strong>My cart</strong>
                <p>{cartCount} item{cartCount !== 1 ? "s" : ""} waiting</p>
              </button>
              <button className="dn-qa-card" onClick={() => setActiveTab("orders")}>
                <strong>Order history</strong>
                <p>{orders.length} past orders</p>
              </button>
              <button className="dn-qa-card" onClick={() => setActiveTab("profile")}>
                <strong>Edit profile</strong>
                <p>Name, photo, address</p>
              </button>
            </div>

            {orders.length > 0 && (
              <>
                <h2 className="dn-section-title" style={{ marginTop: "28px" }}>
                  Recent orders
                </h2>
                <div className="dn-orders-list">
                  {orders.slice(0, 3).map((order, i) => {
                    const s = statusColor(order.status);
                    return (
                      <div key={order._id || i} className="dn-order-row">
                        <div className="dn-order-id">
                          <strong>#{(order._id || `ORD-${i + 1}`).slice(-6).toUpperCase()}</strong>
                          <span className="dn-order-date">
                            {order.createdAt
                              ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "Just now"}
                          </span>
                        </div>
                        <span className="dn-order-status" style={{ background: s.bg, color: s.color }}>
                          {order.status || "Pending"}
                        </span>
                        <strong className="dn-order-amount">₹{order.totalAmount || order.amount || 0}</strong>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "orders" && (
          <div className="dn-dash-section">
            <h2 className="dn-section-title">All orders</h2>
            {loadingOrders ? (
              <div className="dn-loading-box">
                <div className="dn-spinner" />
                <p>Loading your orders…</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="dn-empty-state">
                <h3>No orders yet</h3>
                <p>Start shopping to see your orders here.</p>
                <button className="dn-shop-now-btn" onClick={() => navigate("/shop")}>
                  Shop now
                </button>
              </div>
            ) : (
              <div className="dn-orders-list">
                {orders.map((order, i) => {
                  const s = statusColor(order.status);
                  return (
                    <div key={order._id || i} className="dn-order-row">
                      <div className="dn-order-id">
                        <strong>#{(order._id || `ORD-${i + 1}`).slice(-6).toUpperCase()}</strong>
                        <span className="dn-order-date">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : "Just now"}
                        </span>
                      </div>
                      <div className="dn-order-items-mini">
                        {(order.items || order.orderItems || []).slice(0, 2).map((it, j) => (
                          <span key={j} className="dn-item-chip">
                            {it.productName || it.name || "Item"}
                          </span>
                        ))}
                      </div>
                      <span className="dn-order-status" style={{ background: s.bg, color: s.color }}>
                        {order.status || "Pending"}
                      </span>
                      <strong className="dn-order-amount">₹{order.totalAmount || order.amount || 0}</strong>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "profile" && (
          <div className="dn-dash-section">
            <h2 className="dn-section-title">Your profile</h2>

            <div className="dn-profile-photo-row">
              <div className="dn-profile-photo-wrap">
                <Avatar size={96} />
                <button
                  type="button"
                  className="dn-photo-edit"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? "…" : "Change photo"}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  hidden
                  onChange={handleAvatarPick}
                />
              </div>
              <p className="dn-photo-hint">JPG, PNG, or WEBP. Max 2MB. This photo also appears in the top menu.</p>
            </div>

            <form className="dn-profile-form" onSubmit={handleSaveProfile}>
              <label className="dn-field">
                Full name
                <input
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  placeholder="Your name"
                  autoComplete="name"
                />
              </label>
              <label className="dn-field">
                Email
                <input value={user.email || user.userId || ""} disabled />
              </label>
              <label className="dn-field">
                Phone
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleFormChange}
                  placeholder="10-digit mobile number"
                  inputMode="numeric"
                  maxLength={10}
                  autoComplete="tel"
                />
              </label>
              <label className="dn-field dn-field-full">
                Delivery address
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleFormChange}
                  placeholder="House / street"
                  rows={3}
                />
              </label>
              <label className="dn-field">
                City
                <input name="city" value={form.city} onChange={handleFormChange} placeholder="City" />
              </label>
              <label className="dn-field">
                Pincode
                <input
                  name="pincode"
                  value={form.pincode}
                  onChange={handleFormChange}
                  placeholder="Pincode"
                  inputMode="numeric"
                  maxLength={6}
                />
              </label>

              {profileErr && <p className="dn-form-alert error">{profileErr}</p>}
              {profileMsg && <p className="dn-form-alert ok">{profileMsg}</p>}

              <div className="dn-form-actions">
                <button type="submit" className="dn-save-btn" disabled={saving}>
                  {saving ? "Saving…" : "Save changes"}
                </button>
                <button type="button" className="dn-danger-btn" onClick={handleLogout}>
                  Sign out
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');

        .dn-dashboard {
          min-height: 100vh;
          padding: 100px clamp(12px, 4vw, 48px) 64px;
          background: #f0f6ff;
          font-family: 'Outfit', sans-serif;
        }

        .dn-dash-container {
          max-width: 960px;
          margin: 0 auto;
        }

        .dn-dash-header {
          display: flex;
          align-items: center;
          gap: 16px;
          background: #fff;
          border-radius: 20px;
          padding: 20px 22px;
          margin-bottom: 18px;
          box-shadow: 0 4px 24px rgba(11,87,164,0.08);
          border: 1px solid rgba(11,87,164,0.08);
        }

        .dn-dash-avatar-btn {
          border: none;
          background: none;
          padding: 0;
          cursor: pointer;
          flex-shrink: 0;
        }

        .dn-avatar-face {
          border-radius: 50%;
          background: linear-gradient(135deg, #0b57a4 0%, #1e40af 100%);
          color: #fff;
          font-weight: 900;
          display: grid;
          place-items: center;
          overflow: hidden;
          box-shadow: 0 6px 20px rgba(11,87,164,0.28);
        }

        .dn-avatar-face img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .dn-dash-intro { min-width: 0; flex: 1; }

        .dn-dash-welcome {
          font-size: clamp(18px, 4vw, 22px);
          font-weight: 900;
          color: #0f2b5b;
          margin: 0 0 4px;
          line-height: 1.2;
        }

        .dn-dash-email {
          font-size: 13px;
          color: #64748b;
          margin: 0 0 8px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .dn-dash-role-badge {
          display: inline-block;
          background: #dbeafe;
          color: #1e40af;
          font-size: 10px;
          font-weight: 800;
          padding: 3px 10px;
          border-radius: 999px;
          letter-spacing: 0.8px;
        }

        .dn-dash-logout-btn {
          margin-left: auto;
          background: rgba(239,68,68,0.1);
          color: #dc2626;
          border: 1px solid rgba(239,68,68,0.25);
          padding: 10px 18px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
          white-space: nowrap;
        }

        .dn-dash-stats {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 12px;
          margin-bottom: 18px;
        }

        .dn-stat-card {
          background: #fff;
          border-radius: 16px;
          padding: 16px;
          border: 1px solid rgba(11,87,164,0.08);
          box-shadow: 0 2px 12px rgba(11,87,164,0.05);
          text-align: left;
          font-family: inherit;
          cursor: default;
        }

        button.dn-stat-card { cursor: pointer; }

        .dn-stat-card.accent {
          background: linear-gradient(135deg, #0b57a4 0%, #1e40af 100%);
          border-color: transparent;
        }

        .dn-stat-card.accent .dn-stat-label,
        .dn-stat-card.accent .dn-stat-value { color: #fff !important; }

        .dn-stat-label {
          font-size: 11px;
          color: #64748b;
          font-weight: 600;
          margin: 0 0 6px;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }

        .dn-stat-value {
          font-size: clamp(18px, 3vw, 22px);
          font-weight: 900;
          color: #0f2b5b;
          display: block;
          line-height: 1;
        }

        .dn-dash-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
        }

        .dn-dash-tab {
          flex: 1;
          padding: 10px 12px;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          border: 1px solid rgba(11,87,164,0.15);
          background: #fff;
          color: #64748b;
          font-family: 'Outfit', sans-serif;
        }

        .dn-dash-tab.active {
          background: #0b57a4;
          color: #fff;
          border-color: #0b57a4;
        }

        .dn-dash-section {
          background: #fff;
          border-radius: 20px;
          padding: clamp(16px, 3vw, 28px);
          border: 1px solid rgba(11,87,164,0.08);
          box-shadow: 0 4px 24px rgba(11,87,164,0.06);
        }

        .dn-section-title {
          font-size: 17px;
          font-weight: 800;
          color: #0f2b5b;
          margin: 0 0 18px;
        }

        .dn-quick-actions {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .dn-qa-card {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 4px;
          background: #f0f6ff;
          border: 1px solid rgba(11,87,164,0.1);
          border-radius: 16px;
          padding: 16px;
          cursor: pointer;
          text-align: left;
          font-family: 'Outfit', sans-serif;
        }

        .dn-qa-card:hover {
          background: #0b57a4;
          border-color: #0b57a4;
        }

        .dn-qa-card:hover strong,
        .dn-qa-card:hover p { color: #fff !important; }

        .dn-qa-card strong { font-size: 14px; font-weight: 800; color: #0f2b5b; }
        .dn-qa-card p { font-size: 12px; color: #64748b; margin: 0; }

        .dn-orders-list { display: flex; flex-direction: column; gap: 10px; }

        .dn-order-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          border-radius: 12px;
          border: 1px solid rgba(11,87,164,0.09);
          background: #f8faff;
          flex-wrap: wrap;
        }

        .dn-order-id { display: flex; flex-direction: column; min-width: 92px; }
        .dn-order-id strong { font-size: 14px; color: #0f2b5b; font-weight: 800; }
        .dn-order-date { font-size: 11px; color: #94a3b8; }

        .dn-order-items-mini { display: flex; gap: 6px; flex-wrap: wrap; flex: 1; }

        .dn-item-chip {
          background: rgba(11,87,164,0.08);
          color: #0b57a4;
          font-size: 11px;
          font-weight: 600;
          padding: 3px 10px;
          border-radius: 999px;
        }

        .dn-order-status {
          font-size: 11px;
          font-weight: 800;
          padding: 4px 12px;
          border-radius: 999px;
          text-transform: capitalize;
        }

        .dn-order-amount {
          font-size: 16px;
          font-weight: 900;
          color: #0b57a4;
          margin-left: auto;
        }

        .dn-profile-photo-row {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 22px;
          flex-wrap: wrap;
        }

        .dn-profile-photo-wrap { display: flex; flex-direction: column; align-items: center; gap: 10px; }

        .dn-photo-edit {
          background: #0b57a4;
          color: #fff;
          border: none;
          border-radius: 999px;
          padding: 8px 14px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
        }

        .dn-photo-edit:disabled { opacity: 0.7; cursor: default; }

        .dn-photo-hint { font-size: 13px; color: #64748b; margin: 0; max-width: 280px; }

        .dn-profile-form {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px 16px;
        }

        .dn-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 12px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }

        .dn-field-full { grid-column: 1 / -1; }

        .dn-field input,
        .dn-field textarea {
          border: 1px solid rgba(11,87,164,0.16);
          border-radius: 12px;
          padding: 12px 14px;
          font-size: 15px;
          font-weight: 600;
          color: #0f2b5b;
          font-family: 'Outfit', sans-serif;
          text-transform: none;
          letter-spacing: 0;
          width: 100%;
          background: #f8faff;
        }

        .dn-field input:disabled {
          color: #64748b;
          background: #eef2f7;
        }

        .dn-field textarea { resize: vertical; min-height: 84px; }

        .dn-form-alert {
          grid-column: 1 / -1;
          margin: 0;
          font-size: 13px;
          font-weight: 600;
          text-transform: none;
          letter-spacing: 0;
        }

        .dn-form-alert.ok { color: #047857; }
        .dn-form-alert.error { color: #dc2626; }

        .dn-form-actions {
          grid-column: 1 / -1;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 6px;
        }

        .dn-save-btn {
          background: #0b57a4;
          color: #fff;
          border: none;
          padding: 12px 22px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
        }

        .dn-danger-btn {
          background: rgba(239,68,68,0.09);
          color: #dc2626;
          border: 1px solid rgba(239,68,68,0.2);
          padding: 12px 22px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
        }

        .dn-loading-box, .dn-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding: 40px 16px;
          color: #64748b;
          text-align: center;
        }

        .dn-spinner {
          width: 36px;
          height: 36px;
          border: 3px solid rgba(11,87,164,0.15);
          border-top-color: #0b57a4;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .dn-empty-state h3 { font-size: 20px; font-weight: 800; color: #0f2b5b; margin: 0; }
        .dn-empty-state p { margin: 0; font-size: 14px; }

        .dn-shop-now-btn {
          background: #0b57a4;
          color: #fff;
          border: none;
          padding: 12px 28px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          margin-top: 8px;
          font-family: 'Outfit', sans-serif;
        }

        @media (max-width: 900px) {
          .dn-dash-stats { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        }

        @media (max-width: 640px) {
          .dn-dash-header { flex-wrap: wrap; padding: 16px; }
          .dn-dash-logout-btn { margin-left: 0; width: 100%; }
          .dn-dash-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .dn-profile-form { grid-template-columns: 1fr; }
          .dn-order-row { flex-direction: column; align-items: flex-start; }
          .dn-order-amount { margin-left: 0; }
          .dn-form-actions { flex-direction: column; }
          .dn-save-btn, .dn-danger-btn { width: 100%; }
        }

        @media (max-width: 420px) {
          .dn-dash-stats { grid-template-columns: 1fr 1fr; }
          .dn-quick-actions { grid-template-columns: 1fr; }
          .dn-dash-tab { font-size: 13px; padding: 9px 8px; }
        }
      `}</style>
    </main>
  );
};

export default UserDashboard;
