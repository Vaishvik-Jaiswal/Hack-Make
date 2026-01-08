import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AshokaChakraIcon from '../components/icons/AshokaChakraIcon';
import 'bootstrap-icons/font/bootstrap-icons.css';

const DashboardPage = ({ seller, onLogout }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!seller) navigate('/');
  }, [seller, navigate]);

  if (!seller) return null;

  return (
    <div
      className="min-vh-100 position-relative"
      style={{
        background: 'linear-gradient(135deg, #eef2ff 0%, #e6f4ea 100%)',
        overflow: 'hidden'
      }}
    >
      {/* SUBTLE MP / GOVT WATERMARK ICON */}
      <i
        className="bi bi-bank"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '420px',
          color: '#1a237e',
          opacity: 0.03,
          pointerEvents: 'none'
        }}
      />

      {/* NAVBAR */}
      <nav
        className="px-4 py-3 d-flex justify-content-between align-items-center position-relative"
        style={{
          background: 'linear-gradient(90deg, #1a237e, #2e7d32)',
          color: '#fff'
        }}
      >
        <div className="d-flex align-items-center gap-3">
          <AshokaChakraIcon size={34} color="#ffffff" />
          <div>
            <h5 className="mb-0 fw-semibold">ODOP Marketplace</h5>
            <small className="opacity-75">Seller Dashboard</small>
          </div>
        </div>

        <button className="btn btn-outline-light btn-sm" onClick={onLogout}>
          Logout
        </button>
      </nav>

      {/* MAIN CONTENT */}
      <div className="container py-5 position-relative">

        {/* WELCOME SECTION – HIGHLIGHTED */}
        {/* WELCOME SECTION – CENTERED & EMPHASISED */}
{/* WELCOME SECTION – NO CARD, GRADIENT TEXT */}
<div className="row justify-content-center mb-5">
  <div className="col-lg-10 text-center">

    <h2
  className="fw-bold"
  style={{
    fontSize: '2.2rem',
    background: 'linear-gradient(90deg, #1a237e, #2e7d32)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  }}
>
      Welcome, {seller.artisan_name || 'Seller'}
    </h2>

    <p className="fs-5 text-muted mb-1">
      Your shop: <strong>{seller.shop_name}</strong>
    </p>

    <div className="text-muted d-flex justify-content-center align-items-center gap-1">
      <i className="bi bi-geo-alt"></i>
      {seller.district}
    </div>

  </div>
</div>

        {/* PROFILE INFORMATION */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <h5 className="fw-semibold mb-3 border-bottom pb-2">
              Profile Information
            </h5>

            <div className="row g-3">
              <InfoItem label="Phone Number" value={`+91 ${seller.phone}`} icon="telephone" />
              <InfoItem label="Shop Name" value={seller.shop_name} icon="shop" />
              <InfoItem label="Artisan Name" value={seller.artisan_name} icon="person" />
              <InfoItem label="District" value={seller.district} icon="geo-alt" />
              <InfoItem label="Udyam Number" value={seller.udyam_number} icon="file-earmark-text" />
              <InfoItem
                label="Profile Status"
                value="Complete"
                icon="check-circle"
                valueClass="text-success fw-semibold"
              />
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div
          className="card border-0 shadow-sm"
          style={{
            background: 'linear-gradient(180deg, #ffffff, #f7f9ff)'
          }}
        >
          <div className="card-body">
            <h5 className="fw-semibold mb-3 border-bottom pb-2">
              Quick Actions
            </h5>

            <div className="row g-3">
              <ActionCard
                icon="cloud-upload"
                title="Upload Products"
                onClick={() => navigate('/seller/upload-product')}
              />
              <ActionCard
                icon="clipboard-check"
                title="View Orders"
              />
              <ActionCard
                icon="boxes"
                title="Manage Inventory"
                onClick={() => navigate('/seller/manage-inventory')}
              />
              <ActionCard
                icon="bar-chart"
                title="View Analytics"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

/* SMALL COMPONENTS */

const InfoItem = ({ label, value, icon, valueClass = '' }) => (
  <div className="col-md-4">
    <div
      className="p-3 rounded h-100"
      style={{ background: '#f8fafc' }}
    >
      <div className="small text-muted mb-1">
        <i className={`bi bi-${icon} me-2`}></i>
        {label}
      </div>
      <div className={valueClass}>{value}</div>
    </div>
  </div>
);

const ActionCard = ({ icon, title, onClick }) => (
  <div className="col-md-3">
    <div
      className="p-4 text-center rounded h-100 shadow-sm"
      role="button"
      onClick={onClick}
      style={{
        background: 'linear-gradient(180deg, #ffffff, #f1f5ff)',
        cursor: 'pointer'
      }}
    >
      <i
        className={`bi bi-${icon}`}
        style={{ fontSize: 28, color: '#1a237e' }}
      ></i>
      <div className="mt-2 fw-semibold">{title}</div>
    </div>
  </div>
);

export default DashboardPage;
