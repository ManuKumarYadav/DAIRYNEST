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
import { getImageUrl } from "../../api/config";
import BackButton from "../../components/BackButton";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(saved);
    } catch (e) {
      setCart([]);
    }
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
    if (!item || !item.image) return "https://via.placeholder.com/220?text=DairyNest";
    return getImageUrl(item.image);
  };

  const handleProceedToCheckout = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        alert("Please login or create an account to proceed with your DairyNest order.");
        sessionStorage.setItem("openAuth", "true");
        navigate("/");
        return;
      }
      navigate("/address");
    } catch (e) {
      navigate("/");
    }
  };

  return (
    <main className="dn-cart-page" style={styles.page}>
      <div style={{ maxWidth: "1220px", margin: "0 auto", padding: "0 clamp(12px, 4vw, 42px)" }}>
        <BackButton to="/" label="Continue Shopping" />
      </div>
      <section className="dn-cart-container">
        <div className="dn-cart-left">
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
              <FaShoppingCart style={{ fontSize: 48, color: "#0b57a4", marginBottom: 16 }} />
              <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 8 }}>Your Cart is Empty</h2>
              <p style={{ color: "#53667f", marginBottom: 20 }}>Add premium dairy products to continue shopping.</p>
              <button style={styles.shopBtn} onClick={() => navigate("/shop")}>
                Continue Shopping
              </button>
            </div>
          ) : (
            cart.map((item, index) => (
              <article key={`${item._id}-${index}`} className="dn-cart-card">
                <img
                  src={getImage(item)}
                  alt={item.name}
                  className="dn-cart-img"
                />

                <div className="dn-cart-details">
                  <span style={styles.itemBadge}>
                    <FaSnowflake />
                    Cold packed
                  </span>
                  <h3 style={styles.itemName}>{item.name}</h3>
                  <p style={styles.itemDesc}>
                    Farm fresh dairy product prepared for delivery.
                  </p>
                  <strong style={styles.mainPrice}>
                    <FaRupeeSign />
                    {item.price}
                  </strong>
                </div>

                <div className="dn-qty-panel">
                  <div style={styles.qtyRow}>
                    <button
                      style={styles.qtyBtn}
                      onClick={() => decreaseQty(index)}
                      aria-label="Decrease quantity"
                    >
                      <FaMinus />
                    </button>
                    <span style={styles.qtyNum}>{item.quantity}</span>
                    <button
                      style={styles.qtyBtn}
                      onClick={() => increaseQty(index)}
                      aria-label="Increase quantity"
                    >
                      <FaPlus />
                    </button>
                  </div>
                  <strong style={styles.itemTotal}>
                    <FaRupeeSign />
                    {item.price * item.quantity}
                  </strong>
                  <button
                    style={styles.removeBtn}
                    onClick={() => removeItem(index)}
                  >
                    <FaTrash />
                    Remove
                  </button>
                </div>
              </article>
            ))
          )}
        </div>

        <aside className="dn-cart-summary">
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
          <button
            style={styles.checkoutBtn}
            onClick={handleProceedToCheckout}
            disabled={cart.length === 0}
          >
            Proceed To Checkout
            <FaArrowRight />
          </button>
        </aside>
      </section>

      <style>{`
        .dn-cart-page {
          min-height: 100vh;
          padding: 110px clamp(12px, 4vw, 42px) 54px;
          color: #10233f;
        }

        .dn-cart-container {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 360px;
          gap: 24px;
          max-width: 1220px;
          margin: 0 auto;
        }

        .dn-cart-left {
          min-width: 0;
        }

        .dn-cart-card {
          display: grid;
          grid-template-columns: 120px minmax(0, 1fr) auto;
          gap: 18px;
          align-items: center;
          margin-bottom: 16px;
          padding: 18px;
          border: 1px solid rgba(11,87,164,0.12);
          border-radius: 12px;
          background: rgba(255,255,255,0.96);
          box-shadow: 0 16px 40px rgba(6,35,83,0.08);
        }

        .dn-cart-img {
          width: 120px;
          height: 120px;
          object-fit: cover;
          border-radius: 10px;
          background: #eef5ff;
        }

        .dn-cart-details {
          min-width: 0;
        }

        .dn-qty-panel {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 10px;
          min-width: 140px;
        }

        .dn-cart-summary {
          position: sticky;
          top: 100px;
          align-self: start;
          padding: 24px;
          border: 1px solid rgba(11,87,164,0.12);
          border-radius: 14px;
          background: linear-gradient(145deg, rgba(11,63,138,0.98), rgba(8,120,184,0.92));
          color: #fff;
          box-shadow: 0 24px 60px rgba(6,35,83,0.18);
        }

        /* ── Tablet (<= 980px) ── */
        @media (max-width: 980px) {
          .dn-cart-container {
            grid-template-columns: 1fr;
          }
          .dn-cart-summary {
            position: static;
            top: auto;
          }
        }

        /* ── Mobile (<= 640px) ── */
        @media (max-width: 640px) {
          .dn-cart-page {
            padding: 85px 12px 36px;
          }

          .dn-cart-card {
            grid-template-columns: 90px minmax(0, 1fr);
            gap: 12px;
            padding: 14px;
          }

          .dn-cart-img {
            width: 90px;
            height: 90px;
          }

          .dn-qty-panel {
            grid-column: 1 / -1;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            padding-top: 12px;
            border-top: 1px dashed rgba(11,87,164,0.12);
            margin-top: 4px;
          }
        }

        /* ── Small Mobile (<= 400px) ── */
        @media (max-width: 400px) {
          .dn-cart-card {
            grid-template-columns: 1fr;
          }
          .dn-cart-img {
            width: 100%;
            height: 160px;
          }
        }
      `}</style>
    </main>
  );
};

