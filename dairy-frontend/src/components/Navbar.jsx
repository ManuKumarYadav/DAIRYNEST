import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaShoppingCart,
  FaSignOutAlt,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import { getImageUrl } from "../api/config";

const Navbar = ({ cart = [] }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch (_) {
      return null;
    }
  });
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, []);

  useEffect(() => {
    const syncUser = () => {
      try {
        setUser(JSON.parse(localStorage.getItem("user")) || null);
      } catch (_) {
        setUser(null);
      }
    };
    window.addEventListener("dn-user-updated", syncUser);
    window.addEventListener("storage", syncUser);
    return () => {
      window.removeEventListener("dn-user-updated", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  const [logoSpinning, setLogoSpinning] = useState(false);

  const handleLogoClick = () => {
    setMenuOpen(false);
    setUserMenuOpen(false);
    setLogoSpinning(true);
    setTimeout(() => setLogoSpinning(false), 700);

    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.dispatchEvent(new Event("dn-refresh-home"));
    } else {
      navigate("/");
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        window.dispatchEvent(new Event("dn-refresh-home"));
      }, 50);
    }
  };

  const handleNavigate = (path) => {
    navigate(path);
    setMenuOpen(false);
    setUserMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };

  const handleOpenAuth = () => {
    if (location.pathname === "/") {
      window.dispatchEvent(new Event("open-auth"));
      document
        .getElementById("auth-section")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    navigate("/");
    setTimeout(() => {
      window.dispatchEvent(new Event("open-auth"));
      document
        .getElementById("auth-section")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 150);
  };

  const isActive = (path) => location.pathname === path;

  const dashboardPath = !user
    ? null
    : user.role === "admin"
      ? "/admin"
      : user.role === "staff"
        ? "/staff"
        : "/dashboard";

  return (
    <>
      <header className={`dn-navbar${scrolled ? " scrolled" : ""}`}>
        <div className="dn-nav-wrapper">
          {}
          <button
            className={`dn-nav-brand${logoSpinning ? " refreshing" : ""}`}
            onClick={handleLogoClick}
            aria-label="DairyNest Home"
            title="Refresh & go to Home"
          >
            <div
              className={`dn-brand-icon${logoSpinning ? " refreshing" : ""}`}
            >
              DN
            </div>
            <div className="dn-brand-text">
              <span className="dn-brand-name">DairyNest</span>
              <span className="dn-brand-sub">Pure Dairy Platform</span>
            </div>
          </button>

          {}
          <nav className="dn-nav-links" aria-label="Main navigation">
            <button
              className={`dn-nav-link${isActive("/") ? " active" : ""}`}
              onClick={() => handleNavigate("/")}
            >
              Home
            </button>
            <button
              className={`dn-nav-link${isActive("/shop") ? " active" : ""}`}
              onClick={() => handleNavigate("/shop")}
            >
              Shop
            </button>
            <button
              className="dn-nav-link"
              onClick={() => {
                if (location.pathname === "/") {
                  document
                    .getElementById("why-dairynest")
                    ?.scrollIntoView({ behavior: "smooth" });
                } else {
                  navigate("/");
                  setTimeout(
                    () =>
                      document
                        .getElementById("why-dairynest")
                        ?.scrollIntoView({ behavior: "smooth" }),
                    150,
                  );
                }
              }}
            >
              Why DairyNest
            </button>
            <button
              className="dn-nav-link"
              onClick={() => {
                if (location.pathname === "/") {
                  document
                    .getElementById("farmers-story")
                    ?.scrollIntoView({ behavior: "smooth" });
                } else {
                  navigate("/");
                  setTimeout(
                    () =>
                      document
                        .getElementById("farmers-story")
                        ?.scrollIntoView({ behavior: "smooth" }),
                    150,
                  );
                }
              }}
            >
              Our Farmers
            </button>
          </nav>

          {}
          <div className="dn-nav-right">
            {}
            <button
              className="dn-cart-btn"
              onClick={() => handleNavigate("/cart")}
              title="View Cart"
              aria-label="Shopping cart"
            >
              <FaShoppingCart />
              <span className="dn-cart-label">Cart</span>
              {cart.length > 0 && (
                <span className="dn-cart-badge">{cart.length}</span>
              )}
            </button>

            {user ? (
              <div className="dn-user-menu-wrap" ref={userMenuRef}>
                <button
                  className={`dn-user-pill${userMenuOpen ? " open" : ""}`}
                  onClick={() => {
                    setUserMenuOpen((open) => !open);
                    setMenuOpen(false);
                  }}
                  aria-label="User menu"
                  aria-expanded={userMenuOpen}
                >
                  <span className="dn-avatar">
                    {user.avatar ? (
                      <img src={getImageUrl(user.avatar)} alt="" />
                    ) : user.name ? (
                      user.name.charAt(0).toUpperCase()
                    ) : (
                      "U"
                    )}
                  </span>
                  <span className="dn-user-name">
                    {user.name?.split(" ")[0] || "User"}
                  </span>
                </button>

                {userMenuOpen && (
                  <div className="dn-user-dropdown" role="menu">
                    <div className="dn-dropdown-header">
                      <span className="dn-dropdown-avatar">
                        {user.avatar ? (
                          <img src={getImageUrl(user.avatar)} alt="" />
                        ) : user.name ? (
                          user.name.charAt(0).toUpperCase()
                        ) : (
                          "U"
                        )}
                      </span>
                      <div className="dn-dropdown-meta">
                        <strong>{user.name || "Account"}</strong>
                        <span>{user.email || user.userId || ""}</span>
                      </div>
                    </div>
                    <button
                      className="dn-dropdown-item"
                      onClick={() => handleNavigate(dashboardPath)}
                      role="menuitem"
                    >
                      <FaUser />
                      My Dashboard
                    </button>
                    {user.role === "shop" && (
                      <button
                        className="dn-dropdown-item"
                        onClick={() => handleNavigate("/orders")}
                        role="menuitem"
                      >
                        My Orders
                      </button>
                    )}
                    <button
                      className="dn-dropdown-item danger"
                      onClick={handleLogout}
                      role="menuitem"
                    >
                      <FaSignOutAlt />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button className="dn-login-btn" onClick={handleOpenAuth}>
                <FaUser />
                <span>Login / Sign Up</span>
              </button>
            )}

            <button
              className="dn-hamburger"
              onClick={() => {
                setMenuOpen((open) => !open);
                setUserMenuOpen(false);
              }}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {}
        <div
          className={`dn-mobile-drawer${menuOpen ? " open" : ""}`}
          aria-hidden={!menuOpen}
        >
          <button
            className={`dn-mob-link${isActive("/") ? " active" : ""}`}
            onClick={() => handleNavigate("/")}
          >
            🏠 Home
          </button>
          <button
            className={`dn-mob-link${isActive("/shop") ? " active" : ""}`}
            onClick={() => handleNavigate("/shop")}
          >
            🛍️ Shop Products
          </button>
          <button
            className="dn-mob-link"
            onClick={() => handleNavigate("/cart")}
          >
            🛒 Cart ({cart.length})
          </button>
          {user && (
            <button
              className="dn-mob-link"
              onClick={() => handleNavigate(dashboardPath)}
            >
              👤 My Dashboard
            </button>
          )}
          {user && user.role === "shop" && (
            <button
              className="dn-mob-link"
              onClick={() => handleNavigate("/orders")}
            >
              📦 My Orders
            </button>
          )}
          {user && user.role === "admin" && (
            <button
              className="dn-mob-link"
              onClick={() => handleNavigate("/admin")}
            >
              ⚙️ Admin Panel
            </button>
          )}
          {user && user.role === "staff" && (
            <button
              className="dn-mob-link"
              onClick={() => handleNavigate("/staff")}
            >
              🏭 Staff Portal
            </button>
          )}

          <div className="dn-mob-divider" />

          {user ? (
            <button className="dn-mob-logout" onClick={handleLogout}>
              <FaSignOutAlt style={{ marginRight: 6 }} />
              Sign Out ({user.name})
            </button>
          ) : (
            <button
              className="dn-mob-login"
              onClick={() => {
                setMenuOpen(false);
                handleOpenAuth();
              }}
            >
              Login / Register
            </button>
          )}
        </div>
      </header>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');

        /* ======== CSS VARIABLES ======== */
        :root {
          --dn-nb-bg: #0b57a4;
          --dn-nb-bg-scrolled: rgba(11, 87, 164, 0.97);
          --dn-nb-text: #ffffff;
          --dn-nb-muted: rgba(255,255,255,0.7);
          --dn-nb-accent: #ffd43b;
          --dn-nb-drawer: #084380;
          --dn-nb-dropdown-bg: #ffffff;
          --dn-nb-dropdown-text: #0f172a;
          --dn-nb-dropdown-border: rgba(0,0,0,0.1);
          --dn-nb-dropdown-hover: #f0f6ff;
          --dn-nb-link-hover: rgba(255,255,255,0.15);

          /* Page-level theme tokens */
          --dn-page-bg: #f0f6ff;
          --dn-card-bg: #ffffff;
          --dn-card-border: rgba(11,87,164,0.1);
          --dn-text: #0f2b5b;
          --dn-muted: #64748b;
          --dn-primary: #0b57a4;
          --dn-qa-bg: #f0f6ff;
          --dn-row-bg: #f8faff;
        }

        * { box-sizing: border-box; }

        /* ======== NAVBAR ======== */
        .dn-navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          background: var(--dn-nb-bg);
          color: var(--dn-nb-text);
          transition: background 0.3s ease, box-shadow 0.3s ease;
          font-family: 'Outfit', sans-serif;
          overflow: visible;
        }

        .dn-navbar.scrolled {
          background: var(--dn-nb-bg-scrolled);
          backdrop-filter: blur(14px);
          box-shadow: 0 4px 24px rgba(0,0,0,0.25);
        }

        .dn-nav-wrapper {
          max-width: 1300px;
          margin: 0 auto;
          padding: 0 20px;
          height: 64px;
          display: flex;
          align-items: center;
          gap: 12px;
          overflow: visible;
        }

        /* LOGO */
        .dn-nav-brand {
          display: flex;
          align-items: center;
          gap: 11px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          flex-shrink: 0;
          transition: transform 0.2s ease;
        }

        .dn-nav-brand:hover {
          transform: translateY(-1px);
        }

        .dn-nav-brand:active {
          transform: scale(0.96);
        }

        .dn-brand-icon {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          background: linear-gradient(135deg, #ffd43b 0%, #ffbb00 100%);
          color: #0b57a4;
          font-size: 18px;
          font-weight: 900;
          display: grid;
          place-items: center;
          box-shadow: 0 4px 12px rgba(255,212,59,0.4);
          flex-shrink: 0;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
        }

        .dn-brand-icon.refreshing {
          animation: dnLogoSpinPulse 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @keyframes dnLogoSpinPulse {
          0% {
            transform: rotate(0deg) scale(1);
            box-shadow: 0 4px 12px rgba(255,212,59,0.4);
          }
          50% {
            transform: rotate(180deg) scale(1.18);
            box-shadow: 0 0 24px rgba(255,212,59,0.9), 0 0 40px rgba(255,255,255,0.6);
          }
          100% {
            transform: rotate(360deg) scale(1);
            box-shadow: 0 4px 12px rgba(255,212,59,0.4);
          }
        }

        .dn-brand-text {
          display: flex;
          flex-direction: column;
          line-height: 1;
          transition: opacity 0.2s ease;
        }

        .dn-nav-brand.refreshing .dn-brand-name {
          animation: dnTextGlow 0.7s ease;
        }

        @keyframes dnTextGlow {
          0%, 100% { color: var(--dn-nb-text); }
          50% { color: var(--dn-nb-accent); text-shadow: 0 0 12px rgba(255,212,59,0.8); }
        }

        .dn-brand-name {
          font-size: 22px;
          font-weight: 900;
          color: var(--dn-nb-text);
          letter-spacing: -0.5px;
        }

        .dn-brand-sub {
          font-size: 10px;
          font-weight: 600;
          color: var(--dn-nb-accent);
          letter-spacing: 0.4px;
          margin-top: 3px;
        }

        /* LINKS */
        .dn-nav-links {
          display: flex;
          align-items: center;
          gap: 4px;
          margin: 0 auto;
        }

        .dn-nav-link {
          background: transparent;
          border: none;
          color: var(--dn-nb-muted);
          font-size: 14px;
          font-weight: 600;
          padding: 8px 14px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.18s ease;
          font-family: 'Outfit', sans-serif;
          white-space: nowrap;
        }

        .dn-nav-link:hover,
        .dn-nav-link.active {
          color: var(--dn-nb-text);
          background: var(--dn-nb-link-hover);
        }

        .dn-nav-link.active {
          color: var(--dn-nb-accent);
        }

        /* RIGHT */
        .dn-nav-right {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
          margin-left: auto;
          overflow: visible;
        }

        .dn-cart-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          min-width: 40px;
          height: 40px;
          padding: 0 14px;
          border-radius: 999px;
          background: rgba(255,255,255,0.12);
          color: var(--dn-nb-text);
          border: 1px solid rgba(255,255,255,0.22);
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          position: relative;
          transition: background 0.2s ease, transform 0.2s ease;
          font-family: 'Outfit', sans-serif;
        }

        .dn-cart-btn:hover {
          background: rgba(255,255,255,0.22);
        }

        .dn-cart-badge {
          background: #ef4444;
          color: #fff;
          font-size: 10px;
          font-weight: 900;
          padding: 2px 6px;
          border-radius: 999px;
        }

        /* Login btn */
        .dn-login-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #ffffff;
          color: #0b57a4;
          font-weight: 800;
          font-size: 13px;
          height: 40px;
          padding: 0 16px;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(0,0,0,0.12);
          transition: background 0.2s ease, transform 0.2s ease;
          font-family: 'Outfit', sans-serif;
          white-space: nowrap;
        }

        .dn-login-btn:hover {
          background: var(--dn-nb-accent);
          color: #0b57a4;
          transform: translateY(-1px);
        }

        .dn-user-menu-wrap {
          position: relative;
          overflow: visible;
          z-index: 20;
        }

        .dn-user-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 999px;
          height: 40px;
          padding: 4px 10px 4px 4px;
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
          transition: background 0.2s ease;
          color: var(--dn-nb-text);
        }

        .dn-user-pill:hover,
        .dn-user-pill.open {
          background: rgba(255,255,255,0.22);
        }

        .dn-avatar,
        .dn-dropdown-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--dn-nb-accent);
          color: #0b57a4;
          font-weight: 900;
          font-size: 14px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          overflow: hidden;
        }

        .dn-avatar img,
        .dn-dropdown-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .dn-user-name {
          font-size: 13px;
          font-weight: 700;
          color: var(--dn-nb-text);
          max-width: 90px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .dn-user-dropdown {
          position: fixed;
          top: 70px;
          right: 12px;
          width: min(280px, calc(100vw - 24px));
          min-width: min(280px, calc(100vw - 24px));
          max-width: calc(100vw - 24px);
          background: #ffffff;
          border: 1px solid rgba(15, 23, 42, 0.08);
          border-radius: 16px;
          box-shadow: 0 18px 50px rgba(15, 23, 42, 0.18);
          overflow: hidden;
          z-index: 1300;
          animation: dropDown 0.2s ease;
          padding: 8px;
        }

        @keyframes dropDown {
          from { opacity: 0; transform: translateY(-8px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .dn-dropdown-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 10px 12px;
          margin-bottom: 4px;
          border-bottom: 1px solid #eef2f7;
        }

        .dn-dropdown-avatar {
          width: 42px;
          height: 42px;
          font-size: 16px;
        }

        .dn-dropdown-meta {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .dn-dropdown-meta strong {
          font-size: 14px;
          font-weight: 800;
          color: #0f172a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .dn-dropdown-meta span {
          font-size: 12px;
          color: #64748b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .dn-dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 11px 12px;
          background: none;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          color: #0f172a;
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
          text-align: left;
          white-space: nowrap;
        }

        .dn-dropdown-item svg {
          width: 14px;
          flex-shrink: 0;
          opacity: 0.75;
        }

        .dn-dropdown-item:hover {
          background: #f0f6ff;
        }

        .dn-dropdown-item.danger {
          color: #dc2626;
        }

        .dn-dropdown-item.danger:hover {
          background: rgba(239,68,68,0.08);
        }

        .dn-hamburger {
          display: none;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.2);
          color: var(--dn-nb-text);
          font-size: 16px;
          place-items: center;
          cursor: pointer;
          transition: background 0.2s;
        }

        .dn-hamburger:hover {
          background: rgba(255,255,255,0.22);
        }

        /* ======== MOBILE DRAWER ======== */
        .dn-mobile-drawer {
          background: var(--dn-nb-drawer);
          display: flex;
          flex-direction: column;
          gap: 4px;
          border-top: 1px solid rgba(255,255,255,0.08);
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.32s ease, padding 0.32s ease;
          padding: 0 16px;
        }

        .dn-mobile-drawer.open {
          max-height: 70vh;
          padding: 10px 16px 18px;
        }

        .dn-mob-link {
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.88);
          font-size: 15px;
          font-weight: 600;
          text-align: left;
          padding: 12px 14px;
          border-radius: 10px;
          cursor: pointer;
          transition: background 0.18s ease, color 0.18s ease;
          font-family: 'Outfit', sans-serif;
        }

        .dn-mob-link:hover,
        .dn-mob-link.active {
          background: rgba(255,255,255,0.1);
          color: var(--dn-nb-accent);
        }

        .dn-mob-divider {
          height: 1px;
          background: rgba(255,255,255,0.1);
          margin: 8px 0;
        }

        .dn-mob-login {
          background: var(--dn-nb-accent);
          color: #0b57a4;
          border: none;
          padding: 13px;
          border-radius: 10px;
          font-weight: 800;
          font-size: 14px;
          margin-top: 6px;
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
        }

        .dn-mob-logout {
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(239,68,68,0.15);
          color: #fca5a5;
          border: 1px solid rgba(239,68,68,0.3);
          padding: 12px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 14px;
          margin-top: 6px;
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
          transition: background 0.2s, color 0.2s;
        }

        .dn-mob-logout:hover {
          background: #ef4444;
          color: #fff;
        }

        @media (max-width: 1024px) {
          .dn-nav-links { gap: 2px; }
          .dn-nav-link { font-size: 13px; padding: 8px 10px; }
        }

        @media (max-width: 860px) {
          .dn-nav-links { display: none; }
          .dn-hamburger { display: grid; }
          .dn-cart-label { display: none; }
          .dn-cart-btn { padding: 0; width: 40px; }
          .dn-user-name { display: none; }
          .dn-user-pill { padding: 3px; width: 40px; height: 40px; justify-content: center; }
          .dn-login-btn span { display: none; }
          .dn-login-btn { width: 40px; padding: 0; justify-content: center; }
          .dn-nav-wrapper { padding: 0 12px; gap: 8px; }
        }

        @media (max-width: 480px) {
          .dn-brand-sub { display: none; }
          .dn-brand-name { font-size: 17px; }
          .dn-brand-icon { width: 34px; height: 34px; font-size: 15px; }
          .dn-nav-right { gap: 6px; }
          .dn-user-dropdown { right: 8px; top: 66px; }
        }
      `}</style>
    </>
  );
};

export default Navbar;
