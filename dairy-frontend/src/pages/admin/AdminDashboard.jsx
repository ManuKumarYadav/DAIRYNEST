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
} from "react-icons/fa";

const API_BASE = "https://dairy-backend4.onrender.com";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [farmers, setFarmers] = useState([]);
  const [staff, setStaff] = useState([]);
  const [products, setProducts] = useState([]);

  const [farmerForm, setFarmerForm] = useState({ name: "", village: "" });
  const [staffForm, setStaffForm] = useState({ name: "", email: "", password: "" });
  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    originalPrice: "",
    discount: "",
    image: null,
  });

  const token = localStorage.getItem("token");

  const fetchAll = useCallback(async () => {
    try {
      const [fRes, sRes, pRes] = await Promise.all([
        fetch(`${API_BASE}/api/farmers`, {
          headers: { Authorization: "Bearer " + token },
        }),
        fetch(`${API_BASE}/api/users/staff`, {
          headers: { Authorization: "Bearer " + token },
        }),
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

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const addProduct = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", productForm.name);
    formData.append("price", productForm.price);
    formData.append("originalPrice", productForm.originalPrice);
    formData.append("discount", productForm.discount);
    formData.append("image", productForm.image);

    await fetch(`${API_BASE}/api/products`, {
      method: "POST",
      headers: { Authorization: "Bearer " + token },
      body: formData,
    });

    setProductForm({ name: "", price: "", originalPrice: "", discount: "", image: null });
    fetchAll();
  };

  const addStaff = async (e) => {
    e.preventDefault();

    await fetch(`${API_BASE}/api/users/staff`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(staffForm),
    });

    setStaffForm({ name: "", email: "", password: "" });
    fetchAll();
  };

  const addFarmer = async (e) => {
    e.preventDefault();

    await fetch(`${API_BASE}/api/farmers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(farmerForm),
    });

    setFarmerForm({ name: "", village: "" });
    fetchAll();
  };

  const deleteProduct = async (id) => {
    await fetch(`${API_BASE}/api/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    });

    fetchAll();
  };

  const deleteFarmer = async (id) => {
    await fetch(`${API_BASE}/api/farmers/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    });

    fetchAll();
  };

  const deleteStaff = async (id) => {
    await fetch(`${API_BASE}/api/users/staff/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    });

    fetchAll();
  };

  const metrics = [
    { label: "Products", value: products.length, icon: <FaBoxOpen /> },
    { label: "Farmers", value: farmers.length, icon: <FaSeedling /> },
    { label: "Staff", value: staff.length, icon: <FaUsers /> },
    { label: "Route Ready", value: "7 AM", icon: <FaTruck /> },
  ];

  const controlPoints = ["Catalog pricing", "Farmer supply", "Staff dispatch"];

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div>
          <span style={styles.eyebrow}>
            <FaChartLine />
            Admin Control Center
          </span>
          <h1 style={styles.title}>DairyNest Admin Dashboard</h1>
          <p style={styles.subtitle}>
            Manage dairy products, farmers, staff, pricing, images, and fresh
            delivery operations from one clean workspace.
          </p>
        </div>

        <div style={styles.heroPanel}>
          <div style={styles.heroPanelTop}>
            <span style={styles.heroPanelIcon}>
              <FaTruck />
            </span>
            <div>
              <strong style={styles.heroPanelTitle}>Morning Operations</strong>
              <p style={styles.heroPanelText}>Products, partners, and delivery teams ready for dispatch.</p>
            </div>
          </div>
          <div style={styles.controlList}>
            {controlPoints.map((item) => (
              <span style={styles.controlPill} key={item}>{item}</span>
            ))}
          </div>
          <button style={styles.orderBtn} onClick={() => navigate("/admin/orders")}>
            <FaTruck />
            View Orders
          </button>
        </div>
      </section>

      <section style={styles.metricsGrid}>
        {metrics.map((item) => (
          <article style={styles.metricCard} key={item.label}>
            <span style={styles.metricIcon}>{item.icon}</span>
            <div>
              <strong style={styles.metricValue}>{item.value}</strong>
              <p style={styles.metricLabel}>{item.label}</p>
            </div>
          </article>
        ))}
      </section>

      <section style={styles.formGrid}>
        <form onSubmit={addProduct} style={styles.formCard}>
          <div style={styles.formHeading}>
            <span style={styles.formIcon}><FaBoxOpen /></span>
            <h2 style={styles.cardTitle}>Add Dairy Product</h2>
          </div>
          <input style={styles.input} placeholder="Product Name" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} />
          <input style={styles.input} placeholder="Price" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} />
          <input style={styles.input} placeholder="Original Price" value={productForm.originalPrice} onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })} />
          <input style={styles.input} placeholder="Discount" value={productForm.discount} onChange={(e) => setProductForm({ ...productForm, discount: e.target.value })} />
          <label style={styles.fileInput}>
            <FaImage />
            <span>{productForm.image?.name || "Upload product image"}</span>
            <input type="file" style={styles.hiddenFile} onChange={(e) => setProductForm({ ...productForm, image: e.target.files[0] })} />
          </label>
          <button style={styles.primaryBtn}>Add Product</button>
        </form>

        <form onSubmit={addStaff} style={styles.formCard}>
          <div style={styles.formHeading}>
            <span style={styles.formIcon}><FaUsers /></span>
            <h2 style={styles.cardTitle}>Add Staff Member</h2>
          </div>
          <input style={styles.input} placeholder="Staff Name" value={staffForm.name} onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })} />
          <input style={styles.input} placeholder="Email" value={staffForm.email} onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })} />
          <input type="password" style={styles.input} placeholder="Password" value={staffForm.password} onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })} />
          <button style={styles.yellowBtn}>
            <FaUserPlus />
            Add Staff
          </button>
        </form>

        <form onSubmit={addFarmer} style={styles.formCard}>
          <div style={styles.formHeading}>
            <span style={styles.formIcon}><FaSeedling /></span>
            <h2 style={styles.cardTitle}>Add Farmer Partner</h2>
          </div>
          <input style={styles.input} placeholder="Farmer Name" value={farmerForm.name} onChange={(e) => setFarmerForm({ ...farmerForm, name: e.target.value })} />
          <input style={styles.input} placeholder="Village" value={farmerForm.village} onChange={(e) => setFarmerForm({ ...farmerForm, village: e.target.value })} />
          <button style={styles.greenBtn}>
            <FaSeedling />
            Add Farmer
          </button>
        </form>
      </section>

      <SectionTitle title="Dairy Product Catalog" subtitle="Keep product pricing, image, discount, and stock visible." />
      <section style={styles.productGrid}>
        {products.map((p) => (
          <article key={p._id} style={styles.productCard}>
            <div style={styles.imageBox}>
              <img src={p.image || "https://via.placeholder.com/300x220?text=DairyNest"} alt={p.name} style={styles.image} />
              <span style={styles.discountBadge}>{p.discount || 0}% OFF</span>
            </div>
            <div style={styles.productBody}>
              <h3 style={styles.productName}>{p.name}</h3>
              <div style={styles.priceRow}>
                <strong style={styles.price}>
                  <FaRupeeSign />
                  {p.price}
                </strong>
                <span style={styles.oldPrice}>Rs {p.originalPrice}</span>
              </div>
              <p style={styles.stock}>Stock: {p.stock || 0}</p>
              <button style={styles.deleteBtn} onClick={() => deleteProduct(p._id)}>
                <FaTrash />
                Delete Product
              </button>
            </div>
          </article>
        ))}
      </section>

      <SectionTitle title="Farmer Partners" subtitle="Trusted farm partners supplying fresh milk base." />
      <section style={styles.peopleGrid}>
        {farmers.map((f) => (
          <PeopleCard key={f._id} name={f.name} detail={f.village} icon={<FaSeedling />} onDelete={() => deleteFarmer(f._id)} />
        ))}
      </section>

      <SectionTitle title="Staff Members" subtitle="DairyNest operations and delivery management team." />
      <section style={styles.peopleGrid}>
        {staff.map((s) => (
          <PeopleCard key={s._id} name={s.name} detail={s.email} icon={<FaStore />} onDelete={() => deleteStaff(s._id)} />
        ))}
      </section>
    </main>
  );
};