const SummaryRow = ({ label, value, tone }) => (
  <div style={styles.summaryRow}>
    <span>{label}</span>
    <strong style={tone === "green" ? styles.greenText : undefined}>
      {value}
    </strong>
  </div>
);

export default Cart;

const styles = {
  page: {
    background:
      "radial-gradient(circle at 82% 12%, rgba(255,212,59,0.28), transparent 22rem), radial-gradient(circle at 12% 22%, rgba(8,120,184,0.18), transparent 24rem), linear-gradient(90deg, rgba(23,82,170,0.06) 1px, transparent 1px), linear-gradient(rgba(23,82,170,0.06) 1px, transparent 1px), linear-gradient(135deg,#ffffff 0%,#e8f6ff 45%,#fff7d9 100%)",
    backgroundSize: "auto, auto, 46px 46px, 46px 46px, auto",
  },
  hero: {
    marginBottom: 20,
    padding: "clamp(16px, 3vw, 26px)",
    border: "1px solid rgba(11,87,164,0.14)",
    borderRadius: 12,
    background:
      "linear-gradient(135deg, rgba(255,255,255,0.94), rgba(240,247,255,0.9))",
    boxShadow: "0 20px 60px rgba(6,35,83,0.08)",
  },
  eyebrow: {
    display: "inline-flex",
    alignItems: "center",
    gap: 9,
    minHeight: 34,
    padding: "6px 12px",
    borderRadius: 999,
    color: "#0b57a4",
    background: "#fff2a8",
    fontSize: 12,
    fontWeight: 900,
  },
  heading: {
    marginTop: 12,
    color: "#0b3f8a",
    fontSize: "clamp(26px, 4vw, 44px)",
    lineHeight: 1.1,
    fontWeight: 900,
  },
  subtitle: {
    marginTop: 8,
    color: "#53667f",
    fontSize: 14,
    lineHeight: 1.5,
  },
  itemBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    minHeight: 26,
    padding: "0 8px",
    borderRadius: 999,
    color: "#166534",
    background: "#dcfce7",
    fontSize: 11,
    fontWeight: 900,
  },
  itemName: {
    marginTop: 6,
    color: "#10233f",
    fontSize: "clamp(17px, 2.5vw, 22px)",
    fontWeight: 900,
    lineHeight: 1.2,
    wordBreak: "break-word",
  },
  itemDesc: {
    marginTop: 4,
    color: "#53667f",
    fontSize: 12,
    fontWeight: 700,
    lineHeight: 1.4,
  },
  mainPrice: {
    display: "inline-flex",
    alignItems: "center",
    gap: 3,
    marginTop: 8,
    color: "#0b57a4",
    fontSize: 20,
    fontWeight: 900,
  },
  qtyRow: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  },
  qtyBtn: {
    display: "grid",
    width: 34,
    height: 34,
    placeItems: "center",
    border: 0,
    borderRadius: 8,
    color: "#fff",
    background: "#0b57a4",
    cursor: "pointer",
    fontSize: 12,
  },
  qtyNum: {
    minWidth: 24,
    color: "#10233f",
    fontSize: 17,
    fontWeight: 900,
    textAlign: "center",
  },
  itemTotal: {
    display: "inline-flex",
    alignItems: "center",
    gap: 3,
    color: "#0b3f8a",
    fontSize: 20,
    fontWeight: 900,
  },
  removeBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    minHeight: 34,
    padding: "0 10px",
    border: 0,
    borderRadius: 8,
    color: "#fff",
    background: "#dc2626",
    fontSize: 12,
    fontWeight: 900,
    cursor: "pointer",
  },
  summaryIcon: {
    display: "grid",
    width: 44,
    height: 44,
    placeItems: "center",
    borderRadius: 8,
    color: "#0b3f8a",
    background: "#ffd43b",
    fontSize: 18,
  },
  summaryTitle: {
    marginTop: 14,
    fontSize: 24,
    fontWeight: 900,
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 14,
    marginTop: 14,
    color: "#dfeeff",
    fontSize: 14,
    fontWeight: 800,
  },
  greenText: {
    color: "#bbf7d0",
  },
  divider: {
    height: 1,
    margin: "18px 0",
    background: "rgba(255,255,255,0.18)",
  },
  finalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 14,
    fontSize: 20,
    fontWeight: 900,
  },
  checkoutBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    width: "100%",
    minHeight: 50,
    marginTop: 20,
    border: 0,
    borderRadius: 10,
    color: "#0b3f8a",
    background: "#ffd43b",
    fontSize: 15,
    fontWeight: 900,
    cursor: "pointer",
    boxShadow: "0 12px 28px rgba(255,212,59,0.25)",
  },
  shopBtn: {
    minHeight: 44,
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
    minHeight: 280,
    padding: 24,
    border: "1px solid rgba(11,87,164,0.12)",
    borderRadius: 12,
    background: "rgba(255,255,255,0.9)",
    color: "#0b3f8a",
    textAlign: "center",
    boxShadow: "0 18px 40px rgba(6,35,83,0.08)",
  },
};
