import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaBoxOpen,
  FaCalendarAlt,
  FaCheckCircle,
  FaChevronRight,
  FaClock,
  FaEnvelope,
  FaLeaf,
  FaLock,
  FaPlus,
  FaSearch,
  FaShieldAlt,
  FaShoppingBag,
  FaStar,
  FaStore,
  FaTruck,
  FaUser,
  FaUserCheck,
} from "react-icons/fa";
import API from "../api/axios";
import { API_BASE_URL, getImageUrl } from "../api/config";
import Footer from "../components/Footer";

const Home = () => {
  const navigate = useNavigate();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [toastMessage, setToastMessage] = useState("");
  const [dbProducts, setDbProducts] = useState([]);

  // Auth Form State
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("shop");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  // Fetch live products from MongoDB
  useEffect(() => {
    const fetchDbProducts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/products`);
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setDbProducts(data);
        }
      } catch (err) {
        console.error("Fetch DB products error:", err);
      }
    };
    fetchDbProducts();

    const handleRefresh = () => {
      setSearchTerm("");
      setSelectedCategory("all");
      fetchDbProducts();
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    window.addEventListener("dn-refresh-home", handleRefresh);
    return () => window.removeEventListener("dn-refresh-home", handleRefresh);
  }, []);

  const categories = [
    { id: "all", label: "All Items", icon: "✨" },
    { id: "milk", label: "Fresh Milk", icon: "🥛" },
    { id: "ghee", label: "Pure Desi Ghee", icon: "🧈" },
    { id: "paneer", label: "Malai Paneer", icon: "🧀" },
    { id: "butter", label: "Table Butter", icon: "🍞" },
    { id: "curd", label: "Dahi & Curd", icon: "🥣" },
    { id: "beverages", label: "Lassi & Drinks", icon: "🥤" },
    { id: "sweets", label: "Traditional Sweets", icon: "🍯" },
  ];

  const productsList = [
    {
      id: "dn-milk-01",
      name: "DairyNest Gold Full Cream Milk",
      category: "milk",
      desc: "Pasteurized homogenized milk with 6.0% FAT & 9.0% SNF.",
      weight: "500 ml",
      price: 34,
      originalPrice: 38,
      discount: "11% OFF",
      rating: 4.9,
      reviews: 1420,
      image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80",
      badge: "Best Seller",
      badgeColor: "#d97706",
    },
    {
      id: "dn-milk-02",
      name: "DairyNest Taaza Toned Milk",
      category: "milk",
      desc: "Light, healthy daily milk with 3.0% FAT & 8.5% SNF.",
      weight: "1 Litre",
      price: 56,
      originalPrice: 62,
      discount: "10% OFF",
      rating: 4.8,
      reviews: 980,
      image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=400&q=80",
      badge: "Daily Essential",
      badgeColor: "#2563eb",
    },
    {
      id: "dn-ghee-01",
      name: "DairyNest Pure Desi Cow Ghee",
      category: "ghee",
      desc: "Traditional bilona slow-cooked golden ghee with rich granular aroma.",
      weight: "1 Litre Jar",
      price: 599,
      originalPrice: 699,
      discount: "14% OFF",
      rating: 5.0,
      reviews: 2150,
      image: "https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=400&q=80",
      badge: "100% Pure Vedic",
      badgeColor: "#ca8a04",
    },
    {
      id: "dn-paneer-01",
      name: "DairyNest Fresh Malai Paneer",
      category: "paneer",
      desc: "Mouth-melting soft cottage cheese made from 100% pure cow milk.",
      weight: "200 g",
      price: 95,
      originalPrice: 110,
      discount: "14% OFF",
      rating: 4.9,
      reviews: 1840,
      image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=400&q=80",
      badge: "High Protein",
      badgeColor: "#16a34a",
    },
    {
      id: "dn-butter-01",
      name: "DairyNest Creamy Table Butter",
      category: "butter",
      desc: "Rich salted cream butter crafted from freshly churned sweet cream.",
      weight: "100 g",
      price: 56,
      originalPrice: 60,
      discount: "7% OFF",
      rating: 4.9,
      reviews: 3100,
      image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=400&q=80",
      badge: "Chef's Choice",
      badgeColor: "#dc2626",
    },
    {
      id: "dn-curd-01",
      name: "DairyNest Thick Probiotic Dahi",
      category: "curd",
      desc: "Set curd packed with active live cultures for optimal digestive gut health.",
      weight: "400 g",
      price: 35,
      originalPrice: 40,
      discount: "12% OFF",
      rating: 4.8,
      reviews: 750,
      image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=400&q=80",
      badge: "Gut Friendly",
      badgeColor: "#0284c7",
    },
    {
      id: "dn-beverage-01",
      name: "DairyNest Alphonso Mango Lassi",
      category: "beverages",
      desc: "Thick churned curd blended with real Ratnagiri Alphonso mango pulp.",
      weight: "200 ml Bottle",
      price: 30,
      originalPrice: 35,
      discount: "14% OFF",
      rating: 4.9,
      reviews: 1290,
      image: "https://images.unsplash.com/photo-1570696516188-ade861b84a49?auto=format&fit=crop&w=400&q=80",
      badge: "Refreshing",
      badgeColor: "#ea580c",
    },
    {
      id: "dn-sweets-01",
      name: "DairyNest Mawa Gulab Jamun",
      category: "sweets",
      desc: "Soft melt-in-mouth traditional sweets made from pure in-house khoya.",
      weight: "500 g Box",
      price: 220,
      originalPrice: 260,
      discount: "15% OFF",
      rating: 5.0,
      reviews: 890,
      image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80",
      badge: "Festive Favorite",
      badgeColor: "#9333ea",
    },
  ];

  const displayProducts =
    dbProducts.length > 0
      ? dbProducts.map((p, idx) => {
          const nameLower = (p.name || "").toLowerCase();
          let cat = "milk";
          if (nameLower.includes("ghee")) cat = "ghee";
          else if (nameLower.includes("paneer") || nameLower.includes("cheese"))
            cat = "paneer";
          else if (nameLower.includes("butter")) cat = "butter";
          else if (nameLower.includes("dahi") || nameLower.includes("curd"))
            cat = "curd";
          else if (
            nameLower.includes("lassi") ||
            nameLower.includes("drink") ||
            nameLower.includes("shake")
          )
            cat = "beverages";
          else if (
            nameLower.includes("jamun") ||
            nameLower.includes("sweet") ||
            nameLower.includes("mithai")
          )
            cat = "sweets";

          return {
            id: p._id || `db-${idx}`,
            name: p.name,
            category: cat,
            desc: p.desc || `Fresh and pure 100% farm-sourced DairyNest ${p.name}.`,
            weight: p.name.includes("500ml")
              ? "500 ml"
              : p.name.includes("1L") || p.name.includes("1 Litre")
              ? "1 Litre"
              : p.name.includes("200g")
              ? "200 g"
              : p.name.includes("100g")
              ? "100 g"
              : p.name.includes("400g")
              ? "400 g"
              : "Standard Pack",
            price: Number(p.price) || 0,
            originalPrice:
              Number(p.originalPrice) || Math.round(Number(p.price) * 1.15),
            discount: p.discount ? `${p.discount}% OFF` : "Best Price",
            rating: Number((4.8 + (idx % 3) * 0.1).toFixed(1)),
            reviews: 800 + idx * 140,
            image: getImageUrl(p.image),
            badge:
              cat === "milk"
                ? "Daily Essential"
                : cat === "ghee"
                ? "100% Pure Vedic"
                : cat === "paneer"
                ? "High Protein"
                : "Farm Fresh",
            badgeColor:
              cat === "milk"
                ? "#0b57a4"
                : cat === "ghee"
                ? "#ca8a04"
                : cat === "paneer"
                ? "#16a34a"
                : cat === "butter"
                ? "#dc2626"
                : "#0284c7",
          };
        })
      : productsList;

  const filteredProducts = displayProducts.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (product) => {
    try {
      const currentCart = JSON.parse(localStorage.getItem("cart")) || [];
      const existingIndex = currentCart.findIndex(
        (c) => (c.name || c.productName) === product.name
      );

      let updatedCart;
      if (existingIndex > -1) {
        updatedCart = [...currentCart];
        updatedCart[existingIndex].quantity += 1;
      } else {
        updatedCart = [
          ...currentCart,
          {
            name: product.name,
            productName: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            quantity: 1,
            image: product.image,
          },
        ];
      }

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      window.dispatchEvent(new Event("storage"));

      showToast(`✅ Added 1x ${product.name} to your Cart!`);
    } catch (e) {
      console.error(e);
      showToast("Added item to Cart!");
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 3500);
  };

  const openAuthModal = (loginMode = true, targetRole = "shop") => {
    setIsLogin(loginMode);
    if (targetRole) setRole(targetRole);
    document
      .getElementById("auth-section")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  useEffect(() => {
    const handleOpenAuth = () => openAuthModal(true);
    window.addEventListener("open-auth", handleOpenAuth);
    if (sessionStorage.getItem("openAuth") === "true") {
      sessionStorage.removeItem("openAuth");
      openAuthModal(true);
    }
    return () => window.removeEventListener("open-auth", handleOpenAuth);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await API.post("/api/auth/login", { email, password });
      const data = res.data;
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      if (data.user.role === "admin") navigate("/admin");
      else if (data.user.role === "staff") navigate("/staff");
      else navigate("/shop");
      window.location.reload();
    } catch (err) {
      setMessage(
        err.response?.data?.msg ||
          err.response?.data?.message ||
          "Login failed. Please check your email and password."
      );
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
      setMessage("Account created successfully! Please login with your details.");
      setIsLogin(true);
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          "Registration failed. Please verify your details."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dairynest-home-root">
      {/* FLOATING TOAST */}
      {toastMessage && (
        <div className="dairynest-toast">
          <span>{toastMessage}</span>
          <button onClick={() => navigate("/cart")} className="toast-cart-btn">
            View Cart →
          </button>
        </div>
      )}

      {/* 1. HERO SECTION - ULTRA MODERN E-COMMERCE */}
      <section className="dairynest-hero">
        <div className="hero-container">
          <div className="hero-text-col">
            <div className="hero-live-pill">
              <span className="live-pulse"></span>
              <span>⚡ Live Dispatch: Morning Delivery 05:00 AM - 08:30 AM Active</span>
            </div>

            <h1 className="hero-main-title">
              Pure Dairy Delivered <br />
              <span className="gradient-highlight">Fresh Every Morning.</span>
            </h1>

            <p className="hero-subtitle">
              Sourced directly from 50,000+ village farmers with zero preservatives. Lab-tested daily for 100% purity and delivered to your doorstep before sunrise.
            </p>

            {/* SEARCH BAR */}
            <div className="hero-search-wrapper">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search fresh milk, cow ghee, malai paneer, butter, dahi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                className="search-action-btn"
                onClick={() => {
                  document.getElementById("shop-products")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Search
              </button>
            </div>

            {/* QUICK TRUST PILLS */}
            <div className="hero-trust-badges">
              <div className="trust-item">
                <FaLeaf className="trust-icon green" />
                <span>100% Farm Sourced</span>
              </div>
              <div className="trust-item">
                <FaShieldAlt className="trust-icon blue" />
                <span>0% Adulteration</span>
              </div>
              <div className="trust-item">
                <FaTruck className="trust-icon yellow" />
                <span>Morning Dispatch</span>
              </div>
            </div>

            <div className="hero-action-buttons">
              <button
                className="btn-primary-hero"
                onClick={() => {
                  document.getElementById("shop-products")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <FaShoppingBag style={{ marginRight: "8px" }} /> Explore All Products
              </button>
              <button
                className="btn-secondary-hero"
                onClick={() => openAuthModal(false, "shop")}
              >
                <FaStore style={{ marginRight: "8px" }} /> Register Shop / Parlor
              </button>
            </div>
          </div>

          <div className="hero-visual-col">
            <div className="hero-image-card">
              <img
                src="/assets/dairynest_hero_banner.jpg"
                alt="DairyNest Fresh Dairy Spread"
                className="hero-main-img"
              />
              <div className="hero-float-badge top-right">
                <div className="veg-badge-box">
                  <div className="veg-badge-dot"></div>
                </div>
                <span>100% Pure Veg</span>
              </div>
              <div className="hero-float-badge bottom-left">
                <FaStar className="star-icon" />
                <div>
                  <strong>4.9 / 5.0 Rating</strong>
                  <small>Over 25,000+ Happy Families</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. E-COMMERCE VALUE BAR */}
      <section className="dairynest-value-bar">
        <div className="section-container">
          <div className="value-grid">
            <div className="value-item">
              <div className="val-icon-box">🥛</div>
              <div>
                <h4>Direct From Farmers</h4>
                <p>Fair pricing for 50,000+ rural families with no middlemen.</p>
              </div>
            </div>
            <div className="value-item">
              <div className="val-icon-box">❄️</div>
              <div>
                <h4>4°C Cold-Chain</h4>
                <p>Instant chilling preserves natural enzymes and creamy taste.</p>
              </div>
            </div>
            <div className="value-item">
              <div className="val-icon-box">⏰</div>
              <div>
                <h4>Guaranteed Morning Slot</h4>
                <p>Delivered before 7:00 AM straight to your doorstep.</p>
              </div>
            </div>
            <div className="value-item">
              <div className="val-icon-box">🛡️</div>
              <div>
                <h4>FSSAI Certified Labs</h4>
                <p>Multi-point automatic testing for Fat, SNF, and purity.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE PRODUCT STORE (REAL E-COMMERCE) */}
      <section id="shop-products" className="dairynest-products-section">
        <div className="section-container">
          <div className="section-header-center">
            <span className="section-eyebrow">OUR FRESH SELECTION</span>
            <h2 className="section-title">Shop DairyNest Pure Products</h2>
            <p className="section-desc">
              Select from our wide range of farm-fresh milk, golden bilona ghee, malai paneer, and nutritious dairy goods.
            </p>

            {/* CATEGORY SELECTOR PILLS */}
            <div className="category-pills-row">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`cat-pill ${selectedCategory === cat.id ? "active" : ""}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <span className="cat-icon">{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* PRODUCT CARDS GRID */}
          <div className="products-ecommerce-grid">
            {filteredProducts.map((product) => (
              <div key={product.id} className="ecom-product-card">
                <div className="card-top-badges">
                  <span className="ecom-tag" style={{ background: product.badgeColor }}>
                    {product.badge}
                  </span>
                  <div className="veg-badge-box">
                    <div className="veg-badge-dot"></div>
                  </div>
                </div>

                <div className="product-image-wrap">
                  <img src={product.image} alt={product.name} />
                </div>

                <div className="product-info-wrap">
                  <div className="product-meta-row">
                    <span className="product-weight">{product.weight}</span>
                    <div className="product-rating">
                      <FaStar className="star" /> {product.rating} ({product.reviews})
                    </div>
                  </div>

                  <h3 className="product-title">{product.name}</h3>
                  <p className="product-snippet">{product.desc}</p>

                  <div className="product-pricing-action">
                    <div className="price-block">
                      <span className="current-price">₹{product.price}</span>
                      <span className="original-price">₹{product.originalPrice}</span>
                      <span className="discount-tag">{product.discount}</span>
                    </div>

                    <button
                      className="add-cart-btn"
                      onClick={() => handleAddToCart(product)}
                      title="Add to Cart"
                    >
                      <FaPlus style={{ marginRight: "4px" }} /> Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="no-products-box">
              <FaBoxOpen className="empty-box-icon" />
              <h3>No matching DairyNest items found</h3>
              <p>Try searching for another dairy item like milk, ghee, paneer, or butter.</p>
              <button
                className="btn-primary-hero"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
              >
                Clear Search
              </button>
            </div>
          )}

          <div className="view-full-shop-banner">
            <div className="banner-content">
              <h3>Looking for wholesale bulk deliveries or restaurant packs?</h3>
              <p>DairyNest offers dedicated bulk discounts for milk parlors, hotels, and retail sweet makers.</p>
            </div>
            <button className="btn-banner-shop" onClick={() => navigate("/shop")}>
              Go to Full Partner Shop <FaChevronRight style={{ marginLeft: "6px" }} />
            </button>
          </div>
        </div>
      </section>

      {/* 4. SUBSCRIPTION / FLASH PROMO BANNER */}
      <section className="dairynest-subscription-banner">
        <div className="section-container">
          <div className="subscription-card-wrapper">
            <div className="sub-text-col">
              <span className="sub-pill">📅 NEVER RUN OUT OF MILK</span>
              <h2>Start Your DairyNest Daily Morning Subscription</h2>
              <p>
                Get farm-fresh cow or full-cream milk delivered at your doorstep every morning by 07:00 AM. Customize your quantities, pause anytime, and enjoy <strong>15% OFF on your first 30 days</strong>.
              </p>

              <div className="sub-features-row">
                <div className="sf-item">
                  <FaCheckCircle className="check-icon" />
                  <span>Free Doorstep Delivery</span>
                </div>
                <div className="sf-item">
                  <FaCheckCircle className="check-icon" />
                  <span>Easy 1-Click Pause/Resume</span>
                </div>
                <div className="sf-item">
                  <FaCheckCircle className="check-icon" />
                  <span>Transparent Monthly Billing</span>
                </div>
              </div>

              <button
                className="btn-sub-action"
                onClick={() => openAuthModal(true, "shop")}
              >
                Subscribe Now & Save 15% <FaArrowRight style={{ marginLeft: "8px" }} />
              </button>
            </div>

            <div className="sub-visual-col">
              <div className="sub-visual-card">
                <div className="svc-header">
                  <FaCalendarAlt className="svc-icon" />
                  <div>
                    <strong>DairyNest Morning Plan</strong>
                    <small>Daily Fresh Delivery</small>
                  </div>
                </div>
                <div className="svc-days-grid">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => (
                    <div key={i} className="day-box active">
                      <span>{d}</span>
                      <strong>1L</strong>
                    </div>
                  ))}
                </div>
                <div className="svc-delivery-stat">
                  <FaClock /> Estimated Delivery: Tomorrow by 06:30 AM
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHY DAIRYNEST (PURITY & COLD-CHAIN STORY) */}
      <section id="why-dairynest" className="dairynest-why-section">
        <div className="section-container">
          <div className="section-header-center">
            <span className="section-eyebrow">OUR PROMISE OF PURITY</span>
            <h2 className="section-title">Why Thousands Choose DairyNest</h2>
            <p className="section-desc">
              Every drop of milk undergoes strict quality protocols to preserve the natural goodness, taste, and nutrition.
            </p>
          </div>

          <div className="why-grid">
            <div className="why-card">
              <div className="why-num">01</div>
              <div className="why-icon">🌿</div>
              <h3>Grass-Fed Cows & Buffalos</h3>
              <p>Cattle are cared for with natural mineral fodder, free from synthetic hormonal injections and harmful antibiotics.</p>
            </div>

            <div className="why-card">
              <div className="why-num">02</div>
              <div className="why-icon">🔬</div>
              <h3>Automated Ultrasonic Testing</h3>
              <p>Every batch is checked for FAT%, SNF%, water adulteration, and microbial count before processing.</p>
            </div>

            <div className="why-card">
              <div className="why-num">03</div>
              <div className="why-icon">❄️</div>
              <h3>Continuous 4°C Cold Chain</h3>
              <p>Chilled immediately post-milking and transported in refrigerated tankers to keep enzymes naturally intact.</p>
            </div>

            <div className="why-card">
              <div className="why-num">04</div>
              <div className="why-icon">🤝</div>
              <h3>100% Fair Farmer Support</h3>
              <p>Direct bank payments straight to village farmers, empowering local rural economies transparently.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. OUR CO-OPERATIVE FARMERS (WHITE REVOLUTION STORY) */}
      <section id="farmers-story" className="dairynest-farmers-section">
        <div className="section-container">
          <div className="farmers-story-grid">
            <div className="farmers-image-col">
              <img
                src="/assets/dairynest_farmers_banner.jpg"
                alt="DairyNest Co-operative Farmers"
                className="farmers-banner-img"
              />
              <div className="farmers-tag-overlay">
                <strong>50,000+ Associated Village Farmers</strong>
                <span>Building a stronger, self-reliant dairy community.</span>
              </div>
            </div>

            <div className="farmers-text-col">
              <span className="section-eyebrow">THE DAIRYNEST CO-OPERATIVE</span>
              <h2 className="section-title text-left">Empowering India's Dairy Roots</h2>
              <p className="farmers-para">
                DairyNest was founded on the belief that dairy farmers deserve complete transparency and consumers deserve untampered pure nutrition.
              </p>
              <p className="farmers-para">
                By deploying digital FAT testing booths and instant digital accounts, DairyNest eliminates middlemen exploitation and ensures genuine freshness from farm to table.
              </p>

              <div className="farmers-stats-row">
                <div className="f-stat">
                  <h3>₹0</h3>
                  <span>Middlemen Commission</span>
                </div>
                <div className="f-stat">
                  <h3>3.8M</h3>
                  <span>Liters Collected Daily</span>
                </div>
                <div className="f-stat">
                  <h3>100%</h3>
                  <span>Direct Bank Payouts</span>
                </div>
              </div>

              <button
                className="btn-primary-hero"
                onClick={() => openAuthModal(false, "staff")}
              >
                Join as Village Chilling Staff
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER REVIEWS */}
      <section className="dairynest-reviews-section">
        <div className="section-container">
          <div className="section-header-center">
            <span className="section-eyebrow">VERIFIED REVIEWS</span>
            <h2 className="section-title">Loved by Families & Parlor Owners</h2>
          </div>

          <div className="reviews-grid">
            <div className="review-card">
              <div className="stars-row">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="star-fill" />
                ))}
              </div>
              <p className="review-text">
                "The malai on DairyNest Gold milk is unbelievable! We started our daily subscription 3 months ago, and our morning tea has never tasted better. Always at our doorstep by 6:15 AM."
              </p>
              <div className="reviewer-info">
                <div className="reviewer-avatar">RK</div>
                <div>
                  <strong>Radhika Kulkarni</strong>
                  <small>Verified Buyer, Pune</small>
                </div>
              </div>
            </div>

            <div className="review-card">
              <div className="stars-row">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="star-fill" />
                ))}
              </div>
              <p className="review-text">
                "I run a sweet and snack shop in Gujarat. DairyNest Malai Paneer and Pure Cow Ghee have elevated our mithai quality. Quick wholesale dispatch and consistent purity."
              </p>
              <div className="reviewer-info">
                <div className="reviewer-avatar">PS</div>
                <div>
                  <strong>Prakash Sharma</strong>
                  <small>Shop Partner, Anand</small>
                </div>
              </div>
            </div>

            <div className="review-card">
              <div className="stars-row">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="star-fill" />
                ))}
              </div>
              <p className="review-text">
                "Finding 100% natural, chemical-free milk in the city seemed impossible until DairyNest. Their bilona cow ghee has that authentic traditional aroma my grandmother used to make."
              </p>
              <div className="reviewer-info">
                <div className="reviewer-avatar">AM</div>
                <div>
                  <strong>Ananya Mehra</strong>
                  <small>Verified Buyer, Delhi NCR</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. AUTHENTICATION & PARTNER PORTAL SECTION */}
      <section id="auth-section" className="dairynest-auth-section">
        <div className="section-container">
          <div className="auth-box-layout">
            <div className="auth-intro-box">
              <span className="section-eyebrow" style={{ color: "#ffd43b" }}>
                DAIRYNEST PORTAL
              </span>
              <h2>Access Your DairyNest Workspace</h2>
              <p>
                Log in to manage your shop orders, update daily milk intake logs, or administer regional deliveries across the DairyNest ecosystem.
              </p>

              <div className="auth-role-selectors">
                <div
                  className={`role-select-box ${role === "shop" ? "selected" : ""}`}
                  onClick={() => setRole("shop")}
                >
                  <FaStore className="role-icon" />
                  <div>
                    <strong>Shop Owner / Customer</strong>
                    <small>Order milk, butter, paneer & track live dispatch</small>
                  </div>
                </div>

                <div
                  className={`role-select-box ${role === "staff" ? "selected" : ""}`}
                  onClick={() => setRole("staff")}
                >
                  <FaUserCheck className="role-icon" />
                  <div>
                    <strong>Dairy Plant Staff</strong>
                    <small>Log farmer milk collection, FAT% & production</small>
                  </div>
                </div>

                <div
                  className={`role-select-box ${role === "admin" ? "selected" : ""}`}
                  onClick={() => setRole("admin")}
                >
                  <FaShieldAlt className="role-icon" />
                  <div>
                    <strong>DairyNest Admin</strong>
                    <small>Oversee inventories, staff accounts & analytics</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="auth-card-container">
              <div className="auth-white-card">
                <div className="auth-tab-buttons">
                  <button
                    className={`auth-tab-btn ${isLogin ? "active" : ""}`}
                    onClick={() => {
                      setIsLogin(true);
                      setMessage("");
                    }}
                  >
                    Login to Account
                  </button>
                  <button
                    className={`auth-tab-btn ${!isLogin ? "active" : ""}`}
                    onClick={() => {
                      setIsLogin(false);
                      setMessage("");
                    }}
                  >
                    Register New
                  </button>
                </div>

                {message && (
                  <div
                    className={`auth-alert-banner ${
                      message.toLowerCase().includes("success") ? "success" : "error"
                    }`}
                  >
                    {message}
                  </div>
                )}

                <form onSubmit={isLogin ? handleLogin : handleRegister}>
                  {!isLogin && (
                    <div className="form-field-group">
                      <label>Full Name / Business Name</label>
                      <div className="field-input-box">
                        <FaUser className="field-icon" />
                        <input
                          type="text"
                          required
                          placeholder="e.g. Anand Dairy Corner"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  <div className="form-field-group">
                    <label>Email Address</label>
                    <div className="field-input-box">
                      <FaEnvelope className="field-icon" />
                      <input
                        type="email"
                        required
                        placeholder="you@dairynest.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-field-group">
                    <label>Password</label>
                    <div className="field-input-box">
                      <FaLock className="field-icon" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  {!isLogin && (
                    <div className="form-field-group">
                      <label>Role</label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="role-dropdown"
                      >
                        <option value="shop">Shop Owner / Retail Customer</option>
                        <option value="staff">Dairy Plant Staff</option>
                        <option value="admin">System Administrator</option>
                      </select>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="auth-submit-btn"
                    disabled={loading}
                  >
                    {loading
                      ? "Authenticating..."
                      : isLogin
                      ? `Sign In as ${role.toUpperCase()}`
                      : "Create DairyNest Account"}
                  </button>
                </form>

                <div className="auth-toggle-msg">
                  {isLogin ? (
                    <p>
                      Don't have an account?{" "}
                      <span onClick={() => setIsLogin(false)}>
                        Register your Shop / Profile
                      </span>
                    </p>
                  ) : (
                    <p>
                      Already registered?{" "}
                      <span onClick={() => setIsLogin(true)}>Login here</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. REAL E-COMMERCE FOOTER */}
      <Footer />

      {/* MODERN E-COMMERCE STYLING */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Poppins:wght@400;500;600;700;800&display=swap');

        .dairynest-home-root {
          font-family: 'Poppins', sans-serif;
          color: #0f172a;
          background: #f8fafc;
          overflow-x: hidden;
          padding-top: 72px; /* Offset fixed Navbar cleanly */
        }

        .section-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* FLOATING TOAST */
        .dairynest-toast {
          position: fixed;
          bottom: 24px;
          right: 24px;
          background: #0f172a;
          color: #ffffff;
          padding: 14px 20px;
          border-radius: 14px;
          box-shadow: 0 12px 36px rgba(0, 0, 0, 0.28);
          z-index: 9999;
          display: flex;
          align-items: center;
          gap: 16px;
          font-size: 14px;
          font-weight: 600;
          animation: toastSlideUp 0.3s ease;
          border-left: 5px solid #16a34a;
        }

        .toast-cart-btn {
          background: #ffd43b;
          color: #0b57a4;
          border: none;
          padding: 6px 14px;
          border-radius: 8px;
          font-weight: 800;
          cursor: pointer;
        }

        @keyframes toastSlideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        /* 1. HERO SECTION */
        .dairynest-hero {
          background: linear-gradient(135deg, #0b57a4 0%, #084380 60%, #052c54 100%);
          color: #ffffff;
          padding: 60px 0 80px;
          position: relative;
          overflow: hidden;
        }

        .hero-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          gap: 48px;
          align-items: center;
        }

        .hero-live-pill {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 8px 16px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          color: #ffd43b;
          margin-bottom: 20px;
        }

        .live-pulse {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 10px #22c55e;
        }

        .hero-main-title {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(36px, 4.5vw, 56px);
          font-weight: 900;
          line-height: 1.08;
          margin-bottom: 18px;
        }

        .gradient-highlight {
          background: linear-gradient(90deg, #ffd43b, #fff176);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtitle {
          font-size: 16px;
          line-height: 1.65;
          color: #e2e8f0;
          margin-bottom: 28px;
          max-width: 580px;
        }

        .hero-search-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          background: #ffffff;
          border-radius: 16px;
          padding: 6px 8px 6px 20px;
          box-shadow: 0 12px 34px rgba(0, 0, 0, 0.25);
          margin-bottom: 28px;
          max-width: 580px;
        }

        .search-icon {
          color: #0b57a4;
          font-size: 18px;
          margin-right: 12px;
        }

        .hero-search-wrapper input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 15px;
          color: #0f172a;
          font-family: inherit;
        }

        .search-action-btn {
          background: #0b57a4;
          color: #ffffff;
          border: none;
          padding: 12px 26px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .search-action-btn:hover {
          background: #084380;
        }

        .hero-trust-badges {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }

        .trust-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 600;
          color: #e2e8f0;
        }

        .trust-icon.green { color: #4ade80; }
        .trust-icon.blue { color: #60a5fa; }
        .trust-icon.yellow { color: #facc15; }

        .hero-action-buttons {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .btn-primary-hero {
          display: inline-flex;
          align-items: center;
          background: #ffd43b;
          color: #0b57a4;
          font-weight: 800;
          font-size: 15px;
          padding: 14px 28px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(255, 212, 59, 0.35);
          transition: all 0.2s ease;
        }

        .btn-primary-hero:hover {
          background: #ffca28;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(255, 212, 59, 0.45);
        }

        .btn-secondary-hero {
          display: inline-flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.12);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.3);
          font-weight: 700;
          font-size: 15px;
          padding: 14px 24px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-secondary-hero:hover {
          background: rgba(255, 255, 255, 0.25);
        }

        .hero-visual-col {
          position: relative;
        }

        .hero-image-card {
          position: relative;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
          border: 3px solid rgba(255, 255, 255, 0.2);
        }

        .hero-main-img {
          width: 100%;
          height: auto;
          display: block;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .hero-image-card:hover .hero-main-img {
          transform: scale(1.02);
        }

        .hero-float-badge {
          position: absolute;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(8px);
          color: #0f172a;
          padding: 10px 16px;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
          display: flex;
          align-items: center;
          gap: 10px;
          z-index: 2;
        }

        .hero-float-badge.top-right {
          top: 18px;
          right: 18px;
          font-size: 12px;
          font-weight: 800;
          color: #15803d;
        }

        .hero-float-badge.bottom-left {
          bottom: 18px;
          left: 18px;
        }

        .hero-float-badge.bottom-left strong {
          display: block;
          font-size: 13px;
          color: #0b57a4;
        }

        .hero-float-badge.bottom-left small {
          font-size: 11px;
          color: #64748b;
        }

        .star-icon {
          color: #eab308;
          font-size: 20px;
        }

        .veg-badge-box {
          width: 18px;
          height: 18px;
          border: 2px solid #16a34a;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff;
        }

        .veg-badge-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #16a34a;
        }

        /* 2. VALUE PROPOSITION BAR */
        .dairynest-value-bar {
          background: #ffffff;
          padding: 32px 0;
          border-bottom: 1px solid #e2e8f0;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.03);
        }

        .value-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }

        .value-item {
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }

        .val-icon-box {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: #eff6ff;
          font-size: 24px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
        }

        .value-item h4 {
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 3px;
        }

        .value-item p {
          font-size: 12px;
          color: #64748b;
          line-height: 1.5;
          margin: 0;
        }

        /* 3. PRODUCTS SECTION (REAL E-COMMERCE) */
        .dairynest-products-section {
          padding: 80px 0;
          background: #f8fafc;
        }

        .section-header-center {
          text-align: center;
          max-width: 800px;
          margin: 0 auto 40px;
        }

        .section-eyebrow {
          font-size: 12px;
          font-weight: 800;
          color: #0b57a4;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          display: inline-block;
          margin-bottom: 6px;
        }

        .section-title {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(28px, 3.5vw, 42px);
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 12px;
        }

        .section-title.text-left {
          text-align: left;
        }

        .section-desc {
          color: #64748b;
          font-size: 15px;
          line-height: 1.65;
        }

        .category-pills-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 28px;
        }

        .cat-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: #334155;
          padding: 10px 20px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cat-pill:hover {
          border-color: #0b57a4;
          color: #0b57a4;
        }

        .cat-pill.active {
          background: #0b57a4;
          color: #ffffff;
          border-color: #0b57a4;
          box-shadow: 0 4px 14px rgba(11, 87, 164, 0.25);
        }

        .products-ecommerce-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 28px;
        }

        .ecom-product-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.04);
          transition: all 0.25s ease;
          position: relative;
        }

        .ecom-product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 36px rgba(11, 87, 164, 0.12);
          border-color: #93c5fd;
        }

        .card-top-badges {
          position: absolute;
          top: 14px;
          left: 14px;
          right: 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 2;
        }

        .ecom-tag {
          font-size: 11px;
          font-weight: 800;
          color: #ffffff;
          padding: 4px 10px;
          border-radius: 999px;
          text-transform: uppercase;
        }

        .product-image-wrap {
          height: 200px;
          overflow: hidden;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .product-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .ecom-product-card:hover .product-image-wrap img {
          transform: scale(1.06);
        }

        .product-info-wrap {
          padding: 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .product-meta-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          margin-bottom: 8px;
        }

        .product-weight {
          font-weight: 700;
          color: #64748b;
          background: #f1f5f9;
          padding: 2px 8px;
          border-radius: 6px;
        }

        .product-rating {
          display: flex;
          align-items: center;
          gap: 4px;
          font-weight: 700;
          color: #0f172a;
        }

        .product-rating .star {
          color: #eab308;
        }

        .product-title {
          font-family: 'Outfit', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 6px;
          line-height: 1.25;
        }

        .product-snippet {
          font-size: 13px;
          color: #64748b;
          line-height: 1.45;
          margin-bottom: 18px;
          flex: 1;
        }

        .product-pricing-action {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px dashed #e2e8f0;
          padding-top: 14px;
        }

        .price-block {
          display: flex;
          align-items: baseline;
          gap: 6px;
          flex-wrap: wrap;
        }

        .current-price {
          font-size: 20px;
          font-weight: 900;
          color: #0b57a4;
        }

        .original-price {
          font-size: 13px;
          color: #94a3b8;
          text-decoration: line-through;
        }

        .discount-tag {
          font-size: 11px;
          font-weight: 800;
          color: #16a34a;
        }

        .add-cart-btn {
          display: inline-flex;
          align-items: center;
          background: #0b57a4;
          color: #ffffff;
          font-weight: 800;
          font-size: 13px;
          padding: 8px 18px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .add-cart-btn:hover {
          background: #ffd43b;
          color: #0b57a4;
          transform: translateY(-1px);
        }

        .no-products-box {
          text-align: center;
          padding: 60px 20px;
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          margin-top: 20px;
        }

        .empty-box-icon {
          font-size: 54px;
          color: #94a3b8;
          margin-bottom: 16px;
        }

        .view-full-shop-banner {
          background: linear-gradient(135deg, #0b57a4, #084380);
          color: #ffffff;
          border-radius: 20px;
          padding: 32px 40px;
          margin-top: 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          box-shadow: 0 12px 36px rgba(11, 87, 164, 0.25);
        }

        .banner-content h3 {
          font-family: 'Outfit', sans-serif;
          font-size: 22px;
          font-weight: 800;
          margin-bottom: 6px;
        }

        .banner-content p {
          color: #cbd5e1;
          font-size: 14px;
          margin: 0;
        }

        .btn-banner-shop {
          background: #ffd43b;
          color: #0b57a4;
          border: none;
          padding: 14px 28px;
          border-radius: 12px;
          font-weight: 800;
          font-size: 14px;
          cursor: pointer;
          white-space: nowrap;
          transition: transform 0.2s;
        }

        .btn-banner-shop:hover {
          transform: translateY(-2px);
        }

        /* 4. SUBSCRIPTION BANNER */
        .dairynest-subscription-banner {
          padding: 80px 0;
          background: #ffffff;
        }

        .subscription-card-wrapper {
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          border: 2px solid #bbf7d0;
          border-radius: 28px;
          padding: 50px;
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 40px;
          align-items: center;
        }

        .sub-pill {
          background: #16a34a;
          color: #ffffff;
          font-size: 11px;
          font-weight: 800;
          padding: 4px 12px;
          border-radius: 999px;
          letter-spacing: 0.5px;
          display: inline-block;
          margin-bottom: 12px;
        }

        .sub-text-col h2 {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(26px, 3vw, 36px);
          font-weight: 800;
          color: #14532d;
          margin-bottom: 14px;
          line-height: 1.15;
        }

        .sub-text-col p {
          color: #374151;
          font-size: 15px;
          line-height: 1.65;
          margin-bottom: 24px;
        }

        .sub-features-row {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 30px;
        }

        .sf-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          font-weight: 700;
          color: #166534;
        }

        .check-icon {
          color: #16a34a;
        }

        .btn-sub-action {
          display: inline-flex;
          align-items: center;
          background: #16a34a;
          color: #ffffff;
          font-weight: 800;
          font-size: 15px;
          padding: 14px 30px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-sub-action:hover {
          background: #15803d;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(22, 163, 74, 0.35);
        }

        .sub-visual-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 28px;
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.08);
          border: 1px solid #dcfce7;
        }

        .svc-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid #f1f5f9;
        }

        .svc-icon {
          font-size: 28px;
          color: #16a34a;
        }

        .svc-header strong {
          display: block;
          font-size: 16px;
          color: #0f172a;
        }

        .svc-header small {
          font-size: 12px;
          color: #64748b;
        }

        .svc-days-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 6px;
          margin-bottom: 20px;
        }

        .day-box {
          background: #f1f5f9;
          padding: 8px 4px;
          border-radius: 8px;
          text-align: center;
          font-size: 11px;
        }

        .day-box.active {
          background: #dcfce7;
          border: 1px solid #86efac;
          color: #15803d;
        }

        .day-box span {
          display: block;
          font-weight: 600;
          margin-bottom: 2px;
        }

        .day-box strong {
          display: block;
          font-size: 12px;
        }

        .svc-delivery-stat {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 700;
          color: #0b57a4;
          background: #eff6ff;
          padding: 10px 14px;
          border-radius: 10px;
        }

        /* 5. WHY DAIRYNEST SECTION */
        .dairynest-why-section {
          padding: 80px 0;
          background: #f8fafc;
        }

        .why-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }

        .why-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 32px 24px;
          position: relative;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
          transition: all 0.25s ease;
        }

        .why-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(11, 87, 164, 0.08);
          border-color: #93c5fd;
        }

        .why-num {
          position: absolute;
          top: 20px;
          right: 20px;
          font-family: 'Outfit', sans-serif;
          font-size: 22px;
          font-weight: 900;
          color: #cbd5e1;
        }

        .why-icon {
          font-size: 38px;
          margin-bottom: 16px;
        }

        .why-card h3 {
          font-family: 'Outfit', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 10px;
        }

        .why-card p {
          font-size: 13px;
          color: #64748b;
          line-height: 1.6;
          margin: 0;
        }

        /* 6. FARMERS / CO-OP SECTION */
        .dairynest-farmers-section {
          padding: 80px 0;
          background: #ffffff;
        }

        .farmers-story-grid {
          display: grid;
          grid-template-columns: 1fr 1.15fr;
          gap: 50px;
          align-items: center;
        }

        .farmers-image-col {
          position: relative;
        }

        .farmers-banner-img {
          width: 100%;
          border-radius: 24px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
        }

        .farmers-tag-overlay {
          position: absolute;
          bottom: -20px;
          right: 20px;
          background: #ffffff;
          padding: 18px 24px;
          border-radius: 16px;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
          border-left: 5px solid #0b57a4;
          max-width: 320px;
        }

        .farmers-tag-overlay strong {
          display: block;
          font-size: 14px;
          color: #0b57a4;
          margin-bottom: 4px;
        }

        .farmers-tag-overlay span {
          font-size: 12px;
          color: #64748b;
        }

        .farmers-para {
          font-size: 15px;
          color: #475569;
          line-height: 1.7;
          margin-bottom: 16px;
        }

        .farmers-stats-row {
          display: flex;
          gap: 28px;
          margin: 28px 0 32px;
          padding: 18px 0;
          border-top: 1px solid #f1f5f9;
          border-bottom: 1px solid #f1f5f9;
        }

        .f-stat h3 {
          font-family: 'Outfit', sans-serif;
          font-size: 26px;
          font-weight: 900;
          color: #0b57a4;
          margin-bottom: 2px;
        }

        .f-stat span {
          font-size: 12px;
          color: #64748b;
          font-weight: 600;
        }

        /* 7. REVIEWS SECTION */
        .dairynest-reviews-section {
          padding: 80px 0;
          background: #f8fafc;
        }

        .reviews-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
        }

        .review-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.03);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .stars-row {
          display: flex;
          gap: 4px;
          margin-bottom: 14px;
        }

        .star-fill {
          color: #eab308;
          font-size: 16px;
        }

        .review-text {
          font-size: 14px;
          color: #475569;
          line-height: 1.7;
          margin-bottom: 24px;
          font-style: italic;
        }

        .reviewer-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .reviewer-avatar {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: #eff6ff;
          color: #0b57a4;
          font-weight: 800;
          font-size: 14px;
          display: grid;
          place-items: center;
        }

        .reviewer-info strong {
          display: block;
          font-size: 14px;
          color: #0f172a;
        }

        .reviewer-info small {
          font-size: 12px;
          color: #64748b;
        }

        /* 8. AUTHENTICATION SECTION */
        .dairynest-auth-section {
          padding: 80px 0;
          background: linear-gradient(135deg, #0b57a4 0%, #084380 100%);
          color: #ffffff;
        }

        .auth-box-layout {
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          gap: 48px;
          align-items: center;
        }

        .auth-intro-box h2 {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(28px, 3.5vw, 42px);
          font-weight: 900;
          margin: 10px 0 16px;
        }

        .auth-intro-box p {
          color: #e2e8f0;
          font-size: 15px;
          line-height: 1.65;
          margin-bottom: 28px;
        }

        .auth-role-selectors {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .role-select-box {
          display: flex;
          align-items: center;
          gap: 16px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 14px;
          padding: 14px 18px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .role-select-box:hover {
          background: rgba(255, 255, 255, 0.16);
        }

        .role-select-box.selected {
          background: #ffffff;
          color: #0b57a4;
          border-color: #ffd43b;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        }

        .role-icon {
          font-size: 22px;
          flex-shrink: 0;
        }

        .role-select-box strong {
          display: block;
          font-size: 14px;
        }

        .role-select-box small {
          font-size: 12px;
          opacity: 0.85;
        }

        .auth-white-card {
          background: #ffffff;
          color: #0f172a;
          border-radius: 24px;
          padding: 36px;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.3);
        }

        .auth-tab-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: #f1f5f9;
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 22px;
        }

        .auth-tab-btn {
          padding: 10px;
          border: none;
          border-radius: 10px;
          background: transparent;
          color: #64748b;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .auth-tab-btn.active {
          background: #0b57a4;
          color: #ffffff;
        }

        .auth-alert-banner {
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 16px;
        }

        .auth-alert-banner.error {
          background: #fee2e2;
          color: #b91c1c;
        }

        .auth-alert-banner.success {
          background: #dcfce7;
          color: #15803d;
        }

        .form-field-group {
          margin-bottom: 16px;
        }

        .form-field-group label {
          display: block;
          font-size: 13px;
          font-weight: 700;
          color: #334155;
          margin-bottom: 6px;
        }

        .field-input-box {
          position: relative;
          display: flex;
          align-items: center;
        }

        .field-icon {
          position: absolute;
          left: 14px;
          color: #94a3b8;
          font-size: 14px;
        }

        .field-input-box input {
          width: 100%;
          padding: 12px 14px 12px 42px;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          font-size: 14px;
          outline: none;
          font-family: inherit;
        }

        .field-input-box input:focus {
          border-color: #0b57a4;
        }

        .role-dropdown {
          width: 100%;
          padding: 12px 14px;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          font-size: 14px;
          outline: none;
          background: #fff;
        }

        .auth-submit-btn {
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 12px;
          background: #0b57a4;
          color: #ffffff;
          font-weight: 800;
          font-size: 15px;
          cursor: pointer;
          margin-top: 8px;
          transition: background 0.2s;
        }

        .auth-submit-btn:hover {
          background: #084380;
        }

        .auth-toggle-msg {
          text-align: center;
          margin-top: 16px;
          font-size: 13px;
          color: #64748b;
        }

        .auth-toggle-msg span {
          color: #0b57a4;
          font-weight: 700;
          cursor: pointer;
        }

        /* 9. REAL E-COMMERCE FOOTER */
        .dairynest-footer {
          background: #0f172a;
          color: #94a3b8;
          padding: 70px 0 30px;
        }

        .footer-top-grid {
          display: grid;
          grid-template-columns: 2fr 1.2fr 1.2fr 1.5fr;
          gap: 40px;
          margin-bottom: 50px;
        }

        .footer-brand-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .footer-bio {
          font-size: 13px;
          line-height: 1.7;
          color: #94a3b8;
          margin-bottom: 20px;
          max-width: 380px;
        }

        .footer-social-links {
          display: flex;
          gap: 12px;
        }

        .footer-social-links a {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #1e293b;
          color: #ffffff;
          display: grid;
          place-items: center;
          font-size: 14px;
          transition: all 0.2s;
        }

        .footer-social-links a:hover {
          background: #0b57a4;
          transform: translateY(-2px);
        }

        .footer-links-col h4 {
          color: #ffffff;
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 18px;
        }

        .footer-links-col ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-links-col ul li {
          margin-bottom: 10px;
        }

        .footer-links-col ul li a {
          color: #94a3b8;
          text-decoration: none;
          font-size: 13px;
          transition: color 0.2s;
        }

        .footer-links-col ul li a:hover {
          color: #ffd43b;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: #cbd5e1;
          margin-bottom: 12px;
        }

        .contact-icon {
          color: #ffd43b;
        }

        .fssai-box {
          margin-top: 18px;
          padding: 10px 14px;
          background: #1e293b;
          border-radius: 8px;
          border: 1px solid #334155;
          display: inline-block;
        }

        .fssai-text {
          display: block;
          font-size: 11px;
          color: #94a3b8;
        }

        .fssai-box strong {
          color: #ffffff;
          font-size: 13px;
        }

        .footer-bottom-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          color: #64748b;
          border-top: 1px solid #1e293b;
          padding-top: 24px;
          flex-wrap: wrap;
          gap: 14px;
        }

        .footer-policy-links {
          display: flex;
          gap: 20px;
        }

        .footer-policy-links a {
          color: #64748b;
          text-decoration: none;
        }

        .footer-policy-links a:hover {
          color: #94a3b8;
        }

        /* RESPONSIVE BREAKPOINTS */
        @media (max-width: 1024px) {
          .hero-container { grid-template-columns: 1fr; }
          .subscription-card-wrapper { grid-template-columns: 1fr; }
          .farmers-story-grid { grid-template-columns: 1fr; }
          .auth-box-layout { grid-template-columns: 1fr; }
          .why-grid { grid-template-columns: repeat(2, 1fr); }
          .value-grid { grid-template-columns: repeat(2, 1fr); }
          .footer-top-grid { grid-template-columns: repeat(2, 1fr); }
          .reviews-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 640px) {
          .why-grid { grid-template-columns: 1fr; }
          .value-grid { grid-template-columns: 1fr; }
          .footer-top-grid { grid-template-columns: 1fr; }
          .hero-action-buttons { flex-direction: column; align-items: stretch; }
          .view-full-shop-banner { flex-direction: column; align-items: flex-start; }
          .subscription-card-wrapper { padding: 28px 20px; }
          .auth-white-card { padding: 24px; }
        }
      `}</style>
    </div>
  );
};

export default Home;
