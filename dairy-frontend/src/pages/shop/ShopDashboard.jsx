import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaBoxOpen,
  FaCartPlus,
  FaCheckCircle,
  FaLeaf,
  FaRupeeSign,
  FaShoppingBasket,
  FaSnowflake,
  FaTruck,
} from "react-icons/fa";

const ShopDashboard = ({ setCart }) => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/products`);
      const data = await res.json();

      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
      setProducts([]);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((item) => item._id === product._id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image || "",
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    if (setCart) setCart(cart);
    alert(product.name + " added to Cart");
  };

  const metrics = [
    { label: "Fresh Products", value: products.length, icon: <FaBoxOpen /> },
    { label: "Cold Packed", value: "100%", icon: <FaSnowflake /> },
    { label: "Morning Delivery", value: "7 AM", icon: <FaTruck /> },
  ];

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div>
          <span style={styles.eyebrow}>
            <FaLeaf />
            DairyNest Shop
          </span>
          <h1 style={styles.heading}>Premium dairy products for your daily counter.</h1>
          <p style={styles.subtitle}>
            Order fresh milk, paneer, curd, ghee, lassi, and ice cream with
            clean packing and reliable morning dispatch.
          </p>
        </div>

        <div style={styles.heroPanel}>
          <FaShoppingBasket style={styles.heroPanelIcon} />
          <strong>Shop-ready dairy catalog</strong>
          <span>Fresh inventory, fair pricing, and easy checkout.</span>
          <button style={styles.cartJumpBtn} onClick={() => navigate("/cart")}>
            Open Cart
            <FaArrowRight />
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

      <section style={styles.grid}>
        {products.length === 0 ? (
          <div style={styles.emptyCard}>
            <FaBoxOpen />
            <h2>No Products Available</h2>
            <p>Fresh DairyNest products will appear here once admin adds them.</p>
          </div>
        ) : (
          products.map((product) => (
            <article key={product._id} style={styles.card}>
              <div style={styles.imageBox}>
                <img src={product.image || "https://via.placeholder.com/300?text=DairyNest"} alt={product.name} style={styles.image} />
                {product.discount > 0 && <span style={styles.discount}>{product.discount}% OFF</span>}
                <span style={styles.freshBadge}>
                  <FaCheckCircle />
                  Fresh
                </span>
              </div>

              <div style={styles.details}>
                <h2 style={styles.name}>{product.name}</h2>
                <p style={styles.desc}>Premium DairyNest dairy product for shop supply.</p>

                <div style={styles.priceRow}>
                  <strong style={styles.price}>
                    <FaRupeeSign />
                    {product.price}
                  </strong>
                  {product.originalPrice && <span style={styles.oldPrice}>Rs {product.originalPrice}</span>}
                </div>

                <p style={{ ...styles.stock, ...(product.stock === 0 ? styles.outStock : {}) }}>
                  {product.stock === 0 ? "Out of Stock" : `Stock: ${product.stock}`}
                </p>

                <div style={styles.btnRow}>
                  <button
                    style={{ ...styles.cartBtn, opacity: product.stock === 0 ? 0.5 : 1 }}
                    disabled={product.stock === 0}
                    onClick={() => addToCart(product)}
                  >
                    <FaCartPlus />
                    Add Cart
                  </button>
                  <button style={styles.buyBtn} onClick={() => navigate("/cart")}>
                    Buy Now
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
};

export default ShopDashboard;

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
    gap: 24,
    alignItems: "center",
    maxWidth: 1220,
    margin: "0 auto 24px",
    padding: 30,
    border: "1px solid rgba(11,87,164,0.14)",
    borderRadius: 8,
    background: "linear-gradient(135deg, rgba(255,255,255,0.94), rgba(240,247,255,0.9))",
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
  subtitle: {
    maxWidth: 720,
    marginTop: 14,
    color: "#53667f",
    fontSize: 17,
    lineHeight: 1.65,
  },
  heroPanel: {
    display: "grid",
    gap: 10,
    padding: 24,
    borderRadius: 8,
    color: "#fff",
    background: "linear-gradient(145deg, rgba(11,63,138,0.98), rgba(8,120,184,0.92))",
    boxShadow: "0 24px 60px rgba(11,63,138,0.22)",
  },
  heroPanelIcon: {
    width: 50,
    height: 50,
    padding: 13,
    borderRadius: 8,
    color: "#0b3f8a",
    background: "#ffd43b",
  },
  cartJumpBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    minHeight: 50,
    marginTop: 10,
    border: 0,
    borderRadius: 8,
    color: "#0b3f8a",
    background: "#ffd43b",
    fontSize: 15,
    fontWeight: 900,
    cursor: "pointer",
  },
  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 14,
    maxWidth: 1220,
    margin: "0 auto 24px",
  },
  metricCard: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    minHeight: 112,
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
    fontSize: 28,
    lineHeight: 1,
    fontWeight: 900,
  },
  metricLabel: {
    marginTop: 7,
    color: "#53667f",
    fontSize: 13,
    fontWeight: 800,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))",
    gap: 18,
    maxWidth: 1220,
    margin: "0 auto",
  },
  card: {
    overflow: "hidden",
    border: "1px solid rgba(11,87,164,0.12)",
    borderRadius: 8,
    background: "#fff",
    boxShadow: "0 24px 60px rgba(6,35,83,0.1)",
  },
  imageBox: {
    position: "relative",
    height: 235,
    background: "#eef5ff",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  discount: {
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
  freshBadge: {
    position: "absolute",
    right: 12,
    bottom: 12,
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    minHeight: 34,
    padding: "0 11px",
    borderRadius: 999,
    color: "#166534",
    background: "#dcfce7",
    fontSize: 12,
    fontWeight: 900,
  },
  details: {
    padding: 18,
  },
  name: {
    color: "#10233f",
    fontSize: 22,
    fontWeight: 900,
    lineHeight: 1.2,
    wordBreak: "break-word",
  },
  desc: {
    marginTop: 8,
    color: "#53667f",
    fontSize: 13,
    fontWeight: 800,
    lineHeight: 1.45,
  },
  priceRow: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 14,
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
    fontSize: 14,
    fontWeight: 800,
    textDecoration: "line-through",
  },
  stock: {
    marginTop: 10,
    color: "#166534",
    fontSize: 13,
    fontWeight: 900,
  },
  outStock: {
    color: "#991b1b",
  },
  btnRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
    marginTop: 16,
  },
  cartBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: 46,
    border: 0,
    borderRadius: 8,
    color: "#0b3f8a",
    background: "#ffd43b",
    fontSize: 14,
    fontWeight: 900,
    cursor: "pointer",
  },
  buyBtn: {
    minHeight: 46,
    border: 0,
    borderRadius: 8,
    color: "#fff",
    background: "linear-gradient(135deg,#0b57a4,#0878b8)",
    fontSize: 14,
    fontWeight: 900,
    cursor: "pointer",
  },
  emptyCard: {
    gridColumn: "1 / -1",
    display: "grid",
    placeItems: "center",
    minHeight: 300,
    padding: 30,
    border: "1px solid rgba(11,87,164,0.12)",
    borderRadius: 8,
    background: "rgba(255,255,255,0.9)",
    color: "#0b3f8a",
    textAlign: "center",
    boxShadow: "0 24px 60px rgba(6,35,83,0.1)",
  },
};
