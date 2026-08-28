import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBoxOpen,
  FaCheckCircle,
  FaClock,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaReceipt,
  FaShoppingBag,
  FaTimesCircle,
  FaTruck,
  FaUser,
  FaArrowLeft,
  FaSearch,
  FaSync,
} from "react-icons/fa";
import { API_BASE_URL } from "../../api/config";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState(null);
  const navigate = useNavigate();

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/orders`);
      const data = await res.json();
      setOrders(data?.data || []);
    } catch (err) {
      console.error("Fetch admin orders error:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStatus = async (id, status) => {
    try {
      setUpdating(id);
      await fetch(`${API_BASE_URL}/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      await fetchOrders();
    } catch (err) {
      console.log(err);
    } finally {
      setUpdating(null);
    }
  };

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const counts = useMemo(() => ({
    total: orders.length,
    pending: orders.filter((o) => o.status === "Pending").length,
    paid: orders.filter((o) => o.status === "Paid").length,
    delivered: orders.filter((o) => o.status === "Delivered").length,
    cancelled: orders.filter((o) => o.status === "Cancelled").length,
    revenue: orders.filter((o) => o.status !== "Cancelled").reduce((s, o) => s + (o.totalAmount || 0), 0),
  }), [orders]);

  const filtered = useMemo(() => {
    let list = [...orders];
    if (filter !== "All") list = list.filter((o) => o.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((o) =>
        o._id?.toLowerCase().includes(q) ||
        o.productName?.toLowerCase().includes(q) ||
        o.shopName?.toLowerCase().includes(q) ||
        o.address?.name?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [orders, filter, search]);

  const statusTabs = ["All", "Pending", "Paid", "Delivered", "Cancelled"];

  return (
    <div className="dn-orders-root">
      {/* HEADER */}
      <div className="dn-orders-topbar">
        <div className="dn-orders-topbar-left">
          <button className="dn-orders-back-btn" onClick={() => navigate("/admin")}>
            <FaArrowLeft /> Dashboard
          </button>
          <div>
            <h1 className="dn-orders-heading">Orders Dashboard</h1>
            <p className="dn-orders-subheading">{orders.length} total orders across all channels</p>
          </div>
        </div>
        <div className="dn-orders-topbar-right">
          <button className="dn-orders-refresh-btn" onClick={fetchOrders} disabled={loading}>
            <FaSync className={loading ? "spinning" : ""} /> Refresh
          </button>
        </div>
      </div>

      {/* METRICS */}
      <div className="dn-orders-metrics">
        <div className="dn-ord-metric" style={{background:"linear-gradient(135deg,#0b57a4,#0878b8)"}}>
          <div className="dn-ord-metric-icon"><FaShoppingBag /></div>
          <div className="dn-ord-metric-body">
            <span className="dn-ord-metric-val">{counts.total}</span>
            <span className="dn-ord-metric-lbl">Total Orders</span>
          </div>
          <FaShoppingBag className="dn-ord-metric-bg" />
        </div>
        <div className="dn-ord-metric" style={{background:"linear-gradient(135deg,#d97706,#b45309)"}}>
          <div className="dn-ord-metric-icon"><FaClock /></div>
          <div className="dn-ord-metric-body">
            <span className="dn-ord-metric-val">{counts.pending}</span>
            <span className="dn-ord-metric-lbl">Pending</span>
          </div>
          <FaClock className="dn-ord-metric-bg" />
        </div>
        <div className="dn-ord-metric" style={{background:"linear-gradient(135deg,#7c3aed,#6d28d9)"}}>
          <div className="dn-ord-metric-icon"><FaReceipt /></div>
          <div className="dn-ord-metric-body">
            <span className="dn-ord-metric-val">{counts.paid}</span>
            <span className="dn-ord-metric-lbl">Paid</span>
          </div>
          <FaReceipt className="dn-ord-metric-bg" />
        </div>
        <div className="dn-ord-metric" style={{background:"linear-gradient(135deg,#16a34a,#15803d)"}}>
          <div className="dn-ord-metric-icon"><FaTruck /></div>
          <div className="dn-ord-metric-body">
            <span className="dn-ord-metric-val">{counts.delivered}</span>
            <span className="dn-ord-metric-lbl">Delivered</span>
          </div>
          <FaTruck className="dn-ord-metric-bg" />
        </div>
        <div className="dn-ord-metric" style={{background:"linear-gradient(135deg,#dc2626,#b91c1c)"}}>
          <div className="dn-ord-metric-icon"><FaTimesCircle /></div>
          <div className="dn-ord-metric-body">
            <span className="dn-ord-metric-val">{counts.cancelled}</span>
            <span className="dn-ord-metric-lbl">Cancelled</span>
          </div>
          <FaTimesCircle className="dn-ord-metric-bg" />
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="dn-orders-toolbar">
        <div className="dn-status-tabs">
          {statusTabs.map((tab) => (
            <button
              key={tab}
              className={`dn-status-tab ${filter === tab ? "active" : ""}`}
              onClick={() => setFilter(tab)}
            >
              {tab}
              <span className="dn-tab-count">
                {tab === "All" ? orders.length :
                  tab === "Pending" ? counts.pending :
                  tab === "Paid" ? counts.paid :
                  tab === "Delivered" ? counts.delivered : counts.cancelled}
              </span>
            </button>
          ))}
        </div>
        <div className="dn-orders-search-wrap">
          <FaSearch className="dn-search-icon" />
          <input
            className="dn-orders-search"
            placeholder="Search orders, customers, products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ORDERS LIST */}
      {loading ? (
        <div className="dn-orders-state">
          <div className="dn-orders-spinner" />
          <h3>Loading Orders</h3>
          <p>Fetching latest DairyNest order activity...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="dn-orders-state">
          <FaBoxOpen className="dn-orders-state-icon" />
          <h3>No Orders Found</h3>
          <p>{search ? "Try adjusting your search query" : "Orders will appear here once customers place them."}</p>
        </div>
      ) : (
        <div className="dn-orders-grid">
          {filtered.map((order) => (
            <div
              key={order._id}
              className={`dn-order-card ${order.status === "Cancelled" ? "cancelled" : order.status === "Delivered" ? "delivered" : ""}`}
            >
              {/* Card top accent */}
              <div className={`dn-order-accent ${order.status === "Cancelled" ? "red" : order.status === "Delivered" ? "green" : order.status === "Paid" ? "purple" : "blue"}`} />

              {/* Header row */}
              <div className="dn-order-header">
                <div className="dn-order-header-left">
                  <span className="dn-order-id">#{order._id?.slice(-8).toUpperCase()}</span>
                  <div className="dn-order-product-name">{order.productName || "Dairy Product"}</div>
                  <div className="dn-order-shop"><FaBoxOpen /> {order.shopName || "DairyNest Shop"}</div>
                </div>
                <span className={`dn-order-status-badge ${(order.status || "Pending").toLowerCase()}`}>
                  {order.status === "Delivered" && <FaCheckCircle />}
                  {order.status === "Cancelled" && <FaTimesCircle />}
                  {order.status === "Paid" && <FaReceipt />}
                  {(order.status === "Pending" || !order.status) && <FaClock />}
                  {order.status || "Pending"}
                </span>
              </div>

              {/* Order info chips */}
              <div className="dn-order-info-chips">
                <div className="dn-info-chip">
                  <span className="chip-label">Qty</span>
                  <span className="chip-val">{order.quantity || 1}</span>
                </div>
                <div className="dn-info-chip">
                  <span className="chip-label">Amount</span>
                  <span className="chip-val">₹{order.totalAmount || order.amount || "—"}</span>
                </div>
                <div className="dn-info-chip">
                  <span className="chip-label">Slot</span>
                  <span className="chip-val">Morning</span>
                </div>
                <div className="dn-info-chip">
                  <span className="chip-label">Date</span>
                  <span className="chip-val">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN", {day:"2-digit",month:"short"}) : "—"}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              {order.status !== "Cancelled" ? (
                <div className="dn-order-progress">
                  {["Pending", "Paid", "Delivered"].map((step, idx) => {
                    const stepOrder = { Pending: 1, Paid: 2, Delivered: 3 };
                    const cur = stepOrder[order.status] || 1;
                    const isActive = stepOrder[step] <= cur;
                    return (
                      <React.Fragment key={step}>
                        <div className={`dn-progress-step ${isActive ? "active" : ""}`}>
                          <div className="dn-progress-dot">{isActive ? "✓" : idx + 1}</div>
                          <span>{step}</span>
                        </div>
                        {idx < 2 && <div className={`dn-progress-line ${stepOrder[step] < cur ? "active" : ""}`} />}
                      </React.Fragment>
                    );
                  })}
                </div>
              ) : (
                <div className="dn-order-cancelled-tag">
                  <FaTimesCircle /> Order Cancelled
                </div>
              )}

              {/* Delivery address */}
              {order.address && (
                <div className="dn-order-address">
                  <div className="dn-address-label">📦 Delivery Details</div>
                  <div className="dn-address-row"><FaUser /> <span>{order.address.name}</span></div>
                  <div className="dn-address-row">
                    <FaMapMarkerAlt />
                    <span>
                      {[order.address.street, order.address.city, order.address.pincode]
                        .filter(Boolean).join(", ")}
                    </span>
                  </div>
                  {order.address.phone && (
                    <div className="dn-address-row"><FaPhoneAlt /> <span>{order.address.phone}</span></div>
                  )}
                </div>
              )}

              {/* Action buttons */}
              <div className="dn-order-actions">
                {order.status === "Pending" && (
                  <button
                    className="dn-action-btn yellow"
                    onClick={() => updateStatus(order._id, "Paid")}
                    disabled={updating === order._id}
                  >
                    {updating === order._id ? <span className="btn-spinner" /> : <FaReceipt />}
                    Mark as Paid
                  </button>
                )}
                {order.status === "Paid" && (
                  <button
                    className="dn-action-btn green"
                    onClick={() => updateStatus(order._id, "Delivered")}
                    disabled={updating === order._id}
                  >
                    {updating === order._id ? <span className="btn-spinner" /> : <FaTruck />}
                    Mark Delivered
                  </button>
                )}
                {order.status !== "Cancelled" && order.status !== "Delivered" && (
                  <button
                    className="dn-action-btn red"
                    onClick={() => updateStatus(order._id, "Cancelled")}
                    disabled={updating === order._id}
                  >
                    <FaTimesCircle /> Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');

        .dn-orders-root {
          min-height: 100vh;
          background: #0d1117;
          font-family: 'Outfit', sans-serif;
          color: #e2e8f0;
          padding: 90px 32px 48px;
        }

        /* TOPBAR */
        .dn-orders-topbar {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 28px;
        }

        .dn-orders-topbar-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .dn-orders-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 16px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.06);
          color: #94a3b8;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .dn-orders-back-btn:hover {
          background: rgba(255,255,255,0.12);
          color: #f1f5f9;
        }

        .dn-orders-heading {
          font-size: clamp(24px, 3.5vw, 38px);
          font-weight: 900;
          color: #f1f5f9;
          margin: 0 0 3px 0;
          background: linear-gradient(90deg, #f1f5f9, #93c5fd);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .dn-orders-subheading {
          font-size: 13.5px;
          color: #64748b;
          font-weight: 600;
          margin: 0;
        }

        .dn-orders-topbar-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .dn-orders-refresh-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 10px 18px;
          border-radius: 10px;
          border: 1px solid rgba(96,165,250,0.25);
          background: rgba(11,87,164,0.15);
          color: #60a5fa;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
        }

        .dn-orders-refresh-btn:hover {
          background: rgba(11,87,164,0.3);
        }

        .dn-orders-refresh-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spinning {
          animation: spin 1s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        /* METRICS */
        .dn-orders-metrics {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 14px;
          margin-bottom: 28px;
        }

        .dn-ord-metric {
          border-radius: 14px;
          padding: 18px 16px;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 6px 24px rgba(0,0,0,0.2);
          transition: transform 0.2s;
        }

        .dn-ord-metric:hover { transform: translateY(-2px); }

        .dn-ord-metric-icon {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          background: rgba(255,255,255,0.2);
          display: grid;
          place-items: center;
          font-size: 17px;
          color: #fff;
          flex-shrink: 0;
        }

        .dn-ord-metric-body { flex: 1; min-width: 0; }

        .dn-ord-metric-val {
          display: block;
          font-size: 22px;
          font-weight: 900;
          color: #fff;
          line-height: 1;
        }

        .dn-ord-metric-lbl {
          display: block;
          font-size: 11.5px;
          color: rgba(255,255,255,0.75);
          font-weight: 700;
          margin-top: 4px;
        }

        .dn-ord-metric-bg {
          position: absolute;
          right: -6px;
          bottom: -8px;
          font-size: 54px;
          color: rgba(255,255,255,0.1);
        }

        /* FILTER TOOLBAR */
        .dn-orders-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 20px;
          padding: 16px 20px;
          background: #111827;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.07);
        }

        .dn-status-tabs {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .dn-status-tab {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.08);
          background: transparent;
          color: #64748b;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.18s;
        }

        .dn-status-tab:hover {
          background: rgba(255,255,255,0.06);
          color: #94a3b8;
        }

        .dn-status-tab.active {
          background: rgba(11,87,164,0.25);
          color: #60a5fa;
          border-color: rgba(96,165,250,0.3);
        }

        .dn-tab-count {
          background: rgba(255,255,255,0.08);
          border-radius: 999px;
          padding: 1px 7px;
          font-size: 11px;
          font-weight: 800;
        }

        .dn-status-tab.active .dn-tab-count {
          background: rgba(96,165,250,0.2);
        }

        .dn-orders-search-wrap {
          position: relative;
          flex: 1;
          min-width: 220px;
          max-width: 360px;
        }

        .dn-search-icon {
          position: absolute;
          left: 13px;
          top: 50%;
          transform: translateY(-50%);
          color: #475569;
          font-size: 13px;
        }

        .dn-orders-search {
          width: 100%;
          height: 40px;
          padding: 0 14px 0 38px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05);
          color: #f1f5f9;
          font-size: 13px;
          font-weight: 600;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s;
        }

        .dn-orders-search:focus {
          border-color: rgba(96,165,250,0.4);
          background: rgba(255,255,255,0.08);
        }

        .dn-orders-search::placeholder { color: #475569; }

        /* STATE DISPLAY */
        .dn-orders-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 340px;
          gap: 12px;
          text-align: center;
          color: #475569;
          padding: 40px;
          background: #111827;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.06);
        }

        .dn-orders-state h3 {
          font-size: 22px;
          font-weight: 800;
          color: #94a3b8;
          margin: 0;
        }

        .dn-orders-state p {
          font-size: 14px;
          color: #475569;
          margin: 0;
        }

        .dn-orders-spinner {
          width: 48px;
          height: 48px;
          border: 4px solid rgba(96,165,250,0.2);
          border-top-color: #60a5fa;
          border-radius: 50%;
          animation: spin 0.85s linear infinite;
        }

        .dn-orders-state-icon {
          font-size: 42px;
          color: #334155;
        }

        /* ORDER CARDS GRID */
        .dn-orders-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 18px;
        }

        .dn-order-card {
          background: #111827;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          overflow: hidden;
          position: relative;
          transition: all 0.2s;
        }

        .dn-order-card:hover {
          border-color: rgba(255,255,255,0.15);
          box-shadow: 0 12px 32px rgba(0,0,0,0.3);
          transform: translateY(-2px);
        }

        .dn-order-card.cancelled {
          border-color: rgba(239,68,68,0.15);
          background: #130f0f;
        }

        .dn-order-card.delivered {
          border-color: rgba(22,163,74,0.15);
        }

        .dn-order-card > *:not(.dn-order-accent) {
          padding-left: 20px;
          padding-right: 20px;
        }

        /* TOP ACCENT BAR */
        .dn-order-accent {
          height: 4px;
          width: 100%;
        }

        .dn-order-accent.blue { background: linear-gradient(90deg,#0b57a4,#60a5fa,#ffd43b); }
        .dn-order-accent.green { background: linear-gradient(90deg,#16a34a,#4ade80,#ffd43b); }
        .dn-order-accent.red { background: linear-gradient(90deg,#dc2626,#f87171,#fecaca); }
        .dn-order-accent.purple { background: linear-gradient(90deg,#7c3aed,#c084fc,#ffd43b); }

        /* CARD HEADER */
        .dn-order-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          padding-top: 16px;
          padding-bottom: 12px;
        }

        .dn-order-id {
          display: inline-block;
          font-size: 10.5px;
          font-weight: 900;
          color: #60a5fa;
          background: rgba(96,165,250,0.1);
          border-radius: 6px;
          padding: 2px 8px;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
        }

        .dn-order-product-name {
          font-size: 15.5px;
          font-weight: 800;
          color: #f1f5f9;
          line-height: 1.25;
          margin-bottom: 4px;
        }

        .dn-order-shop {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #64748b;
          font-weight: 700;
        }

        /* STATUS BADGE */
        .dn-order-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 11px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 800;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .dn-order-status-badge.pending { background: rgba(217,119,6,0.15); color: #fbbf24; border: 1px solid rgba(251,191,36,0.25); }
        .dn-order-status-badge.paid { background: rgba(124,58,237,0.15); color: #c084fc; border: 1px solid rgba(192,132,252,0.25); }
        .dn-order-status-badge.delivered { background: rgba(22,163,74,0.15); color: #4ade80; border: 1px solid rgba(74,222,128,0.25); }
        .dn-order-status-badge.cancelled { background: rgba(239,68,68,0.12); color: #f87171; border: 1px solid rgba(248,113,113,0.2); }

        /* INFO CHIPS */
        .dn-order-info-chips {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          padding-bottom: 14px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          margin-bottom: 14px;
        }

        .dn-info-chip {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 8px;
          padding: 7px 12px;
          flex: 1;
          min-width: 60px;
          text-align: center;
        }

        .chip-label {
          display: block;
          font-size: 10px;
          font-weight: 800;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .chip-val {
          display: block;
          font-size: 13.5px;
          font-weight: 900;
          color: #e2e8f0;
          margin-top: 2px;
        }

        /* PROGRESS */
        .dn-order-progress {
          display: flex;
          align-items: center;
          margin-bottom: 14px;
        }

        .dn-progress-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          flex-shrink: 0;
        }

        .dn-progress-dot {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
          border: 2px solid rgba(255,255,255,0.12);
          color: #475569;
          font-size: 10px;
          font-weight: 900;
          display: grid;
          place-items: center;
          transition: all 0.2s;
        }

        .dn-progress-step.active .dn-progress-dot {
          background: linear-gradient(135deg,#0b57a4,#60a5fa);
          border-color: #60a5fa;
          color: #fff;
          box-shadow: 0 0 10px rgba(96,165,250,0.4);
        }

        .dn-progress-step span {
          font-size: 10px;
          font-weight: 700;
          color: #475569;
        }

        .dn-progress-step.active span { color: #93c5fd; }

        .dn-progress-line {
          flex: 1;
          height: 2px;
          background: rgba(255,255,255,0.08);
          margin: 0 4px;
          margin-bottom: 14px;
        }

        .dn-progress-line.active {
          background: linear-gradient(90deg,#0b57a4,#60a5fa);
        }

        .dn-order-cancelled-tag {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px;
          border-radius: 10px;
          background: rgba(239,68,68,0.1);
          color: #f87171;
          font-size: 13px;
          font-weight: 800;
          margin-bottom: 14px;
          border: 1px solid rgba(239,68,68,0.15);
        }

        /* ADDRESS */
        .dn-order-address {
          padding: 12px 14px;
          border-radius: 10px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          margin-bottom: 14px;
          margin-left: 20px;
          margin-right: 20px;
        }

        .dn-address-label {
          font-size: 11px;
          font-weight: 800;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        .dn-address-row {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 12.5px;
          color: #94a3b8;
          font-weight: 600;
          margin-bottom: 5px;
          line-height: 1.4;
        }

        .dn-address-row svg {
          color: #60a5fa;
          flex-shrink: 0;
          margin-top: 2px;
          font-size: 11px;
        }

        /* ACTION BUTTONS */
        .dn-order-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          padding-top: 14px;
          padding-bottom: 18px;
          border-top: 1px solid rgba(255,255,255,0.05);
          margin-top: 4px;
        }

        .dn-action-btn {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          min-height: 40px;
          border: none;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
          min-width: 100px;
        }

        .dn-action-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .dn-action-btn.yellow { background: linear-gradient(135deg,#ffd43b,#f59e0b); color: #0b3f8a; }
        .dn-action-btn.green { background: linear-gradient(135deg,#16a34a,#15803d); color: #fff; }
        .dn-action-btn.red { background: rgba(239,68,68,0.12); color: #f87171; border: 1px solid rgba(239,68,68,0.2); }
        .dn-action-btn.yellow:hover { filter: brightness(1.1); transform: translateY(-1px); }
        .dn-action-btn.green:hover { filter: brightness(1.1); transform: translateY(-1px); }
        .dn-action-btn.red:hover { background: #ef4444; color: #fff; border-color: #ef4444; }

        .btn-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: currentColor;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          display: inline-block;
        }

        /* RESPONSIVE */
        @media (max-width: 1100px) {
          .dn-orders-metrics { grid-template-columns: repeat(3, 1fr); }
        }

        @media (max-width: 768px) {
          .dn-orders-root { padding: 90px 16px 40px; }
          .dn-orders-metrics { grid-template-columns: repeat(2, 1fr); }
          .dn-orders-grid { grid-template-columns: 1fr; }
          .dn-orders-topbar-left { flex-wrap: wrap; gap: 10px; }
          .dn-orders-search-wrap { min-width: 160px; max-width: none; flex: 1; }
        }

        @media (max-width: 480px) {
          .dn-orders-metrics { grid-template-columns: 1fr 1fr; }
          .dn-orders-toolbar { flex-direction: column; align-items: stretch; }
          .dn-status-tabs { overflow-x: auto; flex-wrap: nowrap; }
        }
      `}</style>
    </div>
  );
};

export default AdminOrders;
