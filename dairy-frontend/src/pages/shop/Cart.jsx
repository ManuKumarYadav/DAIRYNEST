import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaMinus,
  FaPlus,
  FaRupeeSign,
  FaShoppingCart,
  FaSnowflake,
  FaTrash,
  FaTruck,
} from "react-icons/fa";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(saved);
  }, []);

  const updateCart = (updated) => {
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const increaseQty = (index) => {
    const updated = [...cart];
    updated[index].quantity += 1;
    updateCart(updated);
  };

  const decreaseQty = (index) => {
    const updated = [...cart];
    if (updated[index].quantity > 1) updated[index].quantity -= 1;
    updateCart(updated);
  };

  const removeItem = (index) => {
    updateCart(cart.filter((_, itemIndex) => itemIndex !== index));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const getImage = (item) => {
    if (!item.image) return "https://via.placeholder.com/220?text=DairyNest";
    if (item.image.startsWith("http")) return item.image;
    return `${process.env.REACT_APP_API_URL}${item.image}`;
  };

  return (
    <main style={styles.page}>
      <section style={styles.container}>
        <div style={styles.left}>
          <div style={styles.hero}>
            <span style={styles.eyebrow}>
              <FaShoppingCart />
              Premium Cart
            </span>
            <h1 style={styles.heading}>Shopping Cart [{cart.length}]</h1>
            <p style={styles.subtitle}>
              Review your fresh DairyNest products before delivery checkout.
            </p>
          </div>

          {cart.length === 0 ? (
            <div style={styles.emptyCard}>
              <FaShoppingCart />
              <h2>Your Cart is Empty</h2>
              <p>Add premium dairy products to continue shopping.</p>
              <button style={styles.shopBtn} onClick={() => navigate("/shop")}>
                Continue Shopping
              </button>
            </div>
          ) : (
            cart.map((item, index) => (
              <article key={`${item._id}-${index}`} style={styles.cartCard}>
                <img src={getImage(item)} alt={item.name} style={styles.image} />

                <div style={styles.cartDetails}>
                  <span style={styles.itemBadge}>
                    <FaSnowflake />
                    Cold packed
                  </span>
                  <h3 style={styles.itemName}>{item.name}</h3>
                  <p style={styles.itemDesc}>Farm fresh dairy product prepared for delivery.</p>
                  <strong style={styles.mainPrice}>
                    <FaRupeeSign />
                    {item.price}
                  </strong>
                </div>

                <div style={styles.qtyPanel}>
                  <div style={styles.qtyRow}>
                    <button style={styles.qtyBtn} onClick={() => decreaseQty(index)} aria-label="Decrease quantity">
                      <FaMinus />
                    </button>
                    <span style={styles.qtyNum}>{item.quantity}</span>
                    <button style={styles.qtyBtn} onClick={() => increaseQty(index)} aria-label="Increase quantity">
                      <FaPlus />
                    </button>
                  </div>
                  <strong style={styles.itemTotal}>
                    <FaRupeeSign />
                    {item.price * item.quantity}
                  </strong>
                  <button style={styles.removeBtn} onClick={() => removeItem(index)}>
                    <FaTrash />
                    Remove
                  </button>
                </div>
              </article>
            ))
          )}
        </div>

        <aside style={styles.summary}>
          <span style={styles.summaryIcon}>
            <FaTruck />
          </span>
          <h2 style={styles.summaryTitle}>Order Summary</h2>
          <SummaryRow label="Items" value={cart.length} />
          <SummaryRow label="Subtotal" value={`Rs ${total}`} />
          <SummaryRow label="Delivery" value="FREE" tone="green" />
          <SummaryRow label="GST" value="Rs 0" />
          <div style={styles.divider}></div>
          <div style={styles.finalRow}>
            <span>Total</span>
            <strong>Rs {total}</strong>
          </div>
          <button style={styles.checkoutBtn} onClick={() => navigate("/address")} disabled={cart.length === 0}>
            Proceed To Checkout
            <FaArrowRight />
          </button>
        </aside>
      </section>
    </main>
  );
};

const SummaryRow = ({ label, value, tone }) => (
  <div style={styles.summaryRow}>
    <span>{label}</span>
    <strong style={tone === "green" ? styles.greenText : undefined}>{value}</strong>
  </div>
);

export default Cart;

const styles = {
  page: {
    minHeight: "100vh",
    padding: "122px clamp(16px, 4vw, 42px) 54px",
    color: "#10233f",
    background:
      "radial-gradient(circle at 82% 12%, rgba(255,212,59,0.28), transparent 22rem), radial-gradient(circle at 12% 22%, rgba(8,120,184,0.18), transparent 24rem), linear-gradient(90deg, rgba(23,82,170,0.06) 1px, transparent 1px), linear-gradient(rgba(23,82,170,0.06) 1px, transparent 1px), linear-gradient(135deg,#ffffff 0%,#e8f6ff 45%,#fff7d9 100%)",
    backgroundSize: "auto, auto, 46px 46px, 46px 46px, auto",
  },
  container: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) minmax(310px, 390px)",
    gap: 22,
    maxWidth: 1220,
    margin: "0 auto",
  },
  left: {
    minWidth: 0,
  },
  hero: {
    marginBottom: 22,
    padding: 28,
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
    fontSize: "clamp(34px, 5vw, 56px)",
    lineHeight: 1.04,
    fontWeight: 900,
  },
  subtitle: {
    marginTop: 12,
    color: "#53667f",
    fontSize: 16,
    lineHeight: 1.6,
  },
  cartCard: {
    display: "grid",
    gridTemplateColumns: "130px minmax(0, 1fr) 190px",
    gap: 18,
    alignItems: "center",
    marginBottom: 16,
    padding: 18,
    border: "1px solid rgba(11,87,164,0.12)",
    borderRadius: 8,
    background: "rgba(255,255,255,0.94)",
    boxShadow: "0 24px 60px rgba(6,35,83,0.1)",
  },
  image: {
    width: 130,
    height: 130,
    objectFit: "cover",
    borderRadius: 8,
    background: "#eef5ff",
  },
  itemBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    minHeight: 30,
    padding: "0 10px",
    borderRadius: 999,
    color: "#166534",
    background: "#dcfce7",
    fontSize: 12,
    fontWeight: 900,
  },
  itemName: {
    marginTop: 10,
    color: "#10233f",
    fontSize: 24,
    fontWeight: 900,
    lineHeight: 1.15,
    wordBreak: "break-word",
  },
  itemDesc: {
    marginTop: 6,
    color: "#53667f",
    fontSize: 13,
    fontWeight: 800,
    lineHeight: 1.45,
  },
  mainPrice: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    marginTop: 10,
    color: "#0b57a4",
    fontSize: 24,
    fontWeight: 900,
  },
  qtyPanel: {
    display: "grid",
    justifyItems: "end",
    gap: 12,
  },
  qtyRow: {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
  },
  qtyBtn: {
    display: "grid",
    width: 38,
    height: 38,
    placeItems: "center",
    border: 0,
    borderRadius: 8,
    color: "#fff",
    background: "#0b57a4",
    cursor: "pointer",
  },
  qtyNum: {
    minWidth: 28,
    color: "#10233f",
    fontSize: 20,
    fontWeight: 900,
    textAlign: "center",
  },
  itemTotal: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    color: "#0b3f8a",
    fontSize: 24,
    fontWeight: 900,
  },
  removeBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    minHeight: 38,
    padding: "0 12px",
    border: 0,
    borderRadius: 8,
    color: "#fff",
    background: "#dc2626",
    fontSize: 13,
    fontWeight: 900,
    cursor: "pointer",
  },
  summary: {
    position: "sticky",
    top: 108,
    alignSelf: "start",
    padding: 24,
    border: "1px solid rgba(11,87,164,0.12)",
    borderRadius: 8,
    background: "linear-gradient(145deg, rgba(11,63,138,0.98), rgba(8,120,184,0.92))",
    color: "#fff",
    boxShadow: "0 30px 90px rgba(6,35,83,0.18)",
  },
  summaryIcon: {
    display: "grid",
    width: 50,
    height: 50,
    placeItems: "center",
    borderRadius: 8,
    color: "#0b3f8a",
    background: "#ffd43b",
    fontSize: 20,
  },
  summaryTitle: {
    marginTop: 18,
    fontSize: 30,
    fontWeight: 900,
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 14,
    marginTop: 18,
    color: "#dfeeff",
    fontSize: 15,
    fontWeight: 800,
  },
  greenText: {
    color: "#bbf7d0",
  },
  divider: {
    height: 1,
    margin: "22px 0",
    background: "rgba(255,255,255,0.18)",
  },
  finalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 14,
    fontSize: 22,
    fontWeight: 900,
  },
  checkoutBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    width: "100%",
    minHeight: 54,
    marginTop: 24,
    border: 0,
    borderRadius: 8,
    color: "#0b3f8a",
    background: "#ffd43b",
    fontSize: 15,
    fontWeight: 900,
    cursor: "pointer",
  },
  shopBtn: {
    minHeight: 48,
    padding: "0 18px",
    border: 0,
    borderRadius: 8,
    color: "#fff",
    background: "linear-gradient(135deg,#0b57a4,#0878b8)",
    fontSize: 14,
    fontWeight: 900,
    cursor: "pointer",
  },
  emptyCard: {
    display: "grid",
    placeItems: "center",
    minHeight: 320,
    padding: 30,
    border: "1px solid rgba(11,87,164,0.12)",
    borderRadius: 8,
    background: "rgba(255,255,255,0.9)",
    color: "#0b3f8a",
    textAlign: "center",
    boxShadow: "0 24px 60px rgba(6,35,83,0.1)",
  },
};
