import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBoxOpen,
  FaChartLine,
  FaImage,
  FaRupeeSign,
  FaSeedling,
  FaStore,
  FaTrash,
  FaTruck,
  FaUserPlus,
  FaUsers,
  FaPlus,
  FaLeaf,
  FaShoppingBag,
  FaArrowRight,
  FaTimes,
} from "react-icons/fa";
import { getImageUrl } from "../../api/config";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [farmers, setFarmers] = useState([]);
  const [staff, setStaff] = useState([]);
  const [products, setProducts] = useState([]);
  const [activePanel, setActivePanel] = useState(null); // 'product' | 'staff' | 'farmer'
  const [toast, setToast] = useState("");

  const [farmerForm, setFarmerForm] = useState({ name: "", village: "" });
  const [staffForm, setStaffForm] = useState({ name: "", userId: "", password: "" });
  const [productForm, setProductForm] = useState({ name: "", price: "", originalPrice: "", discount: "", image: null });

  const token = localStorage.getItem("token");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const fetchAll = useCallback(async () => {
    try {
      const [fRes, sRes, pRes] = await Promise.all([
        fetch(`${API_BASE}/api/farmers`, { headers: { Authorization: "Bearer " + token } }),
        fetch(`${API_BASE}/api/users/staff`, { headers: { Authorization: "Bearer " + token } }),
        fetch(`${API_BASE}/api/products`),
      ]);
      setFarmers(await fRes.json());
      setStaff(await sRes.json());
      const productData = await pRes.json();
      setProducts(Array.isArray(productData) ? productData : productData.products || []);
    } catch (err) {
      console.log(err);
    }
  }, [token]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", productForm.name);
      formData.append("price", productForm.price);
      formData.append("originalPrice", productForm.originalPrice);
      formData.append("discount", productForm.discount);
      if (productForm.image) formData.append("image", productForm.image);

      const res = await fetch(`${API_BASE}/api/products`, {
        method: "POST",
        headers: { Authorization: "Bearer " + token },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.msg || "Failed to add product"); return; }
      showToast("✅ Product added successfully!");
      setProductForm({ name: "", price: "", originalPrice: "", discount: "", image: null });
      setActivePanel(null);
      fetchAll();
    } catch (err) {
      showToast("⚠️ Error adding product");
    }
  };

  const addStaff = async (e) => {
    e.preventDefault();
    if (!staffForm.name || !staffForm.userId || !staffForm.password) {
      showToast("⚠️ Please fill all fields"); return;
    }
    const trimmedUserId = staffForm.userId.trim();
    if (staff.some((s) => s.userId.toLowerCase() === trimmedUserId.toLowerCase())) {
      showToast(`⚠️ User ID "${trimmedUserId}" already exists`); return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/users/staff`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({ ...staffForm, userId: trimmedUserId }),
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.msg || "Failed to add staff"); return; }
      showToast(`✅ Staff "${data.name}" added!`);
      setStaffForm({ name: "", userId: "", password: "" });
      setActivePanel(null);
      fetchAll();
    } catch (err) {
      showToast("⚠️ Error adding staff");
    }
  };

  const addFarmer = async (e) => {
    e.preventDefault();
    if (!farmerForm.name || !farmerForm.village) {
      showToast("⚠️ Please fill Farmer Name and Village"); return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/farmers`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify(farmerForm),
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.msg || "Failed to add farmer"); return; }
      showToast("✅ Farmer partner added!");
      setFarmerForm({ name: "", village: "" });
      setActivePanel(null);
      fetchAll();
    } catch (err) {
      showToast("⚠️ Error adding farmer");
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/products/${id}`, {
        method: "DELETE", headers: { Authorization: "Bearer " + token },
      });
      if (res.ok) { fetchAll(); showToast("🗑️ Product deleted"); }
    } catch (err) { console.error(err); }
  };

  const deleteFarmer = async (id) => {
    if (!window.confirm("Remove this farmer?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/farmers/${id}`, {
        method: "DELETE", headers: { Authorization: "Bearer " + token },
      });
      if (res.ok) { fetchAll(); showToast("🗑️ Farmer removed"); }
    } catch (err) { console.error(err); }
  };

  const deleteStaff = async (id) => {
    if (!window.confirm("Remove this staff member?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/users/staff/${id}`, {
        method: "DELETE", headers: { Authorization: "Bearer " + token },
      });
      if (res.ok) { fetchAll(); showToast("🗑️ Staff removed"); }
    } catch (err) { console.error(err); }
  };

  const revenue = products.reduce((sum, p) => sum + (Number(p.price) || 0), 0);

  return (
    <div className="dn-admin-root">
      {/* TOAST */}
      {toast && <div className="dn-admin-toast">{toast}</div>}

      {/* SIDEBAR */}
      <aside className="dn-admin-sidebar">
        <div className="dn-sidebar-brand">
          <div className="dn-sidebar-logo">DN</div>
          <div>
            <span className="dn-sidebar-title">DairyNest</span>
            <span className="dn-sidebar-sub">Admin Panel</span>
          </div>
        </div>

        <nav className="dn-sidebar-nav">
          <span className="dn-sidebar-section-label">Management</span>
          <button className="dn-sidebar-link active" onClick={() => {}}>
            <FaChartLine /> Dashboard
          </button>
          <button className="dn-sidebar-link" onClick={() => navigate("/admin/orders")}>
            <FaShoppingBag /> Orders
          </button>
          <button className="dn-sidebar-link" onClick={() => navigate("/admin/orders")}>
            <FaTruck /> Deliveries
          </button>

          <span className="dn-sidebar-section-label" style={{marginTop:20}}>Quick Add</span>
          <button className="dn-sidebar-link" onClick={() => setActivePanel(activePanel === "product" ? null : "product")}>
            <FaBoxOpen /> Add Product
          </button>
          <button className="dn-sidebar-link" onClick={() => setActivePanel(activePanel === "staff" ? null : "staff")}>
            <FaUsers /> Add Staff
          </button>
          <button className="dn-sidebar-link" onClick={() => setActivePanel(activePanel === "farmer" ? null : "farmer")}>
            <FaSeedling /> Add Farmer
          </button>
        </nav>

        <div className="dn-sidebar-hq">
          <div className="dn-sidebar-hq-icon"><FaLeaf /></div>
          <div>
            <span style={{display:"block",fontSize:11,color:"#94a3b8",fontWeight:700}}>HQ</span>
            <span style={{display:"block",fontSize:12,color:"#e2e8f0",fontWeight:700}}>Motihari, Bihar</span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="dn-admin-main">
        {/* HEADER */}
        <div className="dn-admin-topbar">
          <div>
            <h1 className="dn-admin-heading">Admin Dashboard</h1>
            <p className="dn-admin-subheading">Manage DairyNest operations, products, farmers & staff</p>
          </div>
          <button className="dn-admin-orders-btn" onClick={() => navigate("/admin/orders")}>
            <FaTruck /> View Orders <FaArrowRight />
          </button>
        </div>

        {/* METRICS GRID */}
        <div className="dn-admin-metrics">
          <div className="dn-metric-card" style={{background:"linear-gradient(135deg,#0b57a4,#0878b8)"}}>
            <div className="dn-metric-icon-wrap"><FaBoxOpen /></div>
            <div className="dn-metric-content">
              <span className="dn-metric-value">{products.length}</span>
              <span className="dn-metric-label">Total Products</span>
            </div>
            <div className="dn-metric-bg-icon"><FaBoxOpen /></div>
          </div>
          <div className="dn-metric-card" style={{background:"linear-gradient(135deg,#16a34a,#15803d)"}}>
            <div className="dn-metric-icon-wrap"><FaSeedling /></div>
            <div className="dn-metric-content">
              <span className="dn-metric-value">{farmers.length}</span>
              <span className="dn-metric-label">Farmer Partners</span>
            </div>
            <div className="dn-metric-bg-icon"><FaSeedling /></div>
          </div>
          <div className="dn-metric-card" style={{background:"linear-gradient(135deg,#7c3aed,#6d28d9)"}}>
            <div className="dn-metric-icon-wrap"><FaUsers /></div>
            <div className="dn-metric-content">
              <span className="dn-metric-value">{staff.length}</span>
              <span className="dn-metric-label">Staff Members</span>
            </div>
            <div className="dn-metric-bg-icon"><FaUsers /></div>
          </div>
          <div className="dn-metric-card" style={{background:"linear-gradient(135deg,#d97706,#b45309)"}}>
            <div className="dn-metric-icon-wrap"><FaRupeeSign /></div>
            <div className="dn-metric-content">
              <span className="dn-metric-value">₹{revenue.toLocaleString()}</span>
              <span className="dn-metric-label">Catalog Value</span>
            </div>
            <div className="dn-metric-bg-icon"><FaRupeeSign /></div>
          </div>
        </div>

        {/* QUICK ADD PANEL */}
        {activePanel && (
          <div className="dn-admin-panel-wrap">
            <div className="dn-admin-panel">
              <div className="dn-panel-header">
                <h3 className="dn-panel-title">
                  {activePanel === "product" && <><FaBoxOpen /> Add New Product</>}
                  {activePanel === "staff" && <><FaUsers /> Add Staff Member</>}
                  {activePanel === "farmer" && <><FaSeedling /> Register Farmer Partner</>}
                </h3>
                <button className="dn-panel-close" onClick={() => setActivePanel(null)}><FaTimes /></button>
              </div>

              {activePanel === "product" && (
                <form onSubmit={addProduct} className="dn-panel-form">
                  <div className="dn-panel-row">
                    <div className="dn-form-group">
                      <label>Product Name</label>
                      <input placeholder="e.g. Full Cream Milk 500ml" value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} />
                    </div>
                  </div>
                  <div className="dn-panel-row three-col">
                    <div className="dn-form-group">
                      <label>Price (₹)</label>
                      <input placeholder="e.g. 34" value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} />
                    </div>
                    <div className="dn-form-group">
                      <label>Original Price (₹)</label>
                      <input placeholder="e.g. 38" value={productForm.originalPrice}
                        onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })} />
                    </div>
                    <div className="dn-form-group">
                      <label>Discount %</label>
                      <input placeholder="e.g. 11% OFF" value={productForm.discount}
                        onChange={(e) => setProductForm({ ...productForm, discount: e.target.value })} />
                    </div>
                  </div>
                  <div className="dn-form-group">
                    <label>Product Image</label>
                    <label className="dn-file-btn">
                      <FaImage /> {productForm.image?.name || "Click to upload product image"}
                      <input type="file" style={{display:"none"}}
                        onChange={(e) => setProductForm({ ...productForm, image: e.target.files[0] })} />
                    </label>
                  </div>
                  <button type="submit" className="dn-panel-submit-btn blue">
                    <FaPlus /> Add Product to Catalog
                  </button>
                </form>
              )}

              {activePanel === "staff" && (
                <form onSubmit={addStaff} className="dn-panel-form">
                  <div className="dn-panel-row three-col">
                    <div className="dn-form-group">
                      <label>Full Name</label>
                      <input placeholder="Staff member's name" value={staffForm.name}
                        onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })} />
                    </div>
                    <div className="dn-form-group">
                      <label>User ID</label>
                      <input placeholder="e.g. EMP101" value={staffForm.userId}
                        onChange={(e) => setStaffForm({ ...staffForm, userId: e.target.value })} />
                    </div>
                    <div className="dn-form-group">
                      <label>Password</label>
                      <input type="password" placeholder="Set password" value={staffForm.password}
                        onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })} />
                    </div>
                  </div>
                  <button type="submit" className="dn-panel-submit-btn yellow">
                    <FaUserPlus /> Register Staff Member
                  </button>
                </form>
              )}

              {activePanel === "farmer" && (
                <form onSubmit={addFarmer} className="dn-panel-form">
                  <div className="dn-panel-row two-col">
                    <div className="dn-form-group">
                      <label>Farmer's Full Name</label>
                      <input placeholder="e.g. Rajan Kumar" value={farmerForm.name}
                        onChange={(e) => setFarmerForm({ ...farmerForm, name: e.target.value })} />
                    </div>
                    <div className="dn-form-group">
                      <label>Village / District</label>
                      <input placeholder="e.g. Chhatauni, Motihari" value={farmerForm.village}
                        onChange={(e) => setFarmerForm({ ...farmerForm, village: e.target.value })} />
                    </div>
                  </div>
                  <button type="submit" className="dn-panel-submit-btn green">
                    <FaSeedling /> Register Farmer Partner
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* PRODUCTS */}
        <div className="dn-admin-section">
          <div className="dn-section-header">
            <div>
              <h2 className="dn-section-title"><FaBoxOpen /> Dairy Product Catalog</h2>
              <p className="dn-section-sub">{products.length} products listed in catalog</p>
            </div>
            <button className="dn-add-fab" onClick={() => setActivePanel("product")}>
              <FaPlus /> Add Product
            </button>
          </div>
          <div className="dn-products-grid">
            {products.map((p) => {
              const imgSrc = p.image
                ? (p.image.startsWith("http") ? p.image : getImageUrl(p.image))
                : "https://via.placeholder.com/300x200?text=DairyNest";
              return (
                <div key={p._id} className="dn-product-card">
                  <div className="dn-product-img-wrap">
                    <img src={imgSrc} alt={p.name} className="dn-product-img" />
                    {p.discount && <span className="dn-product-badge">{p.discount}% OFF</span>}
                  </div>
                  <div className="dn-product-body">
                    <h3 className="dn-product-name">{p.name}</h3>
                    <div className="dn-product-price-row">
                      <span className="dn-product-price">₹{p.price}</span>
                      {p.originalPrice && <span className="dn-product-original">₹{p.originalPrice}</span>}
                    </div>
                    <div className="dn-product-stock">Stock: {p.stock || 0} units</div>
                    <button className="dn-delete-btn" onClick={() => deleteProduct(p._id)}>
                      <FaTrash /> Remove
                    </button>
                  </div>
                </div>
              );
            })}
            {products.length === 0 && (
              <div className="dn-empty-state">
                <FaBoxOpen className="dn-empty-icon" />
                <p>No products yet. Add your first dairy product!</p>
              </div>
            )}
          </div>
        </div>

        {/* FARMER & STAFF in 2-col */}
        <div className="dn-people-grid-2col">
          {/* FARMERS */}
          <div className="dn-admin-section">
            <div className="dn-section-header">
              <div>
                <h2 className="dn-section-title"><FaSeedling /> Farmer Partners</h2>
                <p className="dn-section-sub">{farmers.length} registered partner farmers</p>
              </div>
              <button className="dn-add-fab green" onClick={() => setActivePanel("farmer")}>
                <FaPlus /> Add
              </button>
            </div>
            <div className="dn-people-list">
              {farmers.map((f) => (
                <div key={f._id} className="dn-people-card">
                  <div className="dn-people-avatar green"><FaSeedling /></div>
                  <div className="dn-people-info">
                    <strong>{f.name}</strong>
                    <span>{f.village}</span>
                  </div>
                  <button className="dn-people-del" onClick={() => deleteFarmer(f._id)}><FaTrash /></button>
                </div>
              ))}
              {farmers.length === 0 && <div className="dn-people-empty">No farmers yet</div>}
            </div>
          </div>

          {/* STAFF */}
          <div className="dn-admin-section">
            <div className="dn-section-header">
              <div>
                <h2 className="dn-section-title"><FaUsers /> Staff Members</h2>
                <p className="dn-section-sub">{staff.length} active operations team</p>
              </div>
              <button className="dn-add-fab purple" onClick={() => setActivePanel("staff")}>
                <FaPlus /> Add
              </button>
            </div>
            <div className="dn-people-list">
              {staff.map((s) => (
                <div key={s._id} className="dn-people-card">
                  <div className="dn-people-avatar purple"><FaStore /></div>
                  <div className="dn-people-info">
                    <strong>{s.name}</strong>
                    <span>ID: {s.userId}</span>
                  </div>
                  <button className="dn-people-del" onClick={() => deleteStaff(s._id)}><FaTrash /></button>
                </div>
              ))}
              {staff.length === 0 && <div className="dn-people-empty">No staff yet</div>}
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');

        .dn-admin-root {
          display: flex;
          min-height: 100vh;
          background: #0d1117;
          font-family: 'Outfit', sans-serif;
          color: #e2e8f0;
        }

        /* SIDEBAR */
        .dn-admin-sidebar {
          width: 240px;
          flex-shrink: 0;
          background: #0b1120;
          border-right: 1px solid rgba(255,255,255,0.07);
          display: flex;
          flex-direction: column;
          padding: 24px 16px 24px;
          position: fixed;
          top: 64px;
          left: 0;
          height: calc(100vh - 64px);
          overflow-y: auto;
          z-index: 100;
        }

        .dn-sidebar-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 24px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          margin-bottom: 24px;
        }

        .dn-sidebar-logo {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          background: linear-gradient(135deg,#ffd43b,#ffbb00);
          color: #0b3f8a;
          font-size: 18px;
          font-weight: 900;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          box-shadow: 0 4px 14px rgba(255,212,59,0.35);
        }

        .dn-sidebar-title {
          display: block;
          font-size: 17px;
          font-weight: 900;
          color: #f1f5f9;
          line-height: 1.1;
        }

        .dn-sidebar-sub {
          display: block;
          font-size: 11px;
          font-weight: 700;
          color: #64748b;
          letter-spacing: 0.5px;
        }

        .dn-sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }

        .dn-sidebar-section-label {
          font-size: 10.5px;
          font-weight: 800;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 1px;
          padding: 0 10px;
          margin-bottom: 4px;
          margin-top: 8px;
          display: block;
        }

        .dn-sidebar-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 10px;
          background: transparent;
          border: none;
          color: #94a3b8;
          font-size: 13.5px;
          font-weight: 700;
          font-family: inherit;
          cursor: pointer;
          text-align: left;
          transition: all 0.18s ease;
        }

        .dn-sidebar-link:hover {
          background: rgba(255,255,255,0.06);
          color: #f1f5f9;
        }

        .dn-sidebar-link.active {
          background: rgba(11,87,164,0.25);
          color: #60a5fa;
          border: 1px solid rgba(96,165,250,0.2);
        }

        .dn-sidebar-hq {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          border-radius: 10px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          margin-top: 24px;
        }

        .dn-sidebar-hq-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(22,163,74,0.2);
          color: #4ade80;
          display: grid;
          place-items: center;
          font-size: 14px;
          flex-shrink: 0;
        }

        /* MAIN */
        .dn-admin-main {
          margin-left: 240px;
          flex: 1;
          padding: 90px 32px 48px;
          overflow-x: hidden;
        }

        .dn-admin-topbar {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 28px;
        }

        .dn-admin-heading {
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 900;
          color: #f1f5f9;
          margin: 0 0 4px 0;
          background: linear-gradient(90deg, #f1f5f9, #93c5fd);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .dn-admin-subheading {
          font-size: 14px;
          color: #64748b;
          font-weight: 600;
          margin: 0;
        }

        .dn-admin-orders-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 22px;
          background: linear-gradient(135deg, #ffd43b, #f59e0b);
          color: #0b3f8a;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          font-family: inherit;
          box-shadow: 0 8px 24px rgba(255,212,59,0.3);
          transition: all 0.2s;
          white-space: nowrap;
        }

        .dn-admin-orders-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(255,212,59,0.45);
        }

        /* METRICS */
        .dn-admin-metrics {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 32px;
        }

        .dn-metric-card {
          border-radius: 16px;
          padding: 22px 20px;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.2);
          transition: transform 0.2s ease;
        }

        .dn-metric-card:hover {
          transform: translateY(-3px);
        }

        .dn-metric-icon-wrap {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: rgba(255,255,255,0.2);
          display: grid;
          place-items: center;
          font-size: 20px;
          color: #fff;
          flex-shrink: 0;
        }

        .dn-metric-content {
          flex: 1;
          min-width: 0;
        }

        .dn-metric-value {
          display: block;
          font-size: 26px;
          font-weight: 900;
          color: #fff;
          line-height: 1;
        }

        .dn-metric-label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          color: rgba(255,255,255,0.75);
          margin-top: 5px;
        }

        .dn-metric-bg-icon {
          position: absolute;
          right: -8px;
          bottom: -8px;
          font-size: 64px;
          color: rgba(255,255,255,0.1);
        }

        /* QUICK ADD PANEL */
        .dn-admin-panel-wrap {
          margin-bottom: 28px;
        }

        .dn-admin-panel {
          background: #111827;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.3);
        }

        .dn-panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .dn-panel-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 18px;
          font-weight: 800;
          color: #f1f5f9;
          margin: 0;
        }

        .dn-panel-close {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.06);
          color: #94a3b8;
          cursor: pointer;
          display: grid;
          place-items: center;
          font-size: 15px;
          transition: all 0.2s;
        }

        .dn-panel-close:hover {
          background: #ef4444;
          color: #fff;
          border-color: #ef4444;
        }

        .dn-panel-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .dn-panel-row {
          display: grid;
          gap: 16px;
        }

        .dn-panel-row.two-col { grid-template-columns: 1fr 1fr; }
        .dn-panel-row.three-col { grid-template-columns: 1fr 1fr 1fr; }

        .dn-form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .dn-form-group label {
          font-size: 12px;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .dn-form-group input {
          height: 46px;
          padding: 0 14px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.06);
          color: #f1f5f9;
          font-size: 14px;
          font-weight: 600;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s;
        }

        .dn-form-group input:focus {
          border-color: rgba(96,165,250,0.5);
          background: rgba(255,255,255,0.09);
        }

        .dn-form-group input::placeholder { color: #475569; }

        .dn-file-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          height: 46px;
          padding: 0 14px;
          border-radius: 10px;
          border: 1px dashed rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.04);
          color: #94a3b8;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .dn-file-btn:hover {
          border-color: rgba(96,165,250,0.5);
          color: #93c5fd;
        }

        .dn-panel-submit-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          height: 50px;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
        }

        .dn-panel-submit-btn.blue { background: linear-gradient(135deg,#0b57a4,#0878b8); color: #fff; }
        .dn-panel-submit-btn.yellow { background: linear-gradient(135deg,#ffd43b,#f59e0b); color: #0b3f8a; }
        .dn-panel-submit-btn.green { background: linear-gradient(135deg,#16a34a,#15803d); color: #fff; }
        .dn-panel-submit-btn:hover { transform: translateY(-1px); filter: brightness(1.08); }

        /* SECTION */
        .dn-admin-section {
          background: #111827;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }

        .dn-section-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .dn-section-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 18px;
          font-weight: 800;
          color: #f1f5f9;
          margin: 0 0 4px 0;
        }

        .dn-section-sub {
          font-size: 13px;
          color: #64748b;
          font-weight: 600;
          margin: 0;
        }

        .dn-add-fab {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border: none;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          font-family: inherit;
          white-space: nowrap;
          transition: all 0.2s;
          background: rgba(11,87,164,0.2);
          color: #60a5fa;
          border: 1px solid rgba(96,165,250,0.25);
        }

        .dn-add-fab:hover { background: rgba(11,87,164,0.4); transform: translateY(-1px); }
        .dn-add-fab.green { background: rgba(22,163,74,0.15); color: #4ade80; border-color: rgba(74,222,128,0.25); }
        .dn-add-fab.green:hover { background: rgba(22,163,74,0.3); }
        .dn-add-fab.purple { background: rgba(124,58,237,0.15); color: #c084fc; border-color: rgba(192,132,252,0.25); }
        .dn-add-fab.purple:hover { background: rgba(124,58,237,0.3); }

        /* PRODUCTS GRID */
        .dn-products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
        }

        .dn-product-card {
          border-radius: 14px;
          overflow: hidden;
          background: #1a2332;
          border: 1px solid rgba(255,255,255,0.07);
          transition: all 0.2s;
        }

        .dn-product-card:hover {
          transform: translateY(-3px);
          border-color: rgba(96,165,250,0.25);
          box-shadow: 0 12px 28px rgba(0,0,0,0.3);
        }

        .dn-product-img-wrap {
          position: relative;
          height: 180px;
          background: #0d1a2e;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dn-product-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .dn-product-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background: #ffd43b;
          color: #0b3f8a;
          font-size: 11px;
          font-weight: 900;
          padding: 3px 8px;
          border-radius: 6px;
        }

        .dn-product-body {
          padding: 14px;
        }

        .dn-product-name {
          font-size: 14px;
          font-weight: 800;
          color: #f1f5f9;
          margin: 0 0 8px 0;
          line-height: 1.3;
        }

        .dn-product-price-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }

        .dn-product-price {
          font-size: 18px;
          font-weight: 900;
          color: #60a5fa;
        }

        .dn-product-original {
          font-size: 12px;
          color: #475569;
          text-decoration: line-through;
        }

        .dn-product-stock {
          font-size: 11.5px;
          color: #64748b;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .dn-delete-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          width: 100%;
          height: 36px;
          border: none;
          border-radius: 8px;
          background: rgba(239,68,68,0.12);
          color: #f87171;
          font-size: 12.5px;
          font-weight: 800;
          cursor: pointer;
          font-family: inherit;
          justify-content: center;
          transition: all 0.2s;
          border: 1px solid rgba(239,68,68,0.2);
        }

        .dn-delete-btn:hover {
          background: #ef4444;
          color: #fff;
          border-color: #ef4444;
        }

        /* PEOPLE LIST */
        .dn-people-grid-2col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .dn-people-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .dn-people-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 12px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          transition: all 0.2s;
        }

        .dn-people-card:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.12);
        }

        .dn-people-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: grid;
          place-items: center;
          font-size: 16px;
          flex-shrink: 0;
        }

        .dn-people-avatar.green { background: rgba(22,163,74,0.2); color: #4ade80; }
        .dn-people-avatar.purple { background: rgba(124,58,237,0.2); color: #c084fc; }

        .dn-people-info {
          flex: 1;
          min-width: 0;
        }

        .dn-people-info strong {
          display: block;
          font-size: 14px;
          font-weight: 800;
          color: #f1f5f9;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .dn-people-info span {
          display: block;
          font-size: 12px;
          color: #64748b;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .dn-people-del {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          border: 1px solid rgba(239,68,68,0.2);
          background: rgba(239,68,68,0.1);
          color: #f87171;
          font-size: 13px;
          display: grid;
          place-items: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: all 0.2s;
        }

        .dn-people-del:hover {
          background: #ef4444;
          color: #fff;
          border-color: #ef4444;
        }

        .dn-people-empty {
          padding: 20px;
          text-align: center;
          font-size: 13px;
          color: #475569;
          font-weight: 600;
          border-radius: 10px;
          background: rgba(255,255,255,0.02);
          border: 1px dashed rgba(255,255,255,0.06);
        }

        /* EMPTY STATE */
        .dn-empty-state {
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 48px;
          border: 1px dashed rgba(255,255,255,0.1);
          border-radius: 14px;
          text-align: center;
          color: #475569;
          font-size: 14px;
          font-weight: 600;
        }

        .dn-empty-icon {
          font-size: 40px;
          color: #334155;
        }

        /* TOAST */
        .dn-admin-toast {
          position: fixed;
          top: 80px;
          right: 24px;
          background: #1e293b;
          color: #f1f5f9;
          padding: 14px 20px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          z-index: 99999;
          box-shadow: 0 8px 24px rgba(0,0,0,0.4);
          border-left: 4px solid #60a5fa;
          animation: toastIn 0.25s ease;
          max-width: 360px;
        }

        @keyframes toastIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        /* RESPONSIVE */
        @media (max-width: 1200px) {
          .dn-admin-metrics { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 900px) {
          .dn-admin-sidebar { display: none; }
          .dn-admin-main { margin-left: 0; padding: 90px 16px 40px; }
          .dn-people-grid-2col { grid-template-columns: 1fr; }
          .dn-panel-row.three-col { grid-template-columns: 1fr; }
          .dn-panel-row.two-col { grid-template-columns: 1fr; }
        }

        @media (max-width: 640px) {
          .dn-admin-metrics { grid-template-columns: 1fr 1fr; }
          .dn-products-grid { grid-template-columns: 1fr 1fr; }
          .dn-admin-topbar { flex-direction: column; }
        }

        @media (max-width: 480px) {
          .dn-admin-metrics { grid-template-columns: 1fr; }
          .dn-products-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
