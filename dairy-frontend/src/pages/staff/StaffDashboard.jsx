import React, { useState, useEffect, useCallback } from "react";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

const fmt = (n) =>
  n === undefined || n === null ? "0" : Number(n).toLocaleString();
const fmtDate = (d) =>
  new Date(d).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

const StaffDashboard = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [tab, setTab] = useState("intake");
  const [farmers, setFarmers] = useState([]);
  const [products, setProducts] = useState([]);
  const [milkList, setMilkList] = useState([]);
  const [productionList, setProductionList] = useState([]);
  const [summary, setSummary] = useState({
    totalIn: 0,
    totalUsed: 0,
    balance: 0,
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [intakeForm, setIntakeForm] = useState({
    quantity: "",
    farmerId: "",
    farmerName: "",
    source: "",
    fatPercentage: "",
    vehicleNumber: "",
    notes: "",
  });
  const [usageForm, setUsageForm] = useState({
    quantity: "",
    purpose: "",
    notes: "",
  });
  const [prodForm, setProdForm] = useState({
    productId: "",
    quantity: "",
    milkUsed: "",
  });

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const hdr = {
    Authorization: "Bearer " + token,
    "Content-Type": "application/json",
  };

  const fetchAll = useCallback(async () => {
    try {
      const [fRes, pRes, mRes, prRes, sRes] = await Promise.all([
        fetch(`${API}/api/staff/farmers`, { headers: hdr }),
        fetch(`${API}/api/products`),
        fetch(`${API}/api/staff/milk`, { headers: hdr }),
        fetch(`${API}/api/staff/production`, { headers: hdr }),
        fetch(`${API}/api/staff/milk/summary`, { headers: hdr }),
      ]);
      setFarmers(await fRes.json().catch(() => []));
      const pd = await pRes.json().catch(() => []);
      setProducts(Array.isArray(pd) ? pd : pd.products || []);
      setMilkList(await mRes.json().catch(() => []));
      setProductionList(await prRes.json().catch(() => []));
      setSummary(
        await sRes
          .json()
          .catch(() => ({ totalIn: 0, totalUsed: 0, balance: 0 })),
      );
    } catch (e) {
      console.error(e);
    }
  }, []);
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const submitIntake = async (e) => {
    e.preventDefault();
    if (!intakeForm.quantity) return showToast("Enter quantity", "error");
    setLoading(true);
    try {
      const payload = { ...intakeForm };
      if (intakeForm.farmerId) {
        const f = farmers.find((x) => x._id === intakeForm.farmerId);
        payload.farmerName = f ? f.name : intakeForm.farmerName;
        payload.source = payload.source || f?.village || "";
      }
      const res = await fetch(`${API}/api/staff/milk`, {
        method: "POST",
        headers: hdr,
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) return showToast(data.msg || "Failed", "error");
      showToast(
        ` ✅ ${intakeForm.quantity}L milk recorded from ${payload.farmerName || "supplier"}`,
      );
      setIntakeForm({
        quantity: "",
        farmerId: "",
        farmerName: "",
        source: "",
        fatPercentage: "",
        vehicleNumber: "",
        notes: "",
      });
      fetchAll();
    } catch {
      showToast("Server error", "error");
    } finally {
      setLoading(false);
    }
  };
  const submitUsage = async (e) => {
    e.preventDefault();
    if (!usageForm.quantity || !usageForm.purpose)
      return showToast("Fill quantity & purpose", "error");
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/staff/milk/use`, {
        method: "POST",
        headers: hdr,
        body: JSON.stringify(usageForm),
      });
      const data = await res.json();
      if (!res.ok) return showToast(data.msg || "Failed", "error");
      showToast(`📦 ${usageForm.quantity}L used for ${usageForm.purpose}`);
      setUsageForm({ quantity: "", purpose: "", notes: "" });
      fetchAll();
    } catch {
      showToast("Server error", "error");
    } finally {
      setLoading(false);
    }
  };

  const submitProd = async (e) => {
    e.preventDefault();
    if (!prodForm.productId || !prodForm.quantity || !prodForm.milkUsed)
      return showToast("Fill all fields", "error");
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/staff/production`, {
        method: "POST",
        headers: hdr,
        body: JSON.stringify(prodForm),
      });
      const data = await res.json();
      if (!res.ok) return showToast(data.msg || "Failed", "error");
      const p = products.find((x) => x._id === prodForm.productId);
      showToast(
        `🏭 ${prodForm.quantity} units of ${p?.name || "product"} produced`,
      );
      setProdForm({ productId: "", quantity: "", milkUsed: "" });
      fetchAll();
    } catch {
      showToast("Server error", "error");
    } finally {
      setLoading(false);
    }
  };

  const milkIn = milkList.filter((m) => m.quantity > 0);
  const milkUsed = milkList.filter((m) => m.quantity < 0);

  return (
    <div style={s.page}>
      {toast && (
        <div
          style={{
            ...s.toast,
            background: toast.type === "error" ? "#ef4444" : "#16a34a",
          }}
        >
          {toast.msg}
        </div>
      )}

      <header style={s.header}>
        <div style={s.headerLeft}>
          <span style={s.badge}>🧑‍🏭 DairyNest Staff Panel</span>
          <h1 style={s.title}>Staff Operations Dashboard</h1>
          <p style={s.sub}>
            Milk intake · Stock usage · Production — all in one place
          </p>
        </div>
        <div style={s.userChip}>
          <span style={s.avatar}>{(user?.name || "S")[0].toUpperCase()}</span>
          <div>
            <strong style={{ display: "block", fontSize: 14 }}>
              {user?.name || "Staff"}
            </strong>
            <span style={{ fontSize: 12, color: "#64748b" }}>
              {user?.userId || "Staff"}
            </span>
          </div>
        </div>
      </header>
      <div style={s.summaryGrid}>
        <SummaryCard
          color="#0ea5e9"
          icon="🥛"
          label="Total Milk In (L)"
          value={fmt(summary.totalIn)}
        />
        <SummaryCard
          color="#f59e0b"
          icon="⚗️"
          label="Total Milk Used (L)"
          value={fmt(summary.totalUsed)}
        />
        <SummaryCard
          color={summary.balance < 50 ? "#ef4444" : "#22c55e"}
          icon="📊"
          label="Available Balance (L)"
          value={fmt(summary.balance)}
          alert={summary.balance < 50 ? "Low stock!" : null}
        />
        <SummaryCard
          color="#8b5cf6"
          icon="🏭"
          label="Productions Today"
          value={
            productionList.filter(
              (p) =>
                new Date(p.date).toDateString() === new Date().toDateString(),
            ).length
          }
        />
        <SummaryCard
          color="#0b57a4"
          icon="🌾"
          label="Farmer Partners"
          value={farmers.length}
        />
        <SummaryCard
          color="#ec4899"
          icon="📦"
          label="Products"
          value={products.length}
        />
      </div>

      <div style={s.tabBar}>
        {[
          { key: "intake", label: "🥛 Milk Intake" },
          { key: "usage", label: "⚗️ Milk Usage" },
          { key: "production", label: "🏭 Production" },
          { key: "history", label: "📋 History" },
        ].map((t) => (
          <button
            key={t.key}
            style={{ ...s.tab, ...(tab === t.key ? s.tabActive : {}) }}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={s.content}>
        {tab === "intake" && (
          <div style={s.twoCol}>
            <form onSubmit={submitIntake} style={s.card}>
              <h2 style={s.cardTitle}>🥛 Record Milk Intake</h2>
              <p style={s.cardSub}>
                Enter details of milk collected from farmers
              </p>

              <Label>Farmer (select or type name below)</Label>
              <select
                style={s.input}
                value={intakeForm.farmerId}
                onChange={(e) => {
                  const f = farmers.find((x) => x._id === e.target.value);
                  setIntakeForm({
                    ...intakeForm,
                    farmerId: e.target.value,
                    farmerName: f ? f.name : intakeForm.farmerName,
                    source: f ? f.village || "" : intakeForm.source,
                  });
                }}
              >
                <option value="">— Select Registered Farmer —</option>
                {farmers.map((f) => (
                  <option key={f._id} value={f._id}>
                    {f.name} — {f.village || "—"}
                  </option>
                ))}
              </select>

              <Label>Farmer Name (if not listed)</Label>
              <input
                style={s.input}
                placeholder="e.g. Ramesh Kumar"
                value={intakeForm.farmerName}
                onChange={(e) =>
                  setIntakeForm({ ...intakeForm, farmerName: e.target.value })
                }
              />

              <Label>Source / Village / Location *</Label>
              <input
                style={s.input}
                placeholder="e.g. Motihari, Bihar"
                value={intakeForm.source}
                onChange={(e) =>
                  setIntakeForm({ ...intakeForm, source: e.target.value })
                }
              />

              <div style={s.row}>
                <div style={{ flex: 1 }}>
                  <Label>Quantity (Litres) *</Label>
                  <input
                    style={s.input}
                    type="number"
                    min="1"
                    placeholder="e.g. 120"
                    value={intakeForm.quantity}
                    onChange={(e) =>
                      setIntakeForm({ ...intakeForm, quantity: e.target.value })
                    }
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <Label>Fat % (optional)</Label>
                  <input
                    style={s.input}
                    type="number"
                    step="0.1"
                    placeholder="e.g. 3.5"
                    value={intakeForm.fatPercentage}
                    onChange={(e) =>
                      setIntakeForm({
                        ...intakeForm,
                        fatPercentage: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <Label>Vehicle / Transport Number</Label>
              <input
                style={s.input}
                placeholder="e.g. BR01-AB-1234"
                value={intakeForm.vehicleNumber}
                onChange={(e) =>
                  setIntakeForm({
                    ...intakeForm,
                    vehicleNumber: e.target.value,
                  })
                }
              />

              <Label>Notes / Remarks</Label>
              <textarea
                style={{ ...s.input, height: 70, resize: "none" }}
                placeholder="Any notes about this batch..."
                value={intakeForm.notes}
                onChange={(e) =>
                  setIntakeForm({ ...intakeForm, notes: e.target.value })
                }
              />

              <button
                style={{
                  ...s.btn,
                  background: "linear-gradient(135deg,#0b57a4,#0ea5e9)",
                }}
                disabled={loading}
              >
                {loading ? "Recording…" : "✅ Record Milk Intake"}
              </button>
            </form>

            <div style={s.card}>
              <h2 style={s.cardTitle}>📋 Recent Milk Intake</h2>
              <p style={s.cardSub}>Latest collections from farmers</p>
              <div style={s.scrollList}>
                {milkIn.length === 0 && (
                  <p style={s.empty}>No milk intake recorded yet.</p>
                )}
                {milkIn.map((m) => (
                  <div key={m._id} style={s.listItem}>
                    <div style={{ ...s.listIcon, background: "#e0f2fe" }}>
                      🥛
                    </div>
                    <div style={{ flex: 1 }}>
                      <strong style={{ fontSize: 15 }}>
                        {m.quantity} Litres
                      </strong>
                      {m.farmerName && (
                        <span style={s.tag}>👨‍🌾 {m.farmerName}</span>
                      )}
                      {m.source && <span style={s.tag}>📍 {m.source}</span>}
                      {m.fatPercentage > 0 && (
                        <span style={s.tag}>💧 Fat: {m.fatPercentage}%</span>
                      )}
                      {m.vehicleNumber && (
                        <span style={s.tag}>🚛 {m.vehicleNumber}</span>
                      )}
                      {m.notes && (
                        <p
                          style={{
                            fontSize: 12,
                            color: "#64748b",
                            marginTop: 4,
                          }}
                        >
                          {m.notes}
                        </p>
                      )}
                    </div>
                    <small style={s.dateText}>{fmtDate(m.date)}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "usage" && (
          <div style={s.twoCol}>
            <form onSubmit={submitUsage} style={s.card}>
              <h2 style={s.cardTitle}>⚗️ Record Milk Usage</h2>
              <p style={s.cardSub}>Log how milk is consumed in production</p>

              <Label>Quantity Used (Litres) *</Label>
              <input
                style={s.input}
                type="number"
                min="1"
                placeholder="e.g. 50"
                value={usageForm.quantity}
                onChange={(e) =>
                  setUsageForm({ ...usageForm, quantity: e.target.value })
                }
              />

              <Label>Purpose / Used For *</Label>
              <select
                style={s.input}
                value={usageForm.purpose}
                onChange={(e) =>
                  setUsageForm({ ...usageForm, purpose: e.target.value })
                }
              >
                <option value="">— Select Purpose —</option>
                <option value="Paneer Production">Paneer Production</option>
                <option value="Ghee Production">Ghee Production</option>
                <option value="Butter Production">Butter Production</option>
                <option value="Cheese Production">Cheese Production</option>
                <option value="Curd / Dahi Making">Curd / Dahi Making</option>
                <option value="Flavoured Milk">Flavoured Milk</option>
                <option value="Full Cream Milk Packaging">
                  Full Cream Milk Packaging
                </option>
                <option value="Skimmed Milk Packaging">
                  Skimmed Milk Packaging
                </option>
                <option value="Ice Cream Mix">Ice Cream Mix</option>
                <option value="Wastage / Spoilage">Wastage / Spoilage</option>
                <option value="Other">Other</option>
              </select>

              <Label>Notes (optional)</Label>
              <textarea
                style={{ ...s.input, height: 70, resize: "none" }}
                placeholder="Any additional info..."
                value={usageForm.notes}
                onChange={(e) =>
                  setUsageForm({ ...usageForm, notes: e.target.value })
                }
              />

              <div style={s.balanceBox}>
                <span>📊 Current Balance:</span>
                <strong
                  style={{
                    color: summary.balance < 50 ? "#ef4444" : "#16a34a",
                    fontSize: 20,
                  }}
                >
                  {fmt(summary.balance)} L
                </strong>
              </div>

              <button
                style={{
                  ...s.btn,
                  background: "linear-gradient(135deg,#f59e0b,#d97706)",
                }}
                disabled={loading}
              >
                {loading ? "Recording…" : "⚗️ Record Usage"}
              </button>
            </form>

            <div style={s.card}>
              <h2 style={s.cardTitle}>📋 Milk Usage Log</h2>
              <p style={s.cardSub}>All milk deductions from stock</p>
              <div style={s.scrollList}>
                {milkUsed.length === 0 && (
                  <p style={s.empty}>No usage recorded yet.</p>
                )}
                {milkUsed.map((m) => (
                  <div key={m._id} style={s.listItem}>
                    <div style={{ ...s.listIcon, background: "#fef3c7" }}>
                      ⚗️
                    </div>
                    <div style={{ flex: 1 }}>
                      <strong style={{ fontSize: 15, color: "#d97706" }}>
                        {Math.abs(m.quantity)} Litres used
                      </strong>
                      <span style={s.tag}>🏷 {m.source}</span>
                      {m.notes && (
                        <p
                          style={{
                            fontSize: 12,
                            color: "#64748b",
                            marginTop: 4,
                          }}
                        >
                          {m.notes}
                        </p>
                      )}
                    </div>
                    <small style={s.dateText}>{fmtDate(m.date)}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "production" && (
          <div style={s.twoCol}>
            <form onSubmit={submitProd} style={s.card}>
              <h2 style={s.cardTitle}>🏭 Log Production</h2>
              <p style={s.cardSub}>Record finished goods produced from milk</p>

              <Label>Product *</Label>
              <select
                style={s.input}
                value={prodForm.productId}
                onChange={(e) =>
                  setProdForm({ ...prodForm, productId: e.target.value })
                }
              >
                <option value="">— Select Product —</option>
                {products.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} (Stock: {p.stock || 0})
                  </option>
                ))}
              </select>

              <div style={s.row}>
                <div style={{ flex: 1 }}>
                  <Label>Units Produced *</Label>
                  <input
                    style={s.input}
                    type="number"
                    min="1"
                    placeholder="e.g. 200"
                    value={prodForm.quantity}
                    onChange={(e) =>
                      setProdForm({ ...prodForm, quantity: e.target.value })
                    }
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <Label>Milk Used (L) *</Label>
                  <input
                    style={s.input}
                    type="number"
                    min="1"
                    placeholder="e.g. 40"
                    value={prodForm.milkUsed}
                    onChange={(e) =>
                      setProdForm({ ...prodForm, milkUsed: e.target.value })
                    }
                  />
                </div>
              </div>

              <div style={s.balanceBox}>
                <span>📊 Available Milk:</span>
                <strong
                  style={{
                    color: summary.balance < 50 ? "#ef4444" : "#16a34a",
                    fontSize: 20,
                  }}
                >
                  {fmt(summary.balance)} L
                </strong>
              </div>

              <button
                style={{
                  ...s.btn,
                  background: "linear-gradient(135deg,#16a34a,#22c55e)",
                }}
                disabled={loading}
              >
                {loading ? "Recording…" : "🏭 Log Production & Update Stock"}
              </button>
            </form>

            <div style={s.card}>
              <h2 style={s.cardTitle}>📋 Production History</h2>
              <p style={s.cardSub}>All finished goods produced</p>
              <div style={s.scrollList}>
                {productionList.length === 0 && (
                  <p style={s.empty}>No production logged yet.</p>
                )}
                {productionList.map((p) => (
                  <div key={p._id} style={s.listItem}>
                    <div style={{ ...s.listIcon, background: "#dcfce7" }}>
                      🏭
                    </div>
                    <div style={{ flex: 1 }}>
                      <strong style={{ fontSize: 15 }}>{p.productName}</strong>
                      <div style={{ marginTop: 4 }}>
                        <span
                          style={{
                            ...s.tag,
                            background: "#dcfce7",
                            color: "#16a34a",
                          }}
                        >
                          📦 {p.quantity} units
                        </span>
                        <span
                          style={{
                            ...s.tag,
                            background: "#fef3c7",
                            color: "#d97706",
                          }}
                        >
                          🥛 {p.milkUsed} L used
                        </span>
                      </div>
                    </div>
                    <small style={s.dateText}>{fmtDate(p.date)}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "history" && (
          <div style={s.historyGrid}>
            <div style={s.card}>
              <h2 style={s.cardTitle}>🌾 Farmer Partners</h2>
              <p style={s.cardSub}>Registered suppliers for your dairy</p>
              <div style={s.scrollList}>
                {farmers.length === 0 && (
                  <p style={s.empty}>
                    No farmers added yet. Ask Admin to add farmers.
                  </p>
                )}
                {farmers.map((f) => (
                  <div key={f._id} style={s.listItem}>
                    <div style={{ ...s.listIcon, background: "#fef9c3" }}>
                      🌾
                    </div>
                    <div>
                      <strong style={{ fontSize: 15 }}>{f.name}</strong>
                      {f.village && <span style={s.tag}>📍 {f.village}</span>}
                      {f.phone && <span style={s.tag}>📞 {f.phone}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={s.card}>
              <h2 style={s.cardTitle}>📋 Full Milk Log</h2>
              <p style={s.cardSub}>All intake (+) and usage (−) entries</p>
              <div style={s.scrollList}>
                {milkList.length === 0 && (
                  <p style={s.empty}>No milk entries yet.</p>
                )}
                {milkList.map((m) => (
                  <div key={m._id} style={s.listItem}>
                    <div
                      style={{
                        ...s.listIcon,
                        background: m.quantity > 0 ? "#dbeafe" : "#fee2e2",
                      }}
                    >
                      {m.quantity > 0 ? "🥛" : "⚗️"}
                    </div>
                    <div style={{ flex: 1 }}>
                      <strong
                        style={{
                          fontSize: 15,
                          color: m.quantity > 0 ? "#0b57a4" : "#ef4444",
                        }}
                      >
                        {m.quantity > 0 ? "+" : "−"}
                        {Math.abs(m.quantity)} L
                      </strong>
                      {m.farmerName && (
                        <span style={s.tag}>👨‍🌾 {m.farmerName}</span>
                      )}
                      {m.source && <span style={s.tag}>📍 {m.source}</span>}
                    </div>
                    <small style={s.dateText}>{fmtDate(m.date)}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Label = ({ children }) => (
  <label
    style={{
      display: "block",
      fontSize: 13,
      fontWeight: 700,
      color: "#334155",
      marginBottom: 5,
    }}
  >
    {children}
  </label>
);

const SummaryCard = ({ icon, label, value, color, alert }) => (
  <div
    style={{
      padding: "18px 20px",
      borderRadius: 14,
      background: "#fff",
      border: "1px solid rgba(11,87,164,0.08)",
      boxShadow: "0 12px 32px rgba(11,63,138,0.07)",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 10,
      }}
    >
      <span style={{ fontSize: 22 }}>{icon}</span>
      <span style={{ fontSize: 13, color: "#64748b", fontWeight: 700 }}>
        {label}
      </span>
    </div>
    <strong style={{ fontSize: 32, color, display: "block" }}>{value}</strong>
    {alert && (
      <span style={{ fontSize: 12, color: "#ef4444", fontWeight: 800 }}>
        ⚠️ {alert}
      </span>
    )}
  </div>
);

const s = {
  page: {
    minHeight: "100vh",
    padding: "96px 24px 48px",
    background:
      "linear-gradient(90deg, rgba(23,82,170,0.04) 1px, transparent 1px), linear-gradient(rgba(23,82,170,0.04) 1px, transparent 1px), linear-gradient(135deg,#ffffff 0%,#e8f6ff 45%,#fff7d9 100%)",
    backgroundSize: "46px 46px, 46px 46px, auto",
    color: "#10233f",
    fontFamily: "'Inter', sans-serif",
  },
  toast: {
    position: "fixed",
    top: 80,
    right: 24,
    zIndex: 9999,
    padding: "14px 22px",
    borderRadius: 12,
    color: "#fff",
    fontWeight: 700,
    fontSize: 14,
    boxShadow: "0 12px 40px rgba(0,0,0,0.18)",
    animation: "fadeIn .3s ease",
  },
  header: {
    maxWidth: 1240,
    margin: "0 auto 28px",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 16,
  },
  headerLeft: {},
  badge: {
    display: "inline-block",
    padding: "8px 16px",
    borderRadius: 999,
    background: "#fff2a8",
    color: "#0b57a4",
    fontWeight: 800,
    fontSize: 13,
    border: "1px solid rgba(11,87,164,0.1)",
    marginBottom: 12,
  },
  title: {
    fontSize: "clamp(28px,4vw,44px)",
    fontWeight: 900,
    color: "#0b3f8a",
    margin: 0,
  },
  sub: { color: "#475569", fontSize: 15, marginTop: 8 },
  userChip: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    background: "#fff",
    padding: "12px 16px",
    borderRadius: 12,
    border: "1px solid rgba(11,87,164,0.1)",
    boxShadow: "0 4px 16px rgba(11,63,138,0.08)",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    background: "linear-gradient(135deg,#0b57a4,#0ea5e9)",
    color: "#fff",
    fontWeight: 900,
    fontSize: 18,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))",
    gap: 16,
    maxWidth: 1240,
    margin: "0 auto 28px",
  },
  tabBar: {
    display: "flex",
    gap: 8,
    maxWidth: 1240,
    margin: "0 auto 22px",
    borderBottom: "2px solid rgba(11,87,164,0.08)",
    paddingBottom: 2,
  },
  tab: {
    padding: "10px 20px",
    borderRadius: "10px 10px 0 0",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 14,
    color: "#64748b",
    transition: "all .2s",
  },
  tabActive: {
    background: "linear-gradient(135deg,#0b57a4,#0ea5e9)",
    color: "#fff",
    boxShadow: "0 8px 20px rgba(11,87,164,0.2)",
  },
  content: { maxWidth: 1240, margin: "0 auto" },
  twoCol: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,480px),1fr))",
    gap: 22,
  },
  historyGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,480px),1fr))",
    gap: 22,
  },
  card: {
    background: "#fff",
    borderRadius: 16,
    padding: 26,
    border: "1px solid rgba(11,87,164,0.08)",
    boxShadow: "0 16px 48px rgba(11,63,138,0.07)",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 900,
    color: "#0b3f8a",
    marginBottom: 4,
  },
  cardSub: { fontSize: 13, color: "#64748b", marginBottom: 20 },
  input: {
    display: "block",
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    border: "1.5px solid rgba(11,87,164,0.14)",
    marginBottom: 14,
    background: "#f8fafc",
    color: "#10233f",
    fontSize: 14,
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box",
  },
  row: { display: "flex", gap: 14 },
  btn: {
    width: "100%",
    padding: "14px",
    borderRadius: 12,
    border: "none",
    color: "#fff",
    fontWeight: 800,
    fontSize: 15,
    cursor: "pointer",
    boxShadow: "0 8px 24px rgba(11,87,164,0.15)",
    marginTop: 4,
    transition: "transform .2s",
  },
  scrollList: { maxHeight: 450, overflowY: "auto", paddingRight: 4 },
  listItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    padding: "14px 12px",
    borderRadius: 10,
    border: "1px solid rgba(11,87,164,0.06)",
    marginBottom: 10,
    background: "#fafbff",
  },
  listIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
    flexShrink: 0,
  },
  tag: {
    display: "inline-block",
    fontSize: 12,
    fontWeight: 700,
    background: "#eff6ff",
    color: "#0b57a4",
    borderRadius: 6,
    padding: "2px 8px",
    margin: "3px 4px 0 0",
  },
  dateText: {
    fontSize: 11,
    color: "#94a3b8",
    whiteSpace: "nowrap",
    marginTop: 2,
  },
  empty: {
    color: "#94a3b8",
    fontSize: 14,
    textAlign: "center",
    padding: "24px 0",
  },
  balanceBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#f8fafc",
    borderRadius: 10,
    padding: "12px 16px",
    marginBottom: 14,
    border: "1px dashed rgba(11,87,164,0.2)",
    fontSize: 14,
    fontWeight: 700,
    color: "#334155",
  },
};

export default StaffDashboard;