const SectionTitle = ({ title, subtitle }) => (
  <div style={styles.sectionHeader}>
    <h2 style={styles.sectionTitle}>{title}</h2>
    <p style={styles.sectionSubtitle}>{subtitle}</p>
  </div>
);

const PeopleCard = ({ name, detail, icon, onDelete }) => (
  <article style={styles.peopleCard}>
    <span style={styles.peopleAvatar}>{icon}</span>
    <div style={styles.peopleBody}>
      <h3 style={styles.peopleName}>{name}</h3>
      <p style={styles.peopleInfo}>{detail}</p>
    </div>
    <button style={styles.deleteSmall} onClick={onDelete}>
      <FaTrash />
      Delete
    </button>
  </article>
);

export default AdminDashboard;

const styles = {
  page: {
    minHeight: "100vh",
    padding: "122px clamp(16px, 4vw, 42px) 54px",
    color: "#10233f",
    background:
      "radial-gradient(circle at 82% 12%, rgba(255,212,59,0.28), transparent 22rem), radial-gradient(circle at 12% 22%, rgba(8,120,184,0.18), transparent 24rem), linear-gradient(90deg, rgba(23,82,170,0.06) 1px, transparent 1px), linear-gradient(rgba(23,82,170,0.06) 1px, transparent 1px), linear-gradient(135deg,#ffffff 0%,#e8f6ff 45%,#fff7d9 100%)",
    backgroundSize: "auto, auto, 46px 46px, 46px 46px, auto",
  },
  hero: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 360px), 1fr))",
    alignItems: "center",
    gap: 24,
    maxWidth: 1220,
    margin: "0 auto 28px",
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
  title: {
    marginTop: 16,
    color: "#0b3f8a",
    fontSize: "clamp(34px, 5vw, 58px)",
    lineHeight: 1.04,
    fontWeight: 900,
  },
  subtitle: {
    maxWidth: 720,
    marginTop: 14,
    color: "#53667f",
    fontSize: 17,
    lineHeight: 1.65,
  },
  heroPanel: {
    minHeight: 245,
    padding: 22,
    borderRadius: 8,
    color: "#fff",
    background:
      "linear-gradient(145deg, rgba(11,63,138,0.98), rgba(8,120,184,0.92))",
    boxShadow: "0 24px 60px rgba(11,63,138,0.22)",
  },
  heroPanelTop: {
    display: "flex",
    alignItems: "flex-start",
    gap: 14,
  },
  heroPanelIcon: {
    display: "grid",
    width: 52,
    height: 52,
    placeItems: "center",
    flex: "0 0 auto",
    borderRadius: 8,
    color: "#0b3f8a",
    background: "#ffd43b",
    fontSize: 20,
  },
  heroPanelTitle: {
    display: "block",
    fontSize: 24,
    fontWeight: 900,
    lineHeight: 1.1,
  },
  heroPanelText: {
    marginTop: 8,
    color: "#dfeeff",
    fontSize: 14,
    lineHeight: 1.55,
    fontWeight: 700,
  },
  controlList: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 8,
    marginTop: 24,
  },
  controlPill: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
    padding: "8px 10px",
    border: "1px solid rgba(255,255,255,0.18)",
    borderRadius: 8,
    color: "#fff",
    background: "rgba(255,255,255,0.12)",
    fontSize: 12,
    fontWeight: 900,
    textAlign: "center",
  },
  orderBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    width: "100%",
    minHeight: 52,
    marginTop: 18,
    padding: "0 22px",
    border: 0,
    borderRadius: 8,
    color: "#0b3f8a",
    background: "#ffd43b",
    fontSize: 15,
    fontWeight: 900,
    cursor: "pointer",
    boxShadow: "0 18px 36px rgba(255,212,59,0.24)",
  },
  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
    gap: 14,
    maxWidth: 1220,
    margin: "0 auto 26px",
  },
  metricCard: {
    position: "relative",
    overflow: "hidden",
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
  metricIcon: {
    display: "grid",
    width: 48,
    height: 48,
    placeItems: "center",
    borderRadius: 8,
    color: "#fff",
    background: "#0b57a4",
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
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 16,
    maxWidth: 1220,
    margin: "0 auto",
  },
  formCard: {
    position: "relative",
    overflow: "hidden",
    padding: 24,
    border: "1px solid rgba(11,87,164,0.12)",
    borderRadius: 8,
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,255,255,0.88))",
    boxShadow: "0 24px 60px rgba(6,35,83,0.1)",
  },
  formHeading: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 18,
  },
  formIcon: {
    display: "grid",
    width: 42,
    height: 42,
    placeItems: "center",
    borderRadius: 8,
    color: "#fff",
    background: "#0b57a4",
  },
  cardTitle: {
    margin: 0,
    color: "#10233f",
    fontSize: 22,
    fontWeight: 900,
  },
  input: {
    width: "100%",
    minHeight: 52,
    marginBottom: 12,
    padding: "0 15px",
    border: "1px solid rgba(11,87,164,0.16)",
    borderRadius: 8,
    outline: 0,
    color: "#10233f",
    background: "#fff",
    font: "inherit",
    fontSize: 15,
    fontWeight: 700,
  },
  fileInput: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    minHeight: 52,
    marginBottom: 12,
    padding: "0 15px",
    border: "1px solid rgba(11,87,164,0.16)",
    borderRadius: 8,
    color: "#53667f",
    background: "#fff",
    fontSize: 15,
    fontWeight: 800,
    cursor: "pointer",
  },
  hiddenFile: {
    display: "none",
  },
  primaryBtn: {
    width: "100%",
    minHeight: 52,
    border: 0,
    borderRadius: 8,
    color: "#fff",
    background: "linear-gradient(135deg,#0b57a4,#0878b8)",
    fontSize: 15,
    fontWeight: 900,
    cursor: "pointer",
  },
  yellowBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    width: "100%",
    minHeight: 52,
    border: 0,
    borderRadius: 8,
    color: "#0b3f8a",
    background: "#ffd43b",
    fontSize: 15,
    fontWeight: 900,
    cursor: "pointer",
  },
  greenBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    width: "100%",
    minHeight: 52,
    border: 0,
    borderRadius: 8,
    color: "#fff",
    background: "linear-gradient(135deg,#15803d,#0b8a6f)",
    fontSize: 15,
    fontWeight: 900,
    cursor: "pointer",
  },
  sectionHeader: {
    maxWidth: 1220,
    margin: "46px auto 18px",
  },
  sectionTitle: {
    color: "#0b3f8a",
    fontSize: "clamp(28px, 4vw, 42px)",
    fontWeight: 900,
  },
  sectionSubtitle: {
    marginTop: 8,
    color: "#53667f",
    fontSize: 15,
    lineHeight: 1.6,
  },
  productGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(245px, 1fr))",
    gap: 16,
    maxWidth: 1220,
    margin: "0 auto",
  },
  productCard: {
    overflow: "hidden",
    border: "1px solid rgba(11,87,164,0.12)",
    borderRadius: 8,
    background: "#fff",
    boxShadow: "0 24px 60px rgba(6,35,83,0.1)",
  },
  imageBox: {
    position: "relative",
    height: 210,
    background: "#eef5ff",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  discountBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    padding: "7px 11px",
    borderRadius: 8,
    color: "#0b3f8a",
    background: "#ffd43b",
    fontSize: 12,
    fontWeight: 900,
  },
  productBody: {
    padding: 18,
  },
  productName: {
    color: "#10233f",
    fontSize: 21,
    fontWeight: 900,
  },
  priceRow: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 12,
  },
  price: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    color: "#0b57a4",
    fontSize: 24,
    fontWeight: 900,
  },
  oldPrice: {
    color: "#8797ab",
    textDecoration: "line-through",
    fontSize: 14,
    fontWeight: 800,
  },
  stock: {
    marginTop: 10,
    color: "#53667f",
    fontSize: 14,
    fontWeight: 800,
  },
  deleteBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
    minHeight: 46,
    marginTop: 16,
    border: 0,
    borderRadius: 8,
    color: "#fff",
    background: "#dc2626",
    fontSize: 14,
    fontWeight: 900,
    cursor: "pointer",
  },
  peopleGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
    gap: 14,
    maxWidth: 1220,
    margin: "0 auto",
  },
  peopleCard: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: 18,
    border: "1px solid rgba(11,87,164,0.12)",
    borderRadius: 8,
    background: "rgba(255,255,255,0.92)",
    boxShadow: "0 24px 60px rgba(6,35,83,0.1)",
  },
  peopleAvatar: {
    display: "grid",
    width: 46,
    height: 46,
    placeItems: "center",
    flex: "0 0 auto",
    borderRadius: 8,
    color: "#fff",
    background: "#0b57a4",
  },
  peopleBody: {
    minWidth: 0,
    flex: "1 1 auto",
  },
  peopleName: {
    color: "#10233f",
    fontSize: 18,
    fontWeight: 900,
    wordBreak: "break-word",
  },
  peopleInfo: {
    marginTop: 4,
    color: "#53667f",
    fontSize: 13,
    fontWeight: 800,
    wordBreak: "break-word",
  },
  deleteSmall: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    minHeight: 40,
    padding: "0 12px",
    border: 0,
    borderRadius: 8,
    color: "#fff",
    background: "#dc2626",
    fontSize: 13,
    fontWeight: 900,
    cursor: "pointer",
  },
};
