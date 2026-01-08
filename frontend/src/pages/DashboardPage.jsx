import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AshokaChakraIcon from '../components/icons/AshokaChakraIcon';
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';

const DashboardPage = ({ seller, buyer, onLogout }) => {
  const navigate = useNavigate();
  const isBuyer = !!buyer;

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState('');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [cartCount, setCartCount] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('cart'));
      return Array.isArray(stored) ? stored.length : 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    // Seller dashboard requires a seller.
    // Buyer dashboard requires a buyer.
    if (!buyer && !seller) navigate('/');
  }, [buyer, seller, navigate]);

  // Keep cart badge in sync with localStorage updates from Cart/Product pages
  useEffect(() => {
    if (!isBuyer) return;
    const refreshCartCount = () => {
      try {
        const stored = JSON.parse(localStorage.getItem('cart'));
        setCartCount(Array.isArray(stored) ? stored.length : 0);
      } catch {
        setCartCount(0);
      }
    };
    refreshCartCount();
    window.addEventListener('cartUpdated', refreshCartCount);
    window.addEventListener('storage', refreshCartCount);
    return () => {
      window.removeEventListener('cartUpdated', refreshCartCount);
      window.removeEventListener('storage', refreshCartCount);
    };
  }, [isBuyer]);

  useEffect(() => {
    if (!isBuyer) return;

    const fetchProducts = async () => {
      setLoadingProducts(true);
      setProductsError('');
      try {
        // backend mounts product routes at /api/products
        const res = await axios.get('/api/products');
        const data = res?.data?.data;
        const list = Array.isArray(data?.products)
          ? data.products
          : Array.isArray(data)
            ? data
            : [];
        setProducts(list);
      } catch (err) {
        console.error('Failed to load products:', err);
        setProductsError('Failed to load products. Please refresh.');
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [isBuyer]);

  const categories = useMemo(() => {
    const set = new Set();
    for (const p of products) {
      const c = p?.category;
      if (typeof c === 'string' && c.trim()) set.add(c.trim());
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [products]);

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const name = (p?.name || '').toString().toLowerCase();
      const cat = (p?.category || '').toString();
      const matchesQuery = !q || name.includes(q);
      const matchesCategory = !category || cat === category;
      return matchesQuery && matchesCategory;
    });
  }, [products, query, category]);

  if (!buyer && !seller) return null;

  if (isBuyer) {
    return (
      <div
        className="min-vh-100"
        style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #e6f4ea 100%)' }}
      >
        <nav
          className="px-4 py-3 d-flex justify-content-between align-items-center"
          style={{ background: 'linear-gradient(90deg, #1a237e, #2e7d32)', color: '#fff' }}
        >
          <div>
            <div className="d-flex align-items-center gap-3">
              <h4 className="mb-0 fw-bold">ODOP Marketplace</h4>
            </div>
            <small className="opacity-75">Buyer Dashboard</small>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-outline-light btn-sm position-relative"
              onClick={() => navigate('/cart')}
              type="button"
            >
              <i className="bi bi-cart3 me-2" />
              Cart
              {cartCount > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                >
                  {cartCount}
                </span>
              )}
            </button>
            <button className="btn btn-outline-light btn-sm" onClick={onLogout} type="button">
              Logout
            </button>
          </div>
        </nav>

        <div className="container py-5">
          {/* Welcome card */}
          <div className="row justify-content-center mb-4">
            <div className="col-lg-10">
              <div className="bg-white rounded-4 shadow-sm p-4">
                <h2 className="fw-bold mb-1">Welcome, {buyer?.name || 'Buyer'}!</h2>
                <div className="text-muted">
                  {(buyer?.org_type || 'INDIVIDUAL').toString().replaceAll('_', ' ')}
                  {buyer?.district_name ? ` from ${buyer.district_name}` : ''}
                </div>
              </div>
            </div>
          </div>

          {/* Search / filters */}
          <div className="row justify-content-center mb-4">
            <div className="col-lg-10">
              <div className="bg-white rounded-4 shadow-sm p-3 d-flex align-items-center gap-3">
                <div className="flex-grow-1 d-flex align-items-center gap-2">
                  <i className="bi bi-search text-muted" />
                  <input
                    type="text"
                    className="form-control border-0"
                    placeholder="Search by product name..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
                <div style={{ width: 220 }}>
                  <select
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">All categories</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <h4 className="fw-bold mb-3" style={{ color: '#1a237e' }}>
                Available Products
              </h4>

              {productsError && (
                <div className="alert alert-danger" role="alert">
                  {productsError}
                </div>
              )}

              {loadingProducts ? (
                <div className="text-muted">Loading products…</div>
              ) : (
                <div className="row g-3">
                  {filteredProducts.map((p) => (
                    <div key={p.id} className="col-12 col-md-6 col-lg-3">
                      <div
                        className="bg-white rounded-4 shadow-sm p-3 h-100"
                        role="button"
                        onClick={() => navigate(`/product/${p.id}`)}
                      >
                        <div className="fw-bold" style={{ color: '#1a237e' }}>
                          {p.name}
                        </div>
                        <div className="text-muted" style={{ fontSize: 13 }}>
                          {p.category || 'Other'}
                        </div>
                        <div className="text-muted mt-2" style={{ fontSize: 13 }}>
                          Origin: {p.base_district || p.district || p.origin || ''}
                        </div>
                      </div>
                    </div>
                  ))}
                  {!filteredProducts.length && (
                    <div className="text-muted">No products found.</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          {/* Home icon that routes to role-selection (root) */}
          <button
            type="button"
            className="btn btn-link text-white p-0 me-2"
            title="Role selection / Home"
            onClick={() => navigate('/')}
            style={{ textDecoration: 'none' }}
          >
            <i className="bi bi-house-door-fill" style={{ fontSize: 22, color: '#fff' }} />
          </button>

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
