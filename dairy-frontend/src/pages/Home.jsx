import React, { useEffect, useState } from "react";
import {
  FaArrowRight,
  FaBlender,
  FaCheck,
  FaCheese,
  FaEnvelope,
  FaFacebookF,
  FaFlask,
  FaGlassWhiskey,
  FaIceCream,
  FaInstagram,
  FaIndustry,
  FaLeaf,
  FaLock,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaPlay,
  FaShieldAlt,
  FaShoppingBasket,
  FaTruck,
  FaTwitter,
  FaUser,
} from "react-icons/fa";
import "./home.css";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

const highlights = [
  {
    icon: <FaTruck />,
    title: "Daily milk routes",
    text: "Morning subscriptions, shop orders, and route planning in one dashboard.",
  },
  {
    icon: <FaLeaf />,
    title: "Fresh dairy catalog",
    text: "Milk, curd, paneer, ghee, butter, and cheese presented like a trusted dairy brand.",
  },
  {
    icon: <FaShieldAlt />,
    title: "Trusted operations",
    text: "Separate access for admin, staff, and shops keeps every dairy workflow clear.",
  },
];

const products = ["Taaza Milk", "Gold Milk", "Fresh Paneer", "Curd", "Pure Ghee"];

const productionProducts = [
  {
    icon: <FaIceCream />,
    name: "Ice Cream",
    step: "Milk base, cream mixing, freezing",
  },
  {
    icon: <FaCheese />,
    name: "Paneer",
    step: "Curdling, pressing, chilled cutting",
  },
  {
    icon: <FaGlassWhiskey />,
    name: "Lassi",
    step: "Curd blending, flavoring, bottling",
  },
];

