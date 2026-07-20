import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaBoxOpen,
  FaChartLine,
  FaHome,
  FaShoppingCart,
  FaSignOutAlt,
  FaStore,
  FaTimes,
  FaTruck,
  FaUserShield,
} from "react-icons/fa";

const Navbar = ({ cart = [] }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user")) || null;

  const navItems = useMemo(() => {
    if (!user) {
      return [];
    }

    if (user.role === "shop") {
      return [
        { label: "Shop", path: "/shop", icon: <FaStore /> },
        { label: "Cart", path: "/cart", icon: <FaShoppingCart />, badge: cart.length },
        { label: "Orders", path: "/orders", icon: <FaBoxOpen /> },
      ];
    }

    if (user.role === "admin") {
      return [
        { label: "Dashboard", path: "/admin", icon: <FaChartLine /> },
        { label: "Orders", path: "/admin/orders", icon: <FaTruck /> },
      ];
    }

    if (user.role === "staff") {
      return [{ label: "Staff Panel", path: "/staff", icon: <FaUserShield /> }];
    }

    return [];
  }, [cart.length, user]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleNavigate = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };

  const handleGetStarted = () => {
    sessionStorage.setItem("openAuth", "true");

    if (location.pathname === "/") {
      window.dispatchEvent(new Event("open-auth"));
      return;
    }

    navigate("/");
  };

  const activeMenu = (path) => (location.pathname === path ? "active-link" : "");
  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <>
      <style>{`
      * {
        box-sizing: border-box;
      }

      .premium-navbar {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 999;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 18px;
        min-height: 78px;
        padding: 12px clamp(16px, 4vw, 58px);
        background: linear-gradient(90deg, rgba(20, 73, 157, 0.96), rgba(25, 113, 194, 0.96));
        border-bottom: 1px solid rgba(255, 255, 255, 0.16);
        box-shadow: 0 12px 34px rgba(15, 43, 88, 0.28);
        backdrop-filter: blur(18px);
        animation: navbarDrop 0.55s ease both;
      }

      .premium-navbar::after {
        content: "";
        position: absolute;
        inset: auto 0 0 0;
        height: 3px;
        background: linear-gradient(90deg, #ffd43b, #42d392, #ffffff, #ffd43b);
        background-size: 220% 100%;
        animation: shimmerLine 4s linear infinite;
      }

      .premium-logo {
        position: relative;
        display: flex;
        align-items: center;
        flex: 0 0 auto;
        gap: 12px;
        min-width: 0;
        cursor: pointer;
      }

      .premium-logo-icon {
        width: 52px;
        height: 52px;
        border-radius: 8px;
        display: grid;
        place-items: center;
        color: #14499d;
        font-size: 18px;
        font-weight: 900;
        background: linear-gradient(145deg, #ffffff, #ffde59);
        box-shadow: 0 10px 22px rgba(0, 0, 0, 0.2);
        transform-style: preserve-3d;
        transition: transform 0.65s ease, box-shadow 0.3s ease;
      }

      .premium-logo:hover .premium-logo-icon {
        transform: rotateY(180deg);
        box-shadow: 0 14px 28px rgba(255, 212, 59, 0.35);
      }

      .premium-logo-text h1 {
        margin: 0;
        color: #ffffff;
        font-size: clamp(22px, 2vw, 30px);
        font-weight: 900;
        line-height: 1;
        letter-spacing: 0;
      }

      .premium-logo-text p {
        margin: 5px 0 0;
        color: #ffe884;
        font-size: 12px;
        font-weight: 700;
      }

      .premium-links {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1 1 auto;
        gap: 10px;
        min-width: 0;
      }

      .premium-link {
        position: relative;
        border: 0;
        outline: 0;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        min-height: 44px;
        padding: 11px 17px;
        border-radius: 8px;
        overflow: hidden;
        background: rgba(255, 255, 255, 0.1);
        color: #f8fbff;
        font-size: 15px;
        font-weight: 800;
        transition: transform 0.28s ease, background 0.28s ease, color 0.28s ease;
      }

      .premium-link::before {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, rgba(255, 212, 59, 0.95), rgba(255, 255, 255, 0.95));
        transform: translateY(102%);
        transition: transform 0.3s ease;
        z-index: -1;
      }

      .premium-link:hover,
      .premium-link.active-link {
        color: #14499d;
        transform: translateY(-2px);
      }

      .premium-link:hover::before,
      .premium-link.active-link::before {
        transform: translateY(0);
      }

      .premium-link svg {
        flex: 0 0 auto;
        font-size: 15px;
      }

      .cart-badge {
        min-width: 19px;
        height: 19px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0 5px;
        border-radius: 999px;
        color: #ffffff;
        background: #ef4444;
        font-size: 11px;
        font-weight: 900;
        box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.75);
      }

      .premium-right {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        flex: 0 0 auto;
        gap: 12px;
      }

      .premium-user {
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 0;
        padding: 6px 10px 6px 6px;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.11);
      }

      .premium-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        color: #14499d;
        font-size: 17px;
        font-weight: 900;
        background: #ffffff;
      }

      .premium-user h4 {
        max-width: 130px;
        margin: 0;
        overflow: hidden;
        color: #ffffff;
        font-size: 14px;
        font-weight: 900;
        line-height: 1.15;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .premium-user span {
        display: block;
        margin-top: 2px;
        color: #ffe884;
        font-size: 11px;
        font-weight: 800;
        text-transform: uppercase;
      }

      .logout-btn,
      .guest-btn,
      .mobile-menu-btn {
        border: 0;
        outline: 0;
        cursor: pointer;
        border-radius: 8px;
        transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
      }

      .logout-btn,
      .guest-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        min-height: 44px;
        padding: 11px 18px;
        color: #14499d;
        background: #ffffff;
        font-size: 14px;
        font-weight: 900;
      }

      .logout-btn:hover,
      .guest-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 22px rgba(0, 0, 0, 0.22);
        background: #ffde59;
      }

      .mobile-menu-btn {
        display: none;
        width: 44px;
        height: 44px;
        align-items: center;
        justify-content: center;
        color: #14499d;
        background: #ffffff;
        font-size: 18px;
      }

      .mobile-backdrop {
        display: none;
      }

      @keyframes navbarDrop {
        from {
          opacity: 0;
          transform: translateY(-22px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes shimmerLine {
        to {
          background-position: 220% 0;
        }
      }

      @media (max-width: 1050px) {
        .premium-navbar {
          gap: 12px;
        }

        .premium-links {
          position: fixed;
          top: 78px;
          right: 14px;
          display: flex;
          align-items: stretch;
          flex-direction: column;
          width: min(320px, calc(100vw - 28px));
          padding: 14px;
          border-radius: 8px;
          background: #ffffff;
          box-shadow: 0 22px 44px rgba(10, 32, 72, 0.28);
          opacity: 0;
          pointer-events: none;
          transform: translateY(-10px) scale(0.98);
          transform-origin: top right;
          transition: opacity 0.25s ease, transform 0.25s ease;
        }

        .premium-links.open {
          opacity: 1;
          pointer-events: auto;
          transform: translateY(0) scale(1);
        }

        .premium-link {
          justify-content: flex-start;
          width: 100%;
          color: #14499d;
          background: #eef5ff;
        }

        .premium-link::before {
          background: linear-gradient(135deg, #14499d, #1971c2);
        }

        .premium-link:hover,
        .premium-link.active-link {
          color: #ffffff;
        }

        .mobile-menu-btn {
          display: inline-flex;
        }

        .mobile-backdrop {
          position: fixed;
          inset: 78px 0 0;
          display: block;
          background: rgba(8, 20, 42, 0.28);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.25s ease;
        }

        .mobile-backdrop.open {
          opacity: 1;
          pointer-events: auto;
        }
      }

      @media (max-width: 720px) {
        .premium-navbar {
          min-height: 70px;
          padding: 10px 14px;
        }

        .premium-logo {
          gap: 9px;
        }

        .premium-logo-icon {
          width: 44px;
          height: 44px;
          font-size: 15px;
        }

        .premium-logo-text h1 {
          font-size: 21px;
        }

        .premium-logo-text p,
        .premium-user div:not(.premium-avatar),
        .logout-btn span {
          display: none;
        }

        .premium-user {
          padding: 0;
          background: transparent;
        }

        .premium-avatar,
        .logout-btn,
        .guest-btn,
        .mobile-menu-btn {
          width: 42px;
          height: 42px;
          min-height: 42px;
          padding: 0;
        }

        .guest-btn {
          width: auto;
          padding: 0 13px;
          font-size: 13px;
        }

        .premium-links {
          top: 70px;
        }

        .mobile-backdrop {
          inset: 70px 0 0;
        }
      }

      @media (max-width: 430px) {
        .premium-logo-text h1 {
          font-size: 18px;
        }

        .premium-right {
          gap: 8px;
        }

        .premium-avatar {
          display: none;
        }
      }
      `}</style>

      <nav className="premium-navbar">
        <div className="premium-logo" onClick={() => handleNavigate("/")}>
          <div className="premium-logo-icon">DN</div>
          <div className="premium-logo-text">
            <h1>DairyNest</h1>
            <p>Premium Dairy Platform</p>
          </div>
        </div>

        <div className={`mobile-backdrop ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(false)} />

        {user && (
          <div className={`premium-links ${menuOpen ? "open" : ""}`}>
            {navItems.map((item) => (
              <button
                key={item.path}
                className={`premium-link ${activeMenu(item.path)}`}
                onClick={() => handleNavigate(item.path)}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge > 0 && <span className="cart-badge">{item.badge}</span>}
              </button>
            ))}
          </div>
        )}

        <div className="premium-right">
          {user ? (
            <>
              <div className="premium-user">
                <div className="premium-avatar">{userInitial}</div>
                <div>
                  <h4>{user?.name}</h4>
                  <span>{user?.role}</span>
                </div>
              </div>

              <button className="logout-btn" onClick={handleLogout} aria-label="Logout">
                <FaSignOutAlt />
                <span>Logout</span>
              </button>

              {navItems.length > 0 && (
                <button
                  className="mobile-menu-btn"
                  onClick={() => setMenuOpen((isOpen) => !isOpen)}
                  aria-label={menuOpen ? "Close menu" : "Open menu"}
                  aria-expanded={menuOpen}
                >
                  {menuOpen ? <FaTimes /> : <FaBars />}
                </button>
              )}
            </>
          ) : (
            <button className="guest-btn" onClick={handleGetStarted}>
              <FaHome />
              Get Started
            </button>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
