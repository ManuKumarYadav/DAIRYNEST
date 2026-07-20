import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FaBoxOpen,
  FaCheckCircle,
  FaClock,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaReceipt,
  FaShoppingBag,
  FaStore,
  FaTimesCircle,
  FaTruck,
  FaUser,
} from "react-icons/fa";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);

      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/orders`);
      const data = await res.json();

      setOrders(data?.data || []);
    } catch (err) {
      console.log(err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      fetchOrders();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const counts = useMemo(
    () => ({
      total: orders.length,
      pending: orders.filter((order) => order.status === "Pending").length,
      paid: orders.filter((order) => order.status === "Paid").length,
      delivered: orders.filter((order) => order.status === "Delivered").length,
      cancelled: orders.filter((order) => order.status === "Cancelled").length,
    }),
    [orders]
  );

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div>
          <span style={styles.eyebrow}>
            <FaReceipt />
            Admin Orders
          </span>
          <h1 style={styles.heading}>DairyNest Orders Dashboard</h1>
          <p style={styles.subHeading}>
            Track shop orders, payment progress, delivery readiness, and
            customer addresses in one polished operations view.
          </p>
        </div>
      </section>

      <section style={styles.metricsGrid}>
        <Metric label="Total Orders" value={counts.total} icon={<FaShoppingBag />} />
        <Metric label="Pending" value={counts.pending} icon={<FaClock />} />
        <Metric label="Paid" value={counts.paid} icon={<FaReceipt />} />
        <Metric label="Delivered" value={counts.delivered} icon={<FaTruck />} />
        <Metric label="Cancelled" value={counts.cancelled} icon={<FaTimesCircle />} tone="danger" />
      </section>

      {loading ? (
        <div style={styles.stateCard}>
          <div style={styles.loader}></div>
          <h2 style={styles.stateTitle}>Loading Orders</h2>
          <p style={styles.stateText}>Fetching the latest DairyNest order activity.</p>
        </div>
      ) : orders.length === 0 ? (
        <div style={styles.stateCard}>
          <FaBoxOpen style={styles.emptyIcon} />
          <h2 style={styles.stateTitle}>No Orders Found</h2>
          <p style={styles.stateText}>Orders will appear here once customers place them.</p>
        </div>
      ) : (
        <section style={styles.grid}>
          {orders.map((order) => (
            <article
              key={order._id}
              style={{
                ...styles.card,
                ...(order.status === "Cancelled" ? styles.cancelledCard : {}),
              }}
            >
              <div
                style={{
                  ...styles.cardAccent,
                  ...(order.status === "Cancelled" ? styles.cancelledAccent : {}),
                }}
              ></div>
              <div style={styles.cardTop}>
                <div>
                  <span style={styles.orderId}>#{order._id?.slice(-6) || "ORDER"}</span>
                  <h2 style={styles.productName}>{order.productName || "Dairy Product"}</h2>
                  <p style={styles.shopName}>
                    <FaStore />
                    {order.shopName || "DairyNest Shop"}
                  </p>
                </div>

                <span style={{ ...styles.statusBadge, ...getStatusStyle(order.status) }}>
                {getStatusIcon(order.status)}
                  {order.status || "Pending"}
                </span>
              </div>

              <div style={styles.ticketSummary}>
                <span style={styles.productAvatar}>
                  <FaBoxOpen />
                </span>
                <div style={styles.ticketCopy}>
                  <strong style={styles.ticketTitle}>{order.productName || "Dairy Product"}</strong>
                  <span style={styles.ticketText}>Fresh dairy order prepared for route dispatch</span>
                </div>
              </div>

              <div style={styles.infoGrid}>
                <InfoCard label="Quantity" value={order.quantity || 1} />
                <InfoCard label="Dispatch Window" value="Morning" />
              </div>

              {order.status === "Cancelled" ? (
                <div style={styles.cancelledTimeline}>
                  <FaTimesCircle />
                  Cancelled product count: 1
                </div>
              ) : (
                <div style={styles.timeline}>
                  {["Pending", "Paid", "Delivered"].map((step) => (
                    <span
                      key={step}
                      style={{
                        ...styles.timelineStep,
                        ...(isStepReached(order.status, step) ? styles.timelineStepActive : {}),
                      }}
                    >
                      {step}
                    </span>
                  ))}
                </div>
              )}

              {order.address && (
                <div style={styles.addressCard}>
                  <h3 style={styles.addressHeading}>Delivery Details</h3>
                  <p style={styles.addressRow}>
                    <FaUser />
                    {order.address.name}
                  </p>
                  <p style={styles.addressRow}>
                    <FaMapMarkerAlt />
                    {order.address.street}, {order.address.city} - {order.address.pincode}
                  </p>
                  <p style={styles.addressRow}>
                    <FaPhoneAlt />
                    {order.address.phone}
                  </p>
                </div>
              )}

              <div style={styles.buttonRow}>
                {order.status === "Pending" && (
                  <button style={styles.payBtn} onClick={() => updateStatus(order._id, "Paid")}>
                    Mark Paid
                  </button>
                )}

                {order.status === "Paid" && (
                  <button style={styles.deliverBtn} onClick={() => updateStatus(order._id, "Delivered")}>
                    Mark Delivered
                  </button>
                )}

                {order.status !== "Cancelled" && order.status !== "Delivered" && (
                  <button style={styles.cancelBtn} onClick={() => updateStatus(order._id, "Cancelled")}>
                    Cancel Order
                  </button>
                )}
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
};

const Metric = ({ label, value, icon, tone }) => (
  <article style={{ ...styles.metricCard, ...(tone === "danger" ? styles.dangerMetricCard : {}) }}>
    <span style={{ ...styles.metricIcon, ...(tone === "danger" ? styles.dangerMetricIcon : {}) }}>{icon}</span>
    <div>
      <strong style={styles.metricValue}>{value}</strong>
      <p style={styles.metricLabel}>{label}</p>
    </div>
  </article>
);

const InfoCard = ({ label, value }) => (
  <div style={styles.infoCard}>
    <p style={styles.infoLabel}>{label}</p>
    <strong style={styles.infoValue}>{value}</strong>
  </div>
);

const getStatusIcon = (status) => {
  if (status === "Delivered") return <FaCheckCircle />;
  if (status === "Cancelled") return <FaTimesCircle />;
  if (status === "Paid") return <FaReceipt />;
  return <FaClock />;
};

const getStatusStyle = (status) => {
  switch (status) {
    case "Pending":
      return { color: "#92400e", background: "#fef3c7" };
    case "Paid":
      return { color: "#0b57a4", background: "#dbeafe" };
    case "Delivered":
      return { color: "#166534", background: "#dcfce7" };
    case "Cancelled":
      return { color: "#991b1b", background: "#fee2e2" };
    default:
      return { color: "#475569", background: "#e2e8f0" };
  }
};

const isStepReached = (status, step) => {
  const order = { Pending: 1, Paid: 2, Delivered: 3, Cancelled: 0 };
  return (order[status] || 1) >= order[step];
};

export default AdminOrders;

const styles = {
  page: {
    minHeight: "100vh",
    padding: "122px clamp(16px, 4vw, 42px) 46px",
    color: "#10233f",
    background:
      "radial-gradient(circle at 82% 12%, rgba(255,212,59,0.28), transparent 22rem), radial-gradient(circle at 12% 22%, rgba(8,120,184,0.18), transparent 24rem), linear-gradient(90deg, rgba(23,82,170,0.06) 1px, transparent 1px), linear-gradient(rgba(23,82,170,0.06) 1px, transparent 1px), linear-gradient(135deg,#ffffff 0%,#e8f6ff 45%,#fff7d9 100%)",
    backgroundSize: "auto, auto, 46px 46px, 46px 46px, auto",
  },
  hero: {
    maxWidth: 1220,
    margin: "0 auto 24px",
    padding: 30,
    border: "1px solid rgba(11,87,164,0.14)",
    borderRadius: 8,
    background:
      "linear-gradient(135deg, rgba(255,255,255,0.94), rgba(240,247,255,0.9))",
    boxShadow: "0 30px 90px rgba(6,35,83,0.13)",
  },
  eyebrow: {
    display: "inline-flex",
    alignItems: "center",
    gap: 9,
    minHeight: 38,
    padding: "8px 14px",
    borderRadius: 999,
    color: "#0b57a4",
    background: "#fff2a8",
    fontSize: 13,
    fontWeight: 900,
  },
  heading: {
    marginTop: 16,
    color: "#0b3f8a",
    fontSize: "clamp(34px, 5vw, 58px)",
    lineHeight: 1.04,
    fontWeight: 900,
  },
  subHeading: {
    maxWidth: 760,
    marginTop: 14,
    color: "#53667f",
    fontSize: 17,
    lineHeight: 1.65,
  },
  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
    gap: 14,
    maxWidth: 1220,
    margin: "0 auto 24px",
  },
  metricCard: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    minHeight: 118,
    padding: 20,
    border: "1px solid rgba(11,87,164,0.12)",
    borderRadius: 8,
    background: "rgba(255,255,255,0.9)",
    boxShadow: "0 24px 60px rgba(6,35,83,0.1)",
  },
  dangerMetricCard: {
    border: "1px solid rgba(220,38,38,0.14)",
    background: "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(254,242,242,0.92))",
  },
  metricIcon: {
    display: "grid",
    width: 48,
    height: 48,
    placeItems: "center",
    borderRadius: 8,
    color: "#fff",
    background: "#0b57a4",
  },
  dangerMetricIcon: {
    background: "#dc2626",
  },
  metricValue: {
    display: "block",
    color: "#0b3f8a",
    fontSize: 30,
    lineHeight: 1,
    fontWeight: 900,
  },
  metricLabel: {
    marginTop: 7,
    color: "#53667f",
    fontSize: 13,
    fontWeight: 800,
  },
  stateCard: {
    display: "grid",
    placeItems: "center",
    maxWidth: 1220,
    minHeight: 360,
    margin: "0 auto",
    padding: 28,
    border: "1px solid rgba(11,87,164,0.12)",
    borderRadius: 8,
    background: "rgba(255,255,255,0.9)",
    textAlign: "center",
    boxShadow: "0 24px 60px rgba(6,35,83,0.1)",
  },
  loader: {
    width: 58,
    height: 58,
    border: "6px solid #dbeafe",
    borderTop: "6px solid #0b57a4",
    borderRadius: "50%",
  },
  emptyIcon: {
    width: 54,
    height: 54,
    color: "#0b57a4",
  },
  stateTitle: {
    marginTop: 18,
    color: "#10233f",
    fontSize: 28,
    fontWeight: 900,
  },
  stateText: {
    marginTop: 8,
    color: "#53667f",
    fontSize: 15,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))",
    gap: 16,
    maxWidth: 1220,
    margin: "0 auto",
  },
  card: {
    position: "relative",
    overflow: "hidden",
    padding: 22,
    border: "1px solid rgba(11,87,164,0.12)",
    borderRadius: 8,
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,255,255,0.9))",
    boxShadow: "0 26px 70px rgba(6,35,83,0.12)",
  },
  cancelledCard: {
    border: "1px solid rgba(220,38,38,0.18)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(254,242,242,0.92))",
  },
  cardAccent: {
    position: "absolute",
    inset: "0 0 auto",
    height: 5,
    background: "linear-gradient(90deg,#0b57a4,#0878b8,#ffd43b)",
  },
  cancelledAccent: {
    background: "linear-gradient(90deg,#991b1b,#dc2626,#fecaca)",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
    flexWrap: "wrap",
    paddingTop: 8,
  },
  orderId: {
    display: "inline-flex",
    minHeight: 28,
    alignItems: "center",
    padding: "0 10px",
    borderRadius: 999,
    color: "#0b57a4",
    background: "#eef5ff",
    fontSize: 12,
    fontWeight: 900,
  },
  productName: {
    marginTop: 12,
    color: "#10233f",
    fontSize: 24,
    lineHeight: 1.15,
    fontWeight: 900,
    wordBreak: "break-word",
  },
  shopName: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
    color: "#53667f",
    fontSize: 14,
    fontWeight: 800,
  },
  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    minHeight: 38,
    padding: "0 13px",
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 900,
  },
  ticketSummary: {
    display: "grid",
    gridTemplateColumns: "54px minmax(0, 1fr)",
    gap: 14,
    alignItems: "center",
    marginTop: 18,
    padding: 14,
    borderRadius: 8,
    background: "linear-gradient(135deg,#eef5ff,#ffffff)",
    border: "1px solid rgba(11,87,164,0.1)",
  },
  productAvatar: {
    display: "grid",
    width: 54,
    height: 54,
    placeItems: "center",
    borderRadius: 8,
    color: "#fff",
    background: "linear-gradient(135deg,#0b57a4,#0878b8)",
    fontSize: 20,
  },
  ticketCopy: {
    minWidth: 0,
  },
  ticketTitle: {
    display: "block",
    color: "#10233f",
    fontSize: 17,
    fontWeight: 900,
    lineHeight: 1.2,
    wordBreak: "break-word",
  },
  ticketText: {
    display: "block",
    marginTop: 5,
    color: "#53667f",
    fontSize: 13,
    fontWeight: 800,
    lineHeight: 1.35,
  },
  timeline: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 8,
    marginTop: 14,
  },
  timelineStep: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 34,
    borderRadius: 8,
    color: "#8797ab",
    background: "#f1f5f9",
    fontSize: 12,
    fontWeight: 900,
  },
  timelineStepActive: {
    color: "#0b3f8a",
    background: "#fff2a8",
  },
  cancelledTimeline: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
    minHeight: 42,
    marginTop: 14,
    borderRadius: 8,
    color: "#991b1b",
    background: "#fee2e2",
    fontSize: 13,
    fontWeight: 900,
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 12,
    marginTop: 18,
  },
  infoCard: {
    minHeight: 92,
    padding: 16,
    borderRadius: 8,
    background: "#f0f7ff",
  },
  infoLabel: {
    color: "#53667f",
    fontSize: 12,
    fontWeight: 900,
  },
  infoValue: {
    display: "block",
    marginTop: 8,
    color: "#0b3f8a",
    fontSize: 24,
    lineHeight: 1,
    fontWeight: 900,
  },
  addressCard: {
    marginTop: 16,
    padding: 16,
    border: "1px solid rgba(11,87,164,0.12)",
    borderRadius: 8,
    background: "#fff",
  },
  addressHeading: {
    color: "#10233f",
    fontSize: 17,
    fontWeight: 900,
    marginBottom: 12,
  },
  addressRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    marginTop: 9,
    color: "#53667f",
    fontSize: 14,
    lineHeight: 1.5,
    fontWeight: 700,
    wordBreak: "break-word",
  },
  buttonRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 18,
  },
  payBtn: {
    flex: "1 1 140px",
    minHeight: 46,
    border: 0,
    borderRadius: 8,
    color: "#92400e",
    background: "#ffd43b",
    fontSize: 14,
    fontWeight: 900,
    cursor: "pointer",
  },
  deliverBtn: {
    flex: "1 1 140px",
    minHeight: 46,
    border: 0,
    borderRadius: 8,
    color: "#fff",
    background: "linear-gradient(135deg,#0b57a4,#0878b8)",
    fontSize: 14,
    fontWeight: 900,
    cursor: "pointer",
  },
  cancelBtn: {
    flex: "1 1 140px",
    minHeight: 46,
    border: 0,
    borderRadius: 8,
    color: "#fff",
    background: "#dc2626",
    fontSize: 14,
    fontWeight: 900,
    cursor: "pointer",
  },
};
