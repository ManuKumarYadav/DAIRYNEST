import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./AddressPage.css";
import {
  FaArrowRight,
  FaClock,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaTruck,
  FaUser,
  FaHome,
  FaBriefcase,
  FaSearch,
  FaCrosshairs,
  FaCheckCircle,
  FaShieldAlt,
  FaCity,
  FaCompass,
  FaBellSlash,
  FaDoorOpen,
  FaUserShield,
} from "react-icons/fa";
import BackButton from "../../components/BackButton";

// Create custom animated DairyNest delivery pin icon
const createCustomPin = () => {
  return L.divIcon({
    className: "dn-custom-marker-wrapper",
    html: `
      <div class="dn-marker-pulse"></div>
      <div class="dn-marker-pin">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="#ffffff">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      </div>
    `,
    iconSize: [40, 48],
    iconAnchor: [20, 44],
    popupAnchor: [0, -40],
  });
};

const DEFAULT_COORDS = { lat: 26.6508, lng: 84.9089 }; // Motihari / Bihar default

const AddressPage = () => {
  const navigate = useNavigate();

  // Form state
  const [form, setForm] = useState({
    name: "",
    phone: "",
    altPhone: "",
    pincode: "",
    houseNo: "",
    street: "",
    landmark: "",
    city: "",
    state: "",
    addressType: "Home",
    deliverySlot: "morning",
    instruction: "Leave at door",
    lat: DEFAULT_COORDS.lat,
    lng: DEFAULT_COORDS.lng,
  });

  // Map state
  const [coords, setCoords] = useState(DEFAULT_COORDS);
  const [locating, setLocating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [detectedLocationName, setDetectedLocationName] = useState("");
  const [geocoding, setGeocoding] = useState(false);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  // Reverse Geocoding with OpenStreetMap Nominatim
  const reverseGeocode = useCallback(async (lat, lng) => {
    setGeocoding(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
        {
          headers: {
            "Accept-Language": "en",
          },
        }
      );
      const data = await res.json();
      if (data && data.address) {
        const addr = data.address;
        const displayName = data.display_name || "";
        setDetectedLocationName(displayName.split(",").slice(0, 3).join(", "));

        const cityVal =
          addr.city ||
          addr.town ||
          addr.village ||
          addr.county ||
          addr.state_district ||
          "";
        const stateVal = addr.state || "";
        const pincodeVal = addr.postcode || "";
        const roadVal =
          [addr.road, addr.suburb, addr.neighbourhood]
            .filter(Boolean)
            .join(", ") || "";

        setForm((prev) => ({
          ...prev,
          city: prev.city || cityVal,
          state: prev.state || stateVal,
          pincode: prev.pincode || pincodeVal,
          street: prev.street || roadVal,
          lat: lat,
          lng: lng,
        }));
      }
    } catch (err) {
      console.warn("Reverse geocode fetch error:", err);
    } finally {
      setGeocoding(false);
    }
  }, []);

  // Update marker & pan if coords change externally
  const updateMapPosition = useCallback((lat, lng, zoom = 16) => {
    setCoords({ lat, lng });
    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.flyTo([lat, lng], zoom, { duration: 1.2 });
      markerRef.current.setLatLng([lat, lng]);
    }
    reverseGeocode(lat, lng);
  }, [reverseGeocode]);

  // Initialize from user & saved address on mount
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        alert("Please sign in or register first to set your delivery address.");
        sessionStorage.setItem("openAuth", "true");
        navigate("/");
        return;
      }

      const saved = localStorage.getItem("address");
      if (saved && saved !== "undefined") {
        const parsed = JSON.parse(saved);
        if (parsed) {
          setForm((prev) => ({
            ...prev,
            ...parsed,
            name: parsed.name || user.name || "",
            phone: parsed.phone || user.phone || "",
          }));
          if (parsed.lat && parsed.lng) {
            const initialLat = parseFloat(parsed.lat);
            const initialLng = parseFloat(parsed.lng);
            if (!isNaN(initialLat) && !isNaN(initialLng)) {
              setCoords({ lat: initialLat, lng: initialLng });
              if (mapInstanceRef.current && markerRef.current) {
                mapInstanceRef.current.setView([initialLat, initialLng], 16);
                markerRef.current.setLatLng([initialLat, initialLng]);
              }
            }
          }
        }
      } else {
        setForm((prev) => ({
          ...prev,
          name: user.name || "",
          phone: user.phone || "",
        }));
      }
    } catch (err) {
      console.error("Address initialization error:", err);
    }
  }, [navigate]);

  // Initialize Leaflet Map (Run once on mount, clean up safely on unmount)
  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    // 1. Destroy existing instance if any
    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.remove();
      } catch (e) {
        console.warn(e);
      }
      mapInstanceRef.current = null;
      markerRef.current = null;
    }

    // 2. Clear Leaflet ID and child nodes from DOM container
    if (container._leaflet_id) {
      delete container._leaflet_id;
    }
    container.innerHTML = "";

    try {
      let initLat = DEFAULT_COORDS.lat;
      let initLng = DEFAULT_COORDS.lng;

      const saved = localStorage.getItem("address");
      if (saved && saved !== "undefined") {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.lat && parsed.lng) {
            const sLat = parseFloat(parsed.lat);
            const sLng = parseFloat(parsed.lng);
            if (!isNaN(sLat) && !isNaN(sLng)) {
              initLat = sLat;
              initLng = sLng;
            }
          }
        } catch (_) {}
      }

      const map = L.map(mapContainerRef.current, {
        center: [initLat, initLng],
        zoom: 15,
        zoomControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      L.control
        .zoom({
          position: "bottomright",
        })
        .addTo(map);

      const pinIcon = createCustomPin();
      const marker = L.marker([initLat, initLng], {
        draggable: true,
        icon: pinIcon,
      }).addTo(map);

      marker.on("dragend", (e) => {
        const newPos = e.target.getLatLng();
        setCoords({ lat: newPos.lat, lng: newPos.lng });
        reverseGeocode(newPos.lat, newPos.lng);
      });

      map.on("click", (e) => {
        const newPos = e.latlng;
        marker.setLatLng(newPos);
        setCoords({ lat: newPos.lat, lng: newPos.lng });
        reverseGeocode(newPos.lat, newPos.lng);
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;

      // Initial reverse geocode
      reverseGeocode(initLat, initLng);
    } catch (err) {
      console.error("Leaflet initialization error:", err);
    }

    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          console.warn(e);
        }
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, [reverseGeocode]);

  // Locate Current GPS Position
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        updateMapPosition(latitude, longitude, 17);
        setLocating(false);
      },
      (error) => {
        console.error("GPS error:", error);
        alert(
          "Could not detect location. Please check browser location permissions or enter address manually."
        );
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Search places via Nominatim Search API
  const handleSearchPlaces = async (e) => {
    e?.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&countrycodes=in&limit=5`,
        {
          headers: {
            "Accept-Language": "en",
          },
        }
      );
      const data = await res.json();
      setSearchResults(data || []);
    } catch (err) {
      console.error("Search place error:", err);
    } finally {
      setSearching(false);
    }
  };

  const handleSelectSearchResult = (result) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    updateMapPosition(lat, lng, 16);
    setSearchResults([]);
    setSearchQuery(result.display_name.split(",")[0]);
  };

  // Handle Form Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Submit and save
  const handleContinue = () => {
    if (!form.name.trim()) {
      alert("Please enter recipient name");
      return;
    }
    if (!form.phone.trim() || form.phone.length < 10) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }
    if (!form.pincode.trim() || form.pincode.length < 6) {
      alert("Please enter a valid 6-digit Pincode");
      return;
    }
    if (!form.houseNo.trim() && !form.street.trim()) {
      alert("Please provide House/Flat No. or Street details");
      return;
    }
    if (!form.city.trim()) {
      alert("Please provide City/Town");
      return;
    }

    // Compose formatted street address for backwards-compatibility with backend
    const fullStreetAddress = [
      form.houseNo,
      form.street,
      form.landmark ? `(Landmark: ${form.landmark})` : null,
      form.state ? form.state : null,
    ]
      .filter(Boolean)
      .join(", ");

    const finalAddressObj = {
      ...form,
      address: fullStreetAddress || form.street || form.houseNo,
      city: form.city,
      pincode: form.pincode,
      lat: coords.lat,
      lng: coords.lng,
      formattedAddress: `${form.houseNo ? form.houseNo + ", " : ""}${form.street}, ${
        form.landmark ? "Near " + form.landmark + ", " : ""
      }${form.city}, ${form.state ? form.state + " - " : ""}${form.pincode}`,
    };

    localStorage.setItem("address", JSON.stringify(finalAddressObj));
    navigate("/payment");
  };

  return (
    <main className="dn-address-page">
      {/* Top Header Navigation */}
      <div className="dn-address-header-wrap">
        <BackButton to="/cart" label="Back to Cart" />
        <div className="dn-checkout-stepper">
          <div className="dn-step dn-step-done">
            <span className="dn-step-num">1</span>
            <span className="dn-step-text">Cart</span>
          </div>
          <div className="dn-step-divider dn-step-divider-active" />
          <div className="dn-step dn-step-active">
            <span className="dn-step-num">2</span>
            <span className="dn-step-text">Address</span>
          </div>
          <div className="dn-step-divider" />
          <div className="dn-step dn-step-pending">
            <span className="dn-step-num">3</span>
            <span className="dn-step-text">Payment</span>
          </div>
        </div>
      </div>

      <div className="dn-address-layout">
        {/* Left Column: Map + Form */}
        <section className="dn-main-content">
          {/* MAP SELECTOR CARD */}
          <div className="dn-card dn-map-card">
            <div className="dn-card-header">
              <div className="dn-header-title">
                <span className="dn-icon-badge">
                  <FaMapMarkerAlt />
                </span>
                <div>
                  <h2>Select Delivery Location</h2>
                  <p>Move the pin or search to pinpoint your exact doorstep for fresh milk delivery</p>
                </div>
              </div>
              <button
                type="button"
                className={`dn-gps-btn ${locating ? "dn-pulse-loading" : ""}`}
                onClick={handleUseCurrentLocation}
                title="Use GPS to detect current location"
              >
                <FaCrosshairs />
                {locating ? "Locating..." : "Use Current Location"}
              </button>
            </div>

            {/* Map Search Bar */}
            <form onSubmit={handleSearchPlaces} className="dn-map-search-bar">
              <FaSearch className="dn-search-icon" />
              <input
                type="text"
                placeholder="Search area, landmark, colony, or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="dn-search-clear"
                  onClick={() => setSearchQuery("")}
                >
                  &times;
                </button>
              )}
              <button type="submit" className="dn-search-submit">
                {searching ? "Searching..." : "Search"}
              </button>
            </form>

            {/* Search Dropdown Results */}
            {searchResults.length > 0 && (
              <div className="dn-search-dropdown">
                {searchResults.map((item, idx) => (
                  <div
                    key={idx}
                    className="dn-search-item"
                    onClick={() => handleSelectSearchResult(item)}
                  >
                    <FaMapMarkerAlt className="dn-item-icon" />
                    <div>
                      <div className="dn-item-title">{item.display_name.split(",")[0]}</div>
                      <div className="dn-item-sub">{item.display_name}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Live Leaflet Map Box */}
            <div className="dn-leaflet-container-wrapper">
              <div ref={mapContainerRef} className="dn-leaflet-map-element" />
              <div className="dn-map-hint-overlay">
                <FaCompass />
                <span>Drag map pin or tap to fine-tune exact doorstep</span>
              </div>
            </div>

            {/* Detected Address Pill */}
            <div className="dn-detected-pill">
              <div className="dn-detected-content">
                <FaCheckCircle className="dn-check-icon" />
                <div>
                  <span className="dn-pill-label">
                    {geocoding ? "Detecting location..." : "Selected Location"}
                  </span>
                  <span className="dn-pill-text">
                    {detectedLocationName || "Lat: " + coords.lat.toFixed(4) + ", Lng: " + coords.lng.toFixed(4)}
                  </span>
                </div>
              </div>
              <span className="dn-coord-badge">
                {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
              </span>
            </div>
          </div>

          {/* FLIPKART STYLE ADDRESS FORM */}
          <div className="dn-card dn-form-card">
            <div className="dn-form-section-title">
              <span className="dn-step-pill">Address Details</span>
              <h3>Complete Delivery Details</h3>
              <p>Please enter detailed information so our delivery partner can reach you promptly</p>
            </div>

            {/* Address Type Selection */}
            <div className="dn-type-selector-wrap">
              <label className="dn-field-label">Save Address As:</label>
              <div className="dn-type-options">
                <button
                  type="button"
                  className={`dn-type-btn ${form.addressType === "Home" ? "active" : ""}`}
                  onClick={() => setForm({ ...form, addressType: "Home" })}
                >
                  <FaHome />
                  <span>Home</span>
                  <small>All-day delivery</small>
                </button>
                <button
                  type="button"
                  className={`dn-type-btn ${form.addressType === "Work" ? "active" : ""}`}
                  onClick={() => setForm({ ...form, addressType: "Work" })}
                >
                  <FaBriefcase />
                  <span>Work</span>
                  <small>10 AM - 6 PM</small>
                </button>
                <button
                  type="button"
                  className={`dn-type-btn ${form.addressType === "Other" ? "active" : ""}`}
                  onClick={() => setForm({ ...form, addressType: "Other" })}
                >
                  <FaMapMarkerAlt />
                  <span>Other</span>
                  <small>Custom location</small>
                </button>
              </div>
            </div>

            {/* Contact Details Grid */}
            <div className="dn-fields-grid">
              <div className="dn-field-group">
                <label className="dn-field-label">Recipient Full Name *</label>
                <div className="dn-input-box">
                  <FaUser className="dn-input-icon" />
                  <input
                    type="text"
                    name="name"
                    placeholder="e.g. Rahul Sharma"
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="dn-field-group">
                <label className="dn-field-label">10-digit Mobile Number *</label>
                <div className="dn-input-box">
                  <span className="dn-country-code">+91</span>
                  <input
                    type="tel"
                    name="phone"
                    maxLength={10}
                    placeholder="9876543210"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="dn-field-group">
                <label className="dn-field-label">Pincode *</label>
                <div className="dn-input-box">
                  <FaMapMarkerAlt className="dn-input-icon" />
                  <input
                    type="text"
                    name="pincode"
                    maxLength={6}
                    placeholder="e.g. 845401"
                    value={form.pincode}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="dn-field-group">
                <label className="dn-field-label">Alternate Phone (Optional)</label>
                <div className="dn-input-box">
                  <FaPhoneAlt className="dn-input-icon" />
                  <input
                    type="tel"
                    name="altPhone"
                    maxLength={10}
                    placeholder="Optional phone number"
                    value={form.altPhone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="dn-field-group dn-col-span-2">
                <label className="dn-field-label">Flat, House no., Building, Apartment *</label>
                <div className="dn-input-box">
                  <FaHome className="dn-input-icon" />
                  <input
                    type="text"
                    name="houseNo"
                    placeholder="e.g. Flat 402, Green Valley Apartments"
                    value={form.houseNo}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="dn-field-group dn-col-span-2">
                <label className="dn-field-label">Area, Street, Sector, Village *</label>
                <div className="dn-input-box">
                  <FaMapMarkerAlt className="dn-input-icon" />
                  <input
                    type="text"
                    name="street"
                    placeholder="e.g. Main Market Road, Chhatauni"
                    value={form.street}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="dn-field-group">
                <label className="dn-field-label">Landmark (Optional)</label>
                <div className="dn-input-box">
                  <FaCompass className="dn-input-icon" />
                  <input
                    type="text"
                    name="landmark"
                    placeholder="e.g. Near Shiv Mandir / Water Tank"
                    value={form.landmark}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="dn-field-group">
                <label className="dn-field-label">Town / City *</label>
                <div className="dn-input-box">
                  <FaCity className="dn-input-icon" />
                  <input
                    type="text"
                    name="city"
                    placeholder="e.g. Motihari"
                    value={form.city}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Delivery Instructions Options */}
            <div className="dn-instructions-wrap">
              <label className="dn-field-label">Delivery Instructions for Dairy Partner:</label>
              <div className="dn-instruction-chips">
                {[
                  { text: "Leave at door", icon: <FaDoorOpen /> },
                  { text: "Leave with guard", icon: <FaUserShield /> },
                  { text: "Do not ring bell", icon: <FaBellSlash /> },
                  { text: "Call before delivery", icon: <FaPhoneAlt /> },
                ].map((item) => (
                  <button
                    key={item.text}
                    type="button"
                    className={`dn-chip-btn ${form.instruction === item.text ? "active" : ""}`}
                    onClick={() => setForm({ ...form, instruction: item.text })}
                  >
                    {item.icon}
                    <span>{item.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Sticky Summary & Preview Card */}
        <aside className="dn-sidebar-summary">
          <div className="dn-card dn-preview-card">
            <div className="dn-preview-badge-row">
              <span className="dn-brand-pill">
                <FaTruck /> DairyNest Direct
              </span>
              <span className="dn-type-badge">{form.addressType.toUpperCase()}</span>
            </div>

            <h3 className="dn-preview-heading">Delivery Summary</h3>

            {/* Address Display Box */}
            <div className="dn-preview-address-box">
              <div className="dn-recipient-row">
                <span className="dn-recipient-name">{form.name || "Recipient Name"}</span>
                <span className="dn-recipient-phone">
                  <FaPhoneAlt /> {form.phone ? "+91 " + form.phone : "+91 XXXXXXXXXX"}
                </span>
              </div>
              <p className="dn-address-body">
                {form.houseNo && <span>{form.houseNo}, </span>}
                {form.street ? (
                  <span>{form.street}, </span>
                ) : (
                  <span className="dn-placeholder-text">Area / Street not provided yet, </span>
                )}
                {form.landmark && <span className="dn-landmark-text">Near {form.landmark}, </span>}
                <span className="dn-city-state">
                  {form.city || "City"} {form.state ? ", " + form.state : ""}{" "}
                  {form.pincode ? "- " + form.pincode : ""}
                </span>
              </p>

              {form.instruction && (
                <div className="dn-preview-instruction">
                  <span className="dn-inst-badge">Note:</span> {form.instruction}
                </div>
              )}
            </div>

            {/* Delivery Guarantee Info */}
            <div className="dn-freshness-promise">
              <div className="dn-promise-icon">
                <FaClock />
              </div>
              <div>
                <h4>Morning Fresh Slot</h4>
                <p>Guaranteed cold-chain delivery between <strong>6:00 AM - 8:00 AM</strong></p>
              </div>
            </div>

            <div className="dn-safety-features">
              <div className="dn-safety-item">
                <FaShieldAlt className="dn-safety-icon" />
                <span>100% Pure & Untouched Packaging</span>
              </div>
              <div className="dn-safety-item">
                <FaCheckCircle className="dn-safety-icon" />
                <span>Live GPS Tracking on Dispatch</span>
              </div>
            </div>

            {/* Action CTA Button */}
            <button className="dn-deliver-cta-btn" onClick={handleContinue}>
              <span>Deliver Here & Proceed</span>
              <FaArrowRight />
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default AddressPage;
