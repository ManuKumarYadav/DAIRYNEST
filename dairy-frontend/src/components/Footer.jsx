import React, { useState } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaFileContract,
  FaBuilding,
  FaLock,
  FaUndoAlt,
  FaCheckCircle,
  FaTimes,
  FaCertificate,
  FaAward,
} from "react-icons/fa";

const Footer = () => {
  const [activeModal, setActiveModal] = useState(null); // 'terms' | 'privacy' | 'company' | 'refund' | 'fssai'

  const closeModal = () => setActiveModal(null);

  return (
    <>
      <footer className="dairynest-footer">
        <div className="section-container">
          {/* TOP GRID */}
          <div className="footer-top-grid">
            {/* Column 1: Brand & Farmer Bio */}
            <div className="footer-brand-col">
              <div className="footer-brand-header">
                <div className="brand-badge-icon">DN</div>
                <div className="brand-details">
                  <span className="brand-name">DairyNest</span>
                  <span className="brand-tagline">Pure Dairy Platform</span>
                </div>
              </div>
              <p className="footer-bio">
                DairyNest Technologies Private Limited connects 50,000+ village farmers with modern urban households, delivering 100% unadulterated farm-fresh milk, bilona ghee, and artisan dairy products directly to your doorstep.
              </p>
              <div className="footer-social-links">
                <a href="#social" aria-label="Facebook"><FaFacebookF /></a>
                <a href="#social" aria-label="Twitter"><FaTwitter /></a>
                <a href="#social" aria-label="Instagram"><FaInstagram /></a>
                <a href="#social" aria-label="YouTube"><FaYoutube /></a>
                <a href="#social" aria-label="WhatsApp"><FaWhatsapp /></a>
              </div>

              {/* Trust Badges */}
              <div className="footer-trust-chips">
                <span className="trust-chip"><FaAward /> ISO 22000 Certified</span>
                <span className="trust-chip"><FaLock /> 256-Bit SSL Secured</span>
              </div>
            </div>

            {/* Column 2: Popular Products */}
            <div className="footer-links-col">
              <h4>Popular Dairy</h4>
              <ul>
                <li><a href="#shop-products">DairyNest Gold Full Cream</a></li>
                <li><a href="#shop-products">DairyNest Taaza Toned Milk</a></li>
                <li><a href="#shop-products">A2 Desi Cow Bilona Ghee</a></li>
                <li><a href="#shop-products">Fresh Organic Malai Paneer</a></li>
                <li><a href="#shop-products">Farm Fresh Creamy Butter</a></li>
                <li><a href="#shop-products">Probiotic Artisanal Dahi</a></li>
              </ul>
            </div>

            {/* Column 3: Important Legal & Company Tags */}
            <div className="footer-links-col">
              <h4>Company & Legal</h4>
              <ul className="footer-action-links">
                <li>
                  <button type="button" onClick={() => setActiveModal("company")}>
                    <FaBuilding className="link-icon" /> Company Details & CIN
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => setActiveModal("terms")}>
                    <FaFileContract className="link-icon" /> Terms & Conditions
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => setActiveModal("privacy")}>
                    <FaShieldAlt className="link-icon" /> Privacy & Data Policy
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => setActiveModal("refund")}>
                    <FaUndoAlt className="link-icon" /> Refund & Return Policy
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => setActiveModal("fssai")}>
                    <FaCertificate className="link-icon" /> FSSAI Food Safety Lic.
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Registered Office & Helpdesk */}
            <div className="footer-links-col">
              <h4>Headquarters</h4>
              <div className="contact-item">
                <FaBuilding className="contact-icon" />
                <span><strong>DairyNest Technologies Pvt. Ltd.</strong></span>
              </div>
              <div className="contact-item">
                <FaMapMarkerAlt className="contact-icon" />
                <span>Motihari, East Champaran, Bihar, India — 845437</span>
              </div>
              <div className="contact-item">
                <FaPhoneAlt className="contact-icon" />
                <span>1800-258-3333 (Toll Free 6 AM - 9 PM)</span>
              </div>
              <div className="contact-item">
                <FaEnvelope className="contact-icon" />
                <span>support@dairynest.com</span>
              </div>

              {/* FSSAI Quick Badge */}
              <div className="fssai-box" onClick={() => setActiveModal("fssai")} title="Click to view FSSAI certificate">
                <span className="fssai-text">Central FSSAI Lic. No.</span>
                <strong>10014021001234</strong>
                <span className="fssai-view-tag">Verified &bull; View Details</span>
              </div>
            </div>
          </div>

          {/* CORPORATE SUMMARY STRIP */}
          <div className="footer-corp-strip">
            <div className="corp-item">
              <span className="corp-label">CIN:</span>
              <span className="corp-val">U15200GJ2024PTC148920</span>
            </div>
            <div className="corp-divider" />
            <div className="corp-item">
              <span className="corp-label">GSTIN:</span>
              <span className="corp-val">24AAACD1234F1Z5</span>
            </div>
            <div className="corp-divider" />
            <div className="corp-item">
              <span className="corp-label">Cold-Chain Standard:</span>
              <span className="corp-val">4°C Constant Refrigeration</span>
            </div>
            <div className="corp-divider" />
            <div className="corp-item">
              <span className="corp-label">Nodal Grievance:</span>
              <span className="corp-val">grievance@dairynest.com</span>
            </div>
          </div>

          {/* BOTTOM COPYRIGHT & POLICY LINKS */}
          <div className="footer-bottom-row">
            <p>© {new Date().getFullYear()} DairyNest Technologies Private Limited. All rights reserved.</p>
            <div className="footer-policy-links">
              <button type="button" onClick={() => setActiveModal("privacy")}>Privacy Policy</button>
              <span className="dot-sep">&bull;</span>
              <button type="button" onClick={() => setActiveModal("terms")}>Terms & Conditions</button>
              <span className="dot-sep">&bull;</span>
              <button type="button" onClick={() => setActiveModal("refund")}>Refund Policy</button>
              <span className="dot-sep">&bull;</span>
              <button type="button" onClick={() => setActiveModal("company")}>Corporate Details</button>
            </div>
          </div>
        </div>
      </footer>

      {/* DETAILS MODAL POPUP */}
      {activeModal && (
        <div className="dn-modal-backdrop" onClick={closeModal}>
          <div className="dn-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="dn-modal-header">
              <div className="dn-modal-title-row">
                {activeModal === "company" && <FaBuilding className="dn-modal-icon" />}
                {activeModal === "terms" && <FaFileContract className="dn-modal-icon" />}
                {activeModal === "privacy" && <FaShieldAlt className="dn-modal-icon" />}
                {activeModal === "refund" && <FaUndoAlt className="dn-modal-icon" />}
                {activeModal === "fssai" && <FaCertificate className="dn-modal-icon" />}
                <h3>
                  {activeModal === "company" && "Company & Corporate Details"}
                  {activeModal === "terms" && "Terms of Service & Usage Conditions"}
                  {activeModal === "privacy" && "Privacy & Data Protection Policy"}
                  {activeModal === "refund" && "Cancellation, Return & Refund Policy"}
                  {activeModal === "fssai" && "FSSAI Food Safety & Purity Standards"}
                </h3>
              </div>
              <button className="dn-modal-close-btn" onClick={closeModal} aria-label="Close dialog">
                <FaTimes />
              </button>
            </div>

            <div className="dn-modal-body">
              {/* COMPANY DETAILS */}
              {activeModal === "company" && (
                <div className="dn-legal-content">
                  <div className="dn-info-grid">
                    <div className="dn-info-tile">
                      <span className="tile-title">Corporate Name</span>
                      <strong>DairyNest Technologies Private Limited</strong>
                    </div>
                    <div className="dn-info-tile">
                      <span className="tile-title">CIN (Corporate ID)</span>
                      <strong>U15200GJ2024PTC148920</strong>
                    </div>
                    <div className="dn-info-tile">
                      <span className="tile-title">GST Identification</span>
                      <strong>24AAACD1234F1Z5</strong>
                    </div>
                    <div className="dn-info-tile">
                      <span className="tile-title">Central FSSAI License</span>
                      <strong>10014021001234</strong>
                    </div>
                  </div>

                  <h4>Corporate Headquarters</h4>
                  <p>
                    DairyNest Technologies Private Limited<br />
                    Motihari, East Champaran, Bihar, India — 845437
                  </p>

                  <h4>Processing Plants & Milk Collection Hubs</h4>
                  <ul>
                    <li><strong>Bihar HQ & Collection Hub:</strong> Motihari, East Champaran, Bihar — 845437</li>
                    <li><strong>Western Processing Plant:</strong> GIDC Naroda Phase IV, Ahmedabad, Gujarat — 382330</li>
                    <li><strong>South Distribution Hub:</strong> Whitefield Main Road, Bengaluru, Karnataka - 560066</li>
                  </ul>

                  <h4>Management & Farmer Welfare Committee</h4>
                  <p>
                    DairyNest operates on an ethical co-operative direct-payout model ensuring zero middleman commissions, automated FAT% milk testing at chilling centers, and direct next-day bank transfers to over 50,000 dairy farmers across rural India.
                  </p>

                  <h4>Official Grievance Officer</h4>
                  <p>
                    <strong>Name:</strong> Rajeshwar Verma<br />
                    <strong>Email:</strong> grievance@dairynest.com | <strong>Contact:</strong> 1800-258-3333 (Ext. 4)
                  </p>
                </div>
              )}

              {/* TERMS & CONDITIONS */}
              {activeModal === "terms" && (
                <div className="dn-legal-content">
                  <h4>1. Introduction & Acceptance of Terms</h4>
                  <p>
                    By downloading, accessing, or placing an order through the DairyNest platform (web portal or mobile application), you agree to be bound by these Terms and Conditions. DairyNest provides farm-fresh milk, bilona ghee, paneer, and certified dairy commodities.
                  </p>

                  <h4>2. Delivery Schedule & Cold-Chain Protocol</h4>
                  <ul>
                    <li><strong>Morning Fresh Slot:</strong> 6:00 AM to 8:00 AM daily.</li>
                    <li><strong>Evening Fresh Slot:</strong> 5:00 PM to 8:00 PM.</li>
                    <li>All dairy products are transported in certified insulated vehicles at or below 4°C to preserve enzymatic freshness and zero-preservative integrity.</li>
                  </ul>

                  <h4>3. Pricing, Billing & Payment</h4>
                  <p>
                    All prices are quoted in Indian Rupees (INR) and are inclusive of applicable GST. Payments are securely processed via Razorpay gateway supporting UPI, Credit/Debit Cards, Net Banking, and Wallet accounts. DairyNest does not store your sensitive card or banking credentials.
                  </p>

                  <h4>4. Subscription & Pause Delivery</h4>
                  <p>
                    Daily milk subscriptions may be modified or paused up to 8:00 PM on the evening prior to the scheduled morning delivery without any penalty or deduction.
                  </p>

                  <h4>5. Customer Conduct & Doorstep Delivery</h4>
                  <p>
                    Customers are requested to provide accurate doorstep address landmarks and maintain clean doorstep delivery bags or insulated boxes for safe handover.
                  </p>
                </div>
              )}

              {/* PRIVACY POLICY */}
              {activeModal === "privacy" && (
                <div className="dn-legal-content">
                  <h4>1. Information Collection & Usage</h4>
                  <p>
                    DairyNest collects recipient name, verified mobile number, doorstep delivery coordinates (GPS latitude/longitude), and delivery notes solely for routing farm-fresh dairy parcels to your doorstep.
                  </p>

                  <h4>2. Zero Third-Party Sale Commitment</h4>
                  <p>
                    We strictly do NOT sell, rent, or trade your personal information, address records, or phone numbers to third-party telemarketers or external advertisers.
                  </p>

                  <h4>3. Payment & Transaction Security</h4>
                  <p>
                    All online payments are end-to-end encrypted via PCI-DSS compliant Razorpay infrastructure with 256-Bit SSL protection.
                  </p>

                  <h4>4. Location Permissions (GPS)</h4>
                  <p>
                    Geolocation data is accessed exclusively when you click *"Use Current Location"* on the interactive address map to automatically pinpoint your delivery doorstep for accurate milk delivery routing.
                  </p>

                  <h4>5. Account Data & Deletion</h4>
                  <p>
                    You retain the right to review, update, or request complete deletion of your account profile and saved address books at any time by contacting privacy@dairynest.com.
                  </p>
                </div>
              )}

              {/* REFUND POLICY */}
              {activeModal === "refund" && (
                <div className="dn-legal-content">
                  <h4>1. 100% Purity & Freshness Guarantee</h4>
                  <p>
                    If any milk packet, paneer, or curd delivered by DairyNest fails quality expectations (e.g. curdling upon boiling, leakage in transit, or delivery temperature variance), you are entitled to a full 100% instant refund or free replacement.
                  </p>

                  <h4>2. Reporting Timeline</h4>
                  <p>
                    Due to the perishable nature of raw milk and fresh dairy:
                    <ul>
                      <li>Morning slot issues must be reported before 12:00 PM on the date of delivery.</li>
                      <li>Evening slot issues must be reported within 4 hours of delivery.</li>
                    </ul>
                  </p>

                  <h4>3. Instant Refund Processing</h4>
                  <p>
                    Refunds for approved claims are credited back to the original payment source (UPI / Bank Account) within 24 to 48 business hours.
                  </p>

                  <h4>4. Cancellation Policy</h4>
                  <p>
                    Orders can be canceled anytime before order dispatch without any cancellation fee directly from the Order Dashboard.
                  </p>
                </div>
              )}

              {/* FSSAI & QUALITY CERTIFICATIONS */}
              {activeModal === "fssai" && (
                <div className="dn-legal-content">
                  <div className="dn-fssai-highlight">
                    <span className="fssai-big-tag">Food Safety and Standards Authority of India</span>
                    <h2>Central License No: 10014021001234</h2>
                    <p>Issued under Food Safety and Standards Act, 2006 (Government of India)</p>
                  </div>

                  <h4>Certified Quality Parameters</h4>
                  <ul>
                    <li><FaCheckCircle className="check-icon" /> <strong>Zero Synthetic Adulterants:</strong> No urea, starch, detergent, or maltodextrin.</li>
                    <li><FaCheckCircle className="check-icon" /> <strong>Zero Hormonal Injections:</strong> Free from synthetic oxytocin or growth hormones.</li>
                    <li><FaCheckCircle className="check-icon" /> <strong>Automated Testing:</strong> Dual ultrasonic FAT & SNF digital verification at village intake centers.</li>
                    <li><FaCheckCircle className="check-icon" /> <strong>Cold-Chain Monitored:</strong> Chilled below 4°C within 45 minutes of milking.</li>
                  </ul>

                  <h4>Accredited Testing Labs</h4>
                  <p>
                    Our daily samples are routinely cross-verified by NABL-accredited national dairy testing laboratories to ensure compliant microbiological and nutritional values.
                  </p>
                </div>
              )}
            </div>

            <div className="dn-modal-footer">
              <span className="dn-modal-disclaimer">Official Disclosure &bull; DairyNest Technologies Private Limited</span>
              <button className="dn-modal-done-btn" onClick={closeModal}>Close Details</button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER & MODAL STYLING */}
      <style>{`
        /* ======== FOOTER ======== */
        .dairynest-footer {
          background: #0b192e;
          color: #94a3b8;
          padding: 68px 0 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          font-family: 'Outfit', sans-serif;
        }

        .footer-top-grid {
          display: grid;
          grid-template-columns: 2fr 1.2fr 1.3fr 1.5fr;
          gap: 36px;
          margin-bottom: 40px;
        }

        .footer-brand-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .brand-badge-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: linear-gradient(135deg, #ffd43b 0%, #ffbb00 100%);
          color: #0b57a4;
          font-size: 20px;
          font-weight: 900;
          display: grid;
          place-items: center;
          box-shadow: 0 4px 14px rgba(255, 212, 59, 0.35);
          flex-shrink: 0;
        }

        .brand-details {
          display: flex;
          flex-direction: column;
        }

        .brand-name {
          font-size: 24px;
          font-weight: 900;
          color: #ffffff;
          letter-spacing: -0.5px;
        }

        .brand-tagline {
          font-size: 11px;
          font-weight: 600;
          color: #ffd43b;
          letter-spacing: 0.5px;
        }

        .footer-bio {
          font-size: 13.5px;
          line-height: 1.65;
          color: #94a3b8;
          margin-bottom: 18px;
          max-width: 380px;
        }

        .footer-social-links {
          display: flex;
          gap: 10px;
          margin-bottom: 18px;
        }

        .footer-social-links a {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
          display: grid;
          place-items: center;
          font-size: 14px;
          transition: all 0.2s ease;
          border: 1px solid rgba(255, 255, 255, 0.12);
        }

        .footer-social-links a:hover {
          background: #ffd43b;
          color: #0b3f8a;
          transform: translateY(-2px);
          border-color: #ffd43b;
        }

        .footer-trust-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .trust-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 999px;
          padding: 4px 10px;
          font-size: 11.5px;
          color: #cbd5e1;
          font-weight: 600;
        }

        .trust-chip svg {
          color: #ffd43b;
        }

        .footer-links-col h4 {
          color: #ffffff;
          font-size: 16px;
          font-weight: 800;
          margin-bottom: 18px;
          letter-spacing: 0.2px;
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
          font-size: 13.5px;
          transition: color 0.2s;
        }

        .footer-links-col ul li a:hover {
          color: #ffd43b;
          padding-left: 2px;
        }

        .footer-action-links button {
          background: none;
          border: none;
          color: #94a3b8;
          font-size: 13.5px;
          font-family: inherit;
          cursor: pointer;
          padding: 0;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
          text-align: left;
        }

        .footer-action-links button .link-icon {
          color: #ffd43b;
          font-size: 12px;
        }

        .footer-action-links button:hover {
          color: #ffffff;
          transform: translateX(3px);
        }

        .contact-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 13px;
          color: #cbd5e1;
          margin-bottom: 10px;
          line-height: 1.5;
        }

        .contact-icon {
          color: #ffd43b;
          margin-top: 3px;
          flex-shrink: 0;
          font-size: 13px;
        }

        .fssai-box {
          margin-top: 14px;
          padding: 12px 14px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          border: 1px solid rgba(255, 212, 59, 0.3);
          cursor: pointer;
          transition: all 0.2s;
        }

        .fssai-box:hover {
          background: rgba(255, 212, 59, 0.1);
          border-color: #ffd43b;
        }

        .fssai-text {
          display: block;
          font-size: 11px;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 700;
        }

        .fssai-box strong {
          color: #ffffff;
          font-size: 15px;
          font-family: monospace;
          letter-spacing: 1px;
          display: block;
          margin: 2px 0;
        }

        .fssai-view-tag {
          display: block;
          font-size: 11px;
          color: #ffd43b;
          font-weight: 700;
        }

        /* CORPORATE DETAILS STRIP */
        .footer-corp-strip {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 12px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 24px;
          font-size: 12px;
        }

        .corp-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .corp-label {
          color: #64748b;
          font-weight: 600;
        }

        .corp-val {
          color: #e2e8f0;
          font-weight: 700;
          font-family: monospace;
        }

        .corp-divider {
          width: 1px;
          height: 16px;
          background: rgba(255, 255, 255, 0.1);
        }

        /* BOTTOM ROW */
        .footer-bottom-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12.5px;
          color: #64748b;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding-top: 20px;
          flex-wrap: wrap;
          gap: 14px;
        }

        .footer-policy-links {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .footer-policy-links button {
          background: none;
          border: none;
          color: #94a3b8;
          font-size: 12.5px;
          font-family: inherit;
          cursor: pointer;
          padding: 0;
          transition: color 0.2s;
        }

        .footer-policy-links button:hover {
          color: #ffd43b;
        }

        .dot-sep {
          color: #475569;
        }

        /* ======== MODAL STYLES ======== */
        .dn-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 99999;
          background: rgba(5, 15, 35, 0.75);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: modalFadeIn 0.2s ease;
        }

        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .dn-modal-card {
          width: 100%;
          max-width: 720px;
          max-height: 85vh;
          background: #ffffff;
          border-radius: 20px;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: modalSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          color: #0f172a;
          font-family: 'Outfit', sans-serif;
        }

        @keyframes modalSlideUp {
          from { transform: translateY(20px) scale(0.97); }
          to { transform: translateY(0) scale(1); }
        }

        .dn-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          border-bottom: 1px solid #e2e8f0;
          background: #f8fafc;
        }

        .dn-modal-title-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .dn-modal-icon {
          color: #0b57a4;
          font-size: 22px;
        }

        .dn-modal-header h3 {
          font-size: 18px;
          font-weight: 800;
          color: #0b3f8a;
          margin: 0;
        }

        .dn-modal-close-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid #cbd5e1;
          background: #ffffff;
          color: #64748b;
          font-size: 16px;
          display: grid;
          place-items: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .dn-modal-close-btn:hover {
          background: #ef4444;
          color: #ffffff;
          border-color: #ef4444;
        }

        .dn-modal-body {
          padding: 24px 28px;
          overflow-y: auto;
          flex: 1;
        }

        .dn-legal-content h4 {
          font-size: 15px;
          font-weight: 800;
          color: #0b3f8a;
          margin: 20px 0 8px 0;
        }

        .dn-legal-content h4:first-child {
          margin-top: 0;
        }

        .dn-legal-content p {
          font-size: 13.5px;
          line-height: 1.65;
          color: #475569;
          margin-bottom: 12px;
        }

        .dn-legal-content ul {
          padding-left: 20px;
          margin-bottom: 14px;
        }

        .dn-legal-content ul li {
          font-size: 13px;
          line-height: 1.6;
          color: #475569;
          margin-bottom: 6px;
        }

        .dn-info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 20px;
        }

        .dn-info-tile {
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 12px 14px;
        }

        .dn-info-tile .tile-title {
          display: block;
          font-size: 11px;
          color: #64748b;
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 2px;
        }

        .dn-info-tile strong {
          font-size: 13.5px;
          color: #0f172a;
        }

        .dn-fssai-highlight {
          background: linear-gradient(135deg, #0b57a4, #0878b8);
          color: #ffffff;
          padding: 20px;
          border-radius: 14px;
          margin-bottom: 20px;
          text-align: center;
        }

        .fssai-big-tag {
          font-size: 11px;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          color: #ffd43b;
          font-weight: 800;
          display: block;
          margin-bottom: 6px;
        }

        .dn-fssai-highlight h2 {
          font-size: 20px;
          font-weight: 900;
          margin: 0 0 6px 0;
          color: #ffffff;
          letter-spacing: 1px;
        }

        .dn-fssai-highlight p {
          font-size: 12px;
          color: #e2e8f0;
          margin: 0;
        }

        .check-icon {
          color: #16a34a;
          margin-right: 4px;
        }

        .dn-modal-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 24px;
          border-top: 1px solid #e2e8f0;
          background: #f8fafc;
        }

        .dn-modal-disclaimer {
          font-size: 11.5px;
          color: #64748b;
          font-weight: 600;
        }

        .dn-modal-done-btn {
          background: #0b57a4;
          color: #ffffff;
          border: none;
          padding: 8px 18px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s;
        }

        .dn-modal-done-btn:hover {
          background: #08407a;
        }

        /* RESPONSIVE */
        @media (max-width: 1024px) {
          .footer-top-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .dairynest-footer {
            padding: 50px 0 20px;
          }

          .footer-top-grid {
            grid-template-columns: 1fr;
            gap: 28px;
          }

          .footer-corp-strip {
            flex-direction: column;
            align-items: flex-start;
          }

          .corp-divider {
            display: none;
          }

          .dn-info-grid {
            grid-template-columns: 1fr;
          }

          .dn-modal-card {
            max-height: 92vh;
          }
        }
      `}</style>
    </>
  );
};

export default Footer;
