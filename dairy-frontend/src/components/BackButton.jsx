import React from "react";
import { Link, useNavigate } from "react-router-dom";

const BackButton = ({ to, label = "Back", style = {} }) => {
  const navigate = useNavigate();

  const arrowIcon = (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ marginRight: "6px", flexShrink: 0 }}
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );

  if (to) {
    return (
      <Link to={to} className="dn-back-btn" style={style} aria-label={label}>
        {arrowIcon}
        <span>{label}</span>
      </Link>
    );
  }

  return (
    <button
      type="button"
      className="dn-back-btn"
      onClick={() => navigate(-1)}
      style={style}
      aria-label={label}
    >
      {arrowIcon}
      <span>{label}</span>
    </button>
  );
};

export default BackButton;