const Home = () => {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("shop");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const openAuth = (loginMode = true) => {
    setIsLogin(loginMode);
    setTimeout(() => {
      document.getElementById("auth")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 80);
  };

  useEffect(() => {
    const handleOpenAuth = () => openAuth(true);
    window.addEventListener("open-auth", handleOpenAuth);

    if (sessionStorage.getItem("openAuth") === "true") {
      sessionStorage.removeItem("openAuth");
      openAuth(true);
    }

    return () => window.removeEventListener("open-auth", handleOpenAuth);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await API.post("/api/auth/login", {
        email,
        password,
      });

      const data = res.data;

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "admin") {
        navigate("/admin");
      } else if (data.user.role === "staff") {
        navigate("/staff");
      } else {
        navigate("/shop");
      }

      window.location.reload();
    } catch (err) {
      setMessage(err.response?.data?.msg || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await API.post("/api/auth/register", {
        name,
        username: name,
        email,
        password,
        role,
      });

      setMessage("Registration Successful. Please login now.");
      setIsLogin(true);
    } catch (err) {
      setMessage(err.response?.data?.message || "Register Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="premium-home" id="top">
      <section className="amul-hero">
        <div className="hero-copy">
          <span className="hero-badge">
            <FaLeaf />
            India's fresh dairy shop platform
          </span>

          <h1>DairyNest for every milk shop, route, and family order.</h1>

          <p>
            A bright Amul-inspired dairy platform for selling milk products,
            managing staff, tracking orders, and giving local customers a smooth
            fresh-food experience.
          </p>

          <div className="hero-actions">
            <button className="primary-cta" type="button" onClick={() => openAuth(false)}>
              Start account
              <FaArrowRight />
            </button>
            <button className="secondary-cta" type="button" onClick={() => openAuth(true)}>
              Login
            </button>
          </div>

          <div className="product-strip" aria-label="Dairy products">
            {products.map((product) => (
              <span key={product}>{product}</span>
            ))}
          </div>
        </div>

        <div className="hero-media">
          <div className="milk-pack">
            <div className="pack-top">DairyNest</div>
            <div className="pack-body">
              <span>DN</span>
              <strong>Fresh Milk</strong>
              <small>Farm to shop daily</small>
            </div>
          </div>

          <div className="floating-note quality-note">
            <FaCheck />
            <span>Quality checked batches</span>
          </div>
          <div className="floating-note route-note">
            <FaMapMarkerAlt />
            <span>Live delivery routes</span>
          </div>
        </div>
      </section>

      <section className="dairy-video-section" aria-labelledby="video-title">
        <div className="section-heading">
          <span>Manufacturing Film</span>
          <h2 id="video-title">Inside DairyNest product manufacturing</h2>
        </div>

        <div className="video-layout">
          <div className="video-frame">
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster="https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=1200&q=80"
              aria-label="DairyNest dairy product manufacturing video"
            >
              <source
                src="https://www.pexels.com/download/video/5666033/"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
            <div className="video-shade" aria-hidden="true"></div>
            <div className="video-brand">
              <FaIndustry />
              <strong>DairyNest</strong>
              <span>Ice cream, paneer, and lassi production</span>
            </div>
            <div className="product-film-panel" aria-label="DairyNest manufactured dairy products">
              {productionProducts.map((item) => (
                <article key={item.name}>
                  <span>{item.icon}</span>
                  <div>
                    <strong>{item.name}</strong>
                    <small>{item.step}</small>
                  </div>
                </article>
              ))}
            </div>
            <div className="process-ribbon" aria-label="Manufacturing process">
              <span>Milk Base</span>
              <span>Lab Test</span>
              <span>
                <FaBlender />
                Blend
              </span>
              <span>
                <FaFlask />
                Process
              </span>
              <span>Cold Pack</span>
            </div>
            <div className="play-chip">
              <FaPlay />
              Autoplay manufacturing film
            </div>
          </div>

          <div className="video-copy">
            <h3>From fresh milk base to ice cream, paneer, and lassi</h3>
            <p>
              Present DairyNest like a real dairy company: fresh milk is tested,
              processed, and converted into chilled ice cream, soft paneer, and
              bottled lassi with clean packing and route-ready dispatch.
            </p>
            <div className="video-stats">
              <div>
                <strong>3</strong>
                <span>Featured dairy products</span>
              </div>
              <div>
                <strong>Cold</strong>
                <span>Chain-ready packing</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="feature-list" aria-label="DairyNest features">
        {highlights.map((item) => (
          <article className="feature-card" key={item.title}>
            <span className="feature-icon">{item.icon}</span>
            <div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="auth-section" id="auth">
        <div className="auth-intro">
          <span>Get Started</span>
          <h2>{isLogin ? "Login to DairyNest" : "Create your DairyNest account"}</h2>
          <p>
            Open your dairy workspace for admin dashboards, staff routes, shop
            ordering, and customer deliveries.
          </p>
        </div>

        <div className="auth-card">
          <div className="tabs">
            <button
              type="button"
              className={isLogin ? "active-tab" : ""}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>

            <button
              type="button"
              className={!isLogin ? "active-tab" : ""}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>
          </div>

          {message && <div className="message-box">{message}</div>}

          {isLogin ? (
            <form onSubmit={handleLogin} className="auth-form">
              <label>
                <FaEnvelope />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>

              <label>
                <FaLock />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>

              <button className="auth-btn" disabled={loading}>
                {loading ? "Please wait..." : "Login now"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="auth-form">
              <label>
                <FaUser />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </label>

              <label>
                <FaEnvelope />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>

              <label>
                <FaLock />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>

              <label>
                <FaShoppingBasket />
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="shop">Shop</option>
                  <option value="staff">Staff</option>
                </select>
              </label>

              <button className="auth-btn" disabled={loading}>
                {loading ? "Creating..." : "Create account"}
              </button>
            </form>
          )}
        </div>
      </section>

      <footer className="home-footer">
        <div>
          <h2>DairyNest</h2>
          <p>Fresh dairy ordering and operations for growing local shops.</p>
        </div>
        <div className="footer-contact">
          <span>
            <FaPhoneAlt />
            +91 7352966256
          </span>
          <span>
            <FaEnvelope />
            7352966256@dairyNest.ac.in
          </span>
          <a href="#top" aria-label="Instagram">
            <FaInstagram />
          </a>
          <a href="#top" aria-label="Facebook">
            <FaFacebookF />
          </a>
          <a href="#top" aria-label="Twitter">
            <FaTwitter />
          </a>
        </div>
      </footer>
    </main>
  );
};

export default Home;
