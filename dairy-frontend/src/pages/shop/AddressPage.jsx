import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaClock,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaRoute,
  FaTruck,
  FaUser,
} from "react-icons/fa";

const AddressPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("address");

    if (saved && saved !== "undefined") {
      try {
        const parsed = JSON.parse(saved);
        if (parsed) setForm(parsed);
      } catch (err) {
        console.log(err);
      }
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleContinue = () => {
    if (!form.name || !form.phone || !form.address || !form.city || !form.pincode) {
      alert("Please fill all details");
      return;
    }

    localStorage.setItem("address", JSON.stringify(form));
    navigate("/payment");
  };

  return (
    <main style={styles.page}>
      <section style={styles.container}>
        <div style={styles.addressCard}>
          <span style={styles.eyebrow}>
            <FaMapMarkedAlt />
            Delivery Details
          </span>
          <h1 style={styles.heading}>Shipping Address</h1>
          <p style={styles.subtitle}>
            Add your delivery location so DairyNest can route fresh products to
            the right doorstep.
          </p>

          <div style={styles.formGrid}>
            <label style={styles.field}>
              <FaUser />
              <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} />
            </label>

            <label style={styles.field}>
              <FaPhoneAlt />
              <input type="text" name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} />
            </label>

            <label style={{ ...styles.field, ...styles.fullField }}>
              <FaMapMarkerAlt />
              <textarea name="address" placeholder="Street / Area" value={form.address} onChange={handleChange} />
            </label>

            <label style={styles.field}>
              <FaRoute />
              <input type="text" name="city" placeholder="City" value={form.city} onChange={handleChange} />
            </label>

            <label style={styles.field}>
              <FaMapMarkedAlt />
              <input type="text" name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange} />
            </label>
          </div>

          <button style={styles.continueBtn} onClick={handleContinue}>
            Continue To Payment
            <FaArrowRight />
          </button>
        </div>

        <aside style={styles.preview}>
          <span style={styles.previewIcon}>
            <FaTruck />
          </span>
          <h2 style={styles.previewTitle}>Address Preview</h2>

          <div style={styles.previewCard}>
            <h3>{form.name || "Your Name"}</h3>
            <p>{form.address || "Street / Area"}</p>
            <p>
              {form.city || "City"} - {form.pincode || "000000"}
            </p>
            <span>
              <FaPhoneAlt />
              {form.phone || "Phone Number"}
            </span>
          </div>

          <div style={styles.deliveryBox}>
            <FaClock />
            <div>
              <h4>Morning Delivery</h4>
              <p>Fresh dairy products are packed cold and scheduled for fast route delivery.</p>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
};

export default AddressPage;

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
    gridTemplateColumns: "minmax(0, 1fr) minmax(310px, 400px)",
    gap: 22,
    maxWidth: 1220,
    margin: "0 auto",
  },
  addressCard: {
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
    fontSize: "clamp(36px, 6vw, 62px)",
    lineHeight: 1.04,
    fontWeight: 900,
  },
  subtitle: {
    maxWidth: 760,
    marginTop: 14,
    color: "#53667f",
    fontSize: 17,
    lineHeight: 1.65,
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 12,
    marginTop: 28,
  },
  field: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    minHeight: 56,
    padding: "0 15px",
    border: "1px solid rgba(11,87,164,0.16)",
    borderRadius: 8,
    color: "#0b57a4",
    background: "#fff",
  },
  fullField: {
    gridColumn: "1 / -1",
    alignItems: "flex-start",
    minHeight: 130,
    paddingTop: 16,
  },
  continueBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    width: "100%",
    minHeight: 56,
    marginTop: 18,
    border: 0,
    borderRadius: 8,
    color: "#fff",
    background: "linear-gradient(135deg,#0b57a4,#0878b8)",
    fontSize: 16,
    fontWeight: 900,
    cursor: "pointer",
  },
  preview: {
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
  previewIcon: {
    display: "grid",
    width: 50,
    height: 50,
    placeItems: "center",
    borderRadius: 8,
    color: "#0b3f8a",
    background: "#ffd43b",
    fontSize: 20,
  },
  previewTitle: {
    marginTop: 18,
    fontSize: 30,
    fontWeight: 900,
  },
  previewCard: {
    marginTop: 18,
    padding: 18,
    borderRadius: 8,
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.18)",
  },
  deliveryBox: {
    display: "flex",
    gap: 12,
    marginTop: 16,
    padding: 16,
    borderRadius: 8,
    color: "#0b3f8a",
    background: "#fff2a8",
  },
};
