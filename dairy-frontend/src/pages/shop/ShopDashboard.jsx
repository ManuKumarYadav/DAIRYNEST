import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaBolt,
  FaBoxOpen,
  FaCartPlus,
  FaCheckCircle,
  FaHeart,
  FaLeaf,
  FaRupeeSign,
  FaSearch,
  FaShoppingCart,
  FaStar,
  FaTag,
  FaTruck,
} from "react-icons/fa";
import { API_BASE_URL, getImageUrl as getImgHelper } from "../../api/config";

const getImage = (product) => {
  if (!product || !product.image)
    return "https://via.placeholder.com/400x400?text=DairyNest";
  return getImgHelper(product.image);
};

const fakeRating = (id) => {
  const seed = id ? id.charCodeAt(id.length - 1) % 10 : 0;
  return (3.8 + seed * 0.12).toFixed(1);
};

const fakeReviews = (id) => {
  const seed = id ? id.charCodeAt(0) % 100 : 0;
  return 120 + seed * 17;
};

const CATEGORIES = [
  "All",
  "Milk",
  "Paneer",
  "Ghee",
  "Curd",
  "Lassi",
  "Cheese",
  "Butter",
  "Cream",
];

const ShopDashboard = ({ setCart }) => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("popular");
  const [wishlist, setWishlist] = useState([]);
  const [addedId, setAddedId] = useState(null);
  const navigate = useNavigate();

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/products`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch products error:", err);
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
    setAddedId(product._id);
    setTimeout(() => setAddedId(null), 1800);
  };

  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const filtered = useMemo(() => {
    let list = [...products];
    if (search.trim())
      list = list.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()),
      );
    if (category !== "All")
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(category.toLowerCase()) ||
          (p.category || "").toLowerCase() === category.toLowerCase(),
      );
    if (sort === "low") list.sort((a, b) => a.price - b.price);
    else if (sort === "high") list.sort((a, b) => b.price - a.price);
    else if (sort === "discount")
      list.sort((a, b) => (b.discount || 0) - (a.discount || 0));
    return list;
  }, [products, search, category, sort]);

  const cartCount = JSON.parse(localStorage.getItem("cart") || "[]").length;

  return (
    <div className="dn-shop">
      <div className="dn-banner">
        <div className="dn-banner-content">
          <div className="dn-banner-left">
            <span className="dn-banner-tag">
              <FaLeaf /> DairyNest Store
            </span>
            <h1 className="dn-banner-title">
              Fresh Dairy,
              <br />
              <span className="dn-banner-accent">Delivered Daily.</span>
            </h1>
            <p className="dn-banner-sub">
              Premium milk, paneer, ghee &amp; more — farm fresh, cold packed,
              morning delivery.
            </p>
            <div className="dn-banner-actions">
              <button
                className="dn-btn-primary"
                onClick={() => navigate("/cart")}
              >
                <FaShoppingCart /> View Cart{" "}
                {cartCount > 0 && (
                  <span className="dn-cart-badge">{cartCount}</span>
                )}
              </button>
              <button
                className="dn-btn-outline"
                onClick={() =>
                  document
                    .getElementById("dn-products")
                    .scrollIntoView({ behavior: "smooth" })
                }
              >
                Browse Products <FaArrowRight />
              </button>
            </div>
          </div>
          <div className="dn-banner-right">
            <div className="dn-banner-stats">
              <div className="dn-stat">
                <span className="dn-stat-value">{products.length}+</span>
                <span className="dn-stat-label">Products</span>
              </div>
              <div className="dn-stat-div" />
              <div className="dn-stat">
                <span className="dn-stat-value">7AM</span>
                <span className="dn-stat-label">Delivery</span>
              </div>
              <div className="dn-stat-div" />
              <div className="dn-stat">
                <span className="dn-stat-value">100%</span>
                <span className="dn-stat-label">Fresh</span>
              </div>
            </div>
            <div className="dn-offer-strip">
              <FaBolt className="dn-offer-icon" />
              <span>
                <b>Limited Offer:</b> Free delivery on orders above ₹199
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="dn-cat-bar">
        <div className="dn-cat-inner">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`dn-cat-pill${category === cat ? " active" : ""}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="dn-toolbar" id="dn-products">
        <div className="dn-search-box">
          <FaSearch className="dn-search-icon" />
          <input
            className="dn-search-input"
            placeholder="Search for milk, paneer, ghee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="dn-search-clear" onClick={() => setSearch("")}>
              ✕
            </button>
          )}
        </div>
        <div className="dn-sort-row">
          <span className="dn-result-count">{filtered.length} products</span>
          <select
            className="dn-sort-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="popular">Most Popular</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
            <option value="discount">Best Discount</option>
          </select>
        </div>
      </div>

      <div className="dn-grid-wrap">
        {filtered.length === 0 ? (
          <div className="dn-empty">
            <FaBoxOpen className="dn-empty-icon" />
            <h2>No products found</h2>
            <p>
              {search
                ? `No results for "${search}"`
                : "Products will appear here once admin adds them."}
            </p>
            {search && (
              <button className="dn-btn-primary" onClick={() => setSearch("")}>
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="dn-products-grid">
            {filtered.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddCart={addToCart}
                onBuy={() => {
                  addToCart(product);
                  navigate("/cart");
                }}
                wishlisted={wishlist.includes(product._id)}
                onWishlist={() => toggleWishlist(product._id)}
                justAdded={addedId === product._id}
              />
            ))}
          </div>
        )}
      </div>

      <div className="dn-trust-bar">
        {[
          {
            icon: <FaTruck />,
            title: "Free Delivery",
            sub: "On orders above ₹199",
          },
          {
            icon: <FaCheckCircle />,
            title: "100% Fresh",
            sub: "Farm-sourced daily",
          },
          {
            icon: <FaBolt />,
            title: "Morning Dispatch",
            sub: "Delivered by 10 AM",
          },
          { icon: <FaTag />, title: "Best Prices", sub: "Direct from farmers" },
        ].map((item) => (
          <div className="dn-trust-item" key={item.title}>
            <span className="dn-trust-icon">{item.icon}</span>
            <div>
              <strong>{item.title}</strong>
              <p>{item.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .dn-shop {
          min-height: 100vh;
          background: #f1f3f6;
          font-family: 'Inter', system-ui, sans-serif;
          padding-top: 72px;
          color: #212121;
        }

        /* ── BANNER ── */
        .dn-banner {
          background: linear-gradient(135deg, #0b3d91 0%, #1565c0 40%, #0d47a1 70%, #0a2e6e 100%);
          padding: 48px clamp(16px, 5vw, 60px) 52px;
          position: relative;
          overflow: hidden;
        }
        .dn-banner::before {
          content: '';
          position: absolute;
          inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        .dn-banner::after {
          content: '';
          position: absolute;
          width: 380px;
          height: 380px;
          border-radius: 50%;
          background: rgba(255,212,59,0.12);
          bottom: -120px;
          right: -80px;
          pointer-events: none;
        }
        .dn-banner-content {
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 32px;
          max-width: 1280px;
          margin: 0 auto;
          flex-wrap: wrap;
        }
        .dn-banner-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,212,59,0.2);
          border: 1px solid rgba(255,212,59,0.4);
          color: #ffd43b;
          padding: 6px 16px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 16px;
        }
        .dn-banner-title {
          font-size: clamp(32px, 5vw, 56px);
          font-weight: 900;
          color: #fff;
          line-height: 1.1;
          margin-bottom: 14px;
        }
        .dn-banner-accent {
          color: #ffd43b;
        }
        .dn-banner-sub {
          color: rgba(255,255,255,0.75);
          font-size: 16px;
          line-height: 1.65;
          max-width: 480px;
          margin-bottom: 28px;
        }
        .dn-banner-actions {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }
        .dn-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 24px;
          background: #ffd43b;
          color: #0b3d91;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s;
          position: relative;
        }
        .dn-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(255,212,59,0.4); }
        .dn-cart-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          background: #e53935;
          color: #fff;
          border-radius: 50%;
          font-size: 11px;
          font-weight: 900;
        }
        .dn-btn-outline {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 24px;
          background: transparent;
          color: #fff;
          border: 1.5px solid rgba(255,255,255,0.5);
          border-radius: 8px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
        }
        .dn-btn-outline:hover { background: rgba(255,255,255,0.08); border-color: #fff; }

        .dn-banner-right { display: flex; flex-direction: column; gap: 16px; }
        .dn-banner-stats {
          display: flex;
          align-items: center;
          gap: 24px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.18);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 20px 28px;
        }
        .dn-stat { text-align: center; }
        .dn-stat-value { display: block; font-size: 28px; font-weight: 900; color: #ffd43b; }
        .dn-stat-label { font-size: 12px; color: rgba(255,255,255,0.7); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        .dn-stat-div { width: 1px; height: 40px; background: rgba(255,255,255,0.2); }
        .dn-offer-strip {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255,212,59,0.15);
          border: 1px solid rgba(255,212,59,0.3);
          border-radius: 10px;
          padding: 12px 18px;
          color: #fff;
          font-size: 13px;
          font-weight: 600;
        }
        .dn-offer-icon { color: #ffd43b; font-size: 18px; flex-shrink: 0; }

        .dn-cat-bar {
          background: #fff;
          border-bottom: 1px solid #e0e0e0;
          position: sticky;
          top: 72px;
          z-index: 40;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }
        .dn-cat-inner {
          display: flex;
          gap: 8px;
          padding: 12px clamp(16px, 4vw, 60px);
          max-width: 1280px;
          margin: 0 auto;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .dn-cat-inner::-webkit-scrollbar { display: none; }
        .dn-cat-pill {
          display: inline-flex;
          align-items: center;
          white-space: nowrap;
          padding: 7px 18px;
          border-radius: 999px;
          border: 1.5px solid #e0e0e0;
          background: #f5f5f5;
          color: #555;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
          flex-shrink: 0;
        }
        .dn-cat-pill:hover { border-color: #0b3d91; color: #0b3d91; background: #e8f0fe; }
        .dn-cat-pill.active { background: #0b3d91; border-color: #0b3d91; color: #fff; }

        .dn-toolbar {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 18px clamp(16px, 4vw, 60px);
          max-width: 1280px;
          margin: 0 auto;
          flex-wrap: wrap;
        }
        .dn-search-box {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
          min-width: 200px;
          background: #fff;
          border: 1.5px solid #e0e0e0;
          border-radius: 10px;
          padding: 0 14px;
          transition: border-color 0.15s;
        }
        .dn-search-box:focus-within { border-color: #0b3d91; box-shadow: 0 0 0 3px rgba(11,61,145,0.1); }
        .dn-search-icon { color: #888; font-size: 15px; flex-shrink: 0; }
        .dn-search-input {
          flex: 1;
          height: 44px;
          border: none;
          outline: none;
          font-size: 14px;
          font-family: inherit;
          background: transparent;
          color: #212121;
        }
        .dn-search-clear {
          background: none;
          border: none;
          cursor: pointer;
          color: #888;
          font-size: 16px;
          padding: 4px;
          line-height: 1;
        }
        .dn-sort-row { display: flex; align-items: center; gap: 12px; }
        .dn-result-count { font-size: 13px; color: #666; white-space: nowrap; font-weight: 600; }
        .dn-sort-select {
          height: 44px;
          padding: 0 14px;
          border: 1.5px solid #e0e0e0;
          border-radius: 10px;
          background: #fff;
          color: #212121;
          font-size: 13px;
          font-family: inherit;
          font-weight: 600;
          cursor: pointer;
          outline: none;
        }
        .dn-sort-select:focus { border-color: #0b3d91; }

        .dn-grid-wrap {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 clamp(16px, 4vw, 60px) 40px;
        }
        .dn-products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 16px;
        }

        .dn-product-card {
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #e8e8e8;
          transition: transform 0.2s, box-shadow 0.2s;
          cursor: pointer;
          position: relative;
          display: flex;
          flex-direction: column;
        }
        .dn-product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.12);
          border-color: #0b3d91;
        }
        .dn-card-image-wrap {
          position: relative;
          background: #f5f8ff;
          aspect-ratio: 1 / 1;
          overflow: hidden;
        }
        .dn-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.35s;
        }
        .dn-product-card:hover .dn-card-img { transform: scale(1.06); }
        .dn-card-wishlist {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: rgba(255,255,255,0.92);
          border: none;
          display: grid;
          place-items: center;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.12);
          font-size: 15px;
          color: #ccc;
          transition: background 0.15s, transform 0.15s, color 0.15s;
          z-index: 2;
        }
        .dn-card-wishlist:hover { background: #fff; transform: scale(1.12); color: #ff8a8a; }
        .dn-card-wishlist.active { color: #e53935; }
        .dn-card-discount {
          position: absolute;
          top: 10px;
          left: 10px;
          background: #388e3c;
          color: #fff;
          font-size: 11px;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 4px;
          z-index: 2;
        }
        .dn-card-fresh {
          position: absolute;
          bottom: 10px;
          left: 10px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: rgba(56,142,60,0.92);
          color: #fff;
          font-size: 10px;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 4px;
          z-index: 2;
        }
        .dn-card-body { padding: 14px 14px 16px; flex: 1; display: flex; flex-direction: column; }
        .dn-card-name {
          font-size: 14px;
          font-weight: 700;
          color: #212121;
          line-height: 1.35;
          margin-bottom: 6px;
          word-break: break-word;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .dn-card-rating {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #388e3c;
          color: #fff;
          font-size: 11px;
          font-weight: 800;
          padding: 2px 7px;
          border-radius: 4px;
          margin-bottom: 8px;
          width: fit-content;
        }
        .dn-card-rating span { color: rgba(255,255,255,0.7); font-size: 10px; margin-left: 4px; font-weight: 600; }
        .dn-card-price-row {
          display: flex;
          align-items: baseline;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 4px;
        }
        .dn-card-price {
          display: inline-flex;
          align-items: center;
          gap: 2px;
          font-size: 20px;
          font-weight: 900;
          color: #212121;
        }
        .dn-card-mrp {
          font-size: 13px;
          color: #999;
          text-decoration: line-through;
          font-weight: 500;
        }
        .dn-card-save {
          font-size: 12px;
          color: #388e3c;
          font-weight: 700;
        }
        .dn-card-desc {
          font-size: 12px;
          color: #888;
          line-height: 1.4;
          margin-bottom: 12px;
          margin-top: 4px;
          flex: 1;
        }
        .dn-card-btns {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-top: auto;
        }
        .dn-add-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          height: 38px;
          border: 2px solid #0b3d91;
          border-radius: 6px;
          background: transparent;
          color: #0b3d91;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.15s;
          font-family: inherit;
        }
        .dn-add-btn:hover:not(:disabled) { background: #0b3d91; color: #fff; }
        .dn-add-btn.added { background: #0b3d91; color: #fff; border-color: #0b3d91; }
        .dn-add-btn:disabled { opacity: 0.45; cursor: not-allowed; }
        .dn-buy-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 38px;
          border: none;
          border-radius: 6px;
          background: #ff9f00;
          color: #212121;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.15s;
          font-family: inherit;
        }
        .dn-buy-btn:hover:not(:disabled) { background: #e65100; color: #fff; }
        .dn-buy-btn:disabled { opacity: 0.45; cursor: not-allowed; }
        .dn-notify-btn {
          grid-column: 1 / -1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 38px;
          border: 1px solid #d32f2f;
          border-radius: 6px;
          background: #ffebee;
          color: #d32f2f;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.15s;
          font-family: inherit;
        }
        .dn-notify-btn:hover { background: #d32f2f; color: #fff; }

        /* ── EMPTY ── */
        .dn-empty {
          grid-column: 1 / -1;
          display: grid;
          place-items: center;
          text-align: center;
          padding: 64px 24px;
          background: #fff;
          border-radius: 16px;
          border: 1px dashed #c5c5c5;
        }
        .dn-empty-icon { font-size: 56px; color: #0b3d91; margin-bottom: 18px; opacity: 0.4; }
        .dn-empty h2 { font-size: 22px; font-weight: 800; color: #212121; margin-bottom: 8px; }
        .dn-empty p { font-size: 14px; color: #666; margin-bottom: 20px; }

        /* ── TRUST BAR ── */
        .dn-trust-bar {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 0;
          background: #fff;
          border-top: 1px solid #e8e8e8;
          padding: 24px clamp(16px, 5vw, 60px);
        }
        .dn-trust-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 32px;
          border-right: 1px solid #e8e8e8;
          flex: 1;
          min-width: 180px;
        }
        .dn-trust-item:last-child { border-right: none; }
        .dn-trust-icon {
          display: grid;
          width: 44px;
          height: 44px;
          place-items: center;
          border-radius: 10px;
          background: #e8f0fe;
          color: #0b3d91;
          font-size: 20px;
          flex-shrink: 0;
        }
        .dn-trust-item strong { display: block; font-size: 14px; font-weight: 800; color: #212121; margin-bottom: 2px; }
        .dn-trust-item p { font-size: 12px; color: #777; }

        @media (max-width: 900px) {
          .dn-banner-right { display: none; }
          .dn-products-grid { grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 12px; }
          .dn-trust-item { padding: 12px 16px; min-width: 140px; }
        }
        @media (max-width: 640px) {
          .dn-shop { padding-top: 60px; }
          .dn-banner { padding: 28px 16px 32px; }
          .dn-toolbar { padding: 14px 16px; }
          .dn-grid-wrap { padding: 0 16px 32px; }
          .dn-products-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .dn-cat-inner { padding: 10px 16px; }
          .dn-trust-bar { padding: 16px; }
          .dn-trust-item { border-right: none; border-bottom: 1px solid #e8e8e8; }
          .dn-trust-item:last-child { border-bottom: none; }
        }
        @media (max-width: 380px) {
          .dn-products-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

const ProductCard = ({
  product,
  onAddCart,
  onBuy,
  wishlisted,
  onWishlist,
  justAdded,
}) => {
  const rating = fakeRating(product._id);
  const reviews = fakeReviews(product._id);
  const saving = product.originalPrice
    ? product.originalPrice - product.price
    : 0;

  return (
    <div className="dn-product-card">
      <div className="dn-card-image-wrap">
        <img
          src={getImage(product)}
          alt={product.name}
          className="dn-card-img"
        />
        {product.discount > 0 && (
          <span className="dn-card-discount">{product.discount}% OFF</span>
        )}
        <span className="dn-card-fresh">
          <FaCheckCircle /> Fresh
        </span>
        <button
          className={`dn-card-wishlist${wishlisted ? " active" : ""}`}
          onClick={onWishlist}
          aria-label="Wishlist"
        >
          <FaHeart />
        </button>
      </div>

      <div className="dn-card-body">
        <p className="dn-card-name">{product.name}</p>
        <div className="dn-card-rating">
          <FaStar style={{ fontSize: 10 }} />
          {rating}
          <span>({reviews})</span>
        </div>
        <div className="dn-card-price-row">
          <strong className="dn-card-price">
            <FaRupeeSign style={{ fontSize: 14 }} />
            {product.price}
          </strong>
          {product.originalPrice && (
            <span className="dn-card-mrp">₹{product.originalPrice}</span>
          )}
        </div>
        {saving > 0 && <span className="dn-card-save">Save ₹{saving}</span>}
        <p className="dn-card-desc">
          Premium DairyNest product · Cold packed · Farm sourced
        </p>
        <div className="dn-card-btns">
          {product.stock === 0 ? (
            <button
              className="dn-notify-btn"
              onClick={() =>
                alert(
                  `We will notify you when ${product.name} is back in stock!`,
                )
              }
            >
              Notify Me
            </button>
          ) : (
            <>
              <button
                className={`dn-add-btn${justAdded ? " added" : ""}`}
                onClick={() => onAddCart(product)}
              >
                {justAdded ? (
                  <>
                    <FaCheckCircle /> Added!
                  </>
                ) : (
                  <>
                    <FaCartPlus /> Add
                  </>
                )}
              </button>
              <button className="dn-buy-btn" onClick={onBuy}>
                Buy Now
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopDashboard;
