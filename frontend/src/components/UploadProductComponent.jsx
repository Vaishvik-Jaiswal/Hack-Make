import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import 'bootstrap-icons/font/bootstrap-icons.css';
import apiConfig from '../config/api';

export const UploadProductComponent = ({ seller, onLogout }) => {
  const navigate = useNavigate();
  const sellerId = seller?.id;

  useEffect(() => {
    if (!seller) navigate('/');
  }, [seller, navigate]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    quantity_per_month: '',
    certifications: [],
    packaging_type: ''
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [uploadedProducts, setUploadedProducts] = useState([]);

  const categories = [
    'Textiles', 'Pottery', 'Handicrafts', 'Metalware',
    'Woodwork', 'Jewelry', 'Paintings', 'Sculptures',
    'Leather', 'Ceramics', 'Other'
  ];

  const certificationOptions = ['ZED', 'FSSAI', 'GI Tag'];

  const packagingOptions = [
    'LOOSE/OPEN (Open Sacks)',
    'BASIC PACKED (Simple PP/plastic bags)',
    'SEALED(FOOD-GRADE) (Heat-sealed, hygenic)',
    'VACCUM SEALED (oxygen free)',
    'RETAIL READY (branded, labeled packs)'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleCertificationChange = (cert) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.includes(cert)
        ? prev.certifications.filter((c) => c !== cert)
        : [...prev.certifications, cert]
    }));
  };

  const handlePackagingChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      packaging_type: e.target.value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);

    setSelectedFile(file);
    setErrors(prev => ({ ...prev, image: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name || formData.name.length < 3) newErrors.name = 'Minimum 3 characters required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Enter valid price';
    if (!formData.category) newErrors.category = 'Select a category';
    if (!selectedFile) newErrors.image = 'Product image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const dataToSend = new FormData();
      dataToSend.append('vendor_id', sellerId);
      dataToSend.append('name', formData.name);
      dataToSend.append('description', formData.description);
      dataToSend.append('price', formData.price);
      dataToSend.append('category', formData.category);
      dataToSend.append('quantity_per_month', formData.quantity_per_month);
      dataToSend.append('certifications', formData.certifications.join(','));
      dataToSend.append('packaging_type', formData.packaging_type);
      dataToSend.append('image', selectedFile);

      const res = await api.post('/products', dataToSend);

      if (res.data?.success) {
        const product = res.data.data?.product;
        setSuccessMessage('Product uploaded successfully! 🎉');

        if (product) setUploadedProducts(prev => [product, ...prev]);

        // Reset form
        setFormData({
          name: '',
          description: '',
          price: '',
          category: '',
          quantity_per_month: '',
          certifications: [],
          packaging_type: ''
        });
        setSelectedFile(null);
        setImagePreview(null);
        setErrors({});
      } else {
        setErrors({ general: res.data?.message || 'Upload failed. Try again.' });
      }
    } catch (err) {
      setErrors({ general: 'Upload failed. Try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100"
      style={{
        background: 'linear-gradient(135deg, #eef2ff 0%, #e6f4ea 100%)'
      }}
    >
      {/* NAVBAR */}
      <nav
        className="px-4 py-3 d-flex justify-content-between align-items-center"
        style={{
          background: 'linear-gradient(90deg, #1a237e, #2e7d32)',
          color: '#fff'
        }}
      >
        <button
          className="btn btn-outline-light btn-sm"
          onClick={() => navigate('/seller/dashboard')}
        >
          ← Back to Dashboard
        </button>

        <button className="btn btn-outline-light btn-sm" onClick={onLogout}>
          Logout
        </button>
      </nav>

      {/* MAIN FORM */}
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-7">

            {/* TITLE */}
            <div className="text-center mb-4">
              <h2
  className="fw-bold"
  style={{
    fontSize: '2.2rem',
    background: 'linear-gradient(90deg, #1a237e, #2e7d32)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  }}
>
  Upload Your Product
</h2>


              <p className="text-muted">
                Sell your handmade products on ODOP Marketplace
              </p>
            </div>

            {/* CARD */}
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">

                {errors.general && (
                  <div className="alert alert-danger">{errors.general}</div>
                )}
                {successMessage && (
                  <div className="alert alert-success">{successMessage}</div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* PRODUCT NAME */}
                  <div className="mb-3">
                    <label className="form-label">Product Name *</label>
                    <input
                      className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                  </div>

                  {/* DESCRIPTION */}
                  <div className="mb-3">
                    <label className="form-label">Description *</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* PRICE + CATEGORY */}
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Price (₹) *</label>
                      <input
                        type="number"
                        className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                      />
                      {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                    </div>

            {/* Category */}
            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                disabled={loading}
                className={errors.category ? 'error' : ''}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && <span className="error-text">{errors.category}</span>}
            </div>
          </div>

          {/* Quantity Produced Per Month */}
          <div className="form-group">
            <label htmlFor="quantity_per_month">Quantity Produced/Month (Units)</label>
            <input
              type="number"
              id="quantity_per_month"
              name="quantity_per_month"
              placeholder="e.g., 500"
              value={formData.quantity_per_month}
              onChange={handleInputChange}
              disabled={loading}
              min="0"
              step="1"
            />
          </div>

          {/* Certifications */}
          <div className="form-group">
            <label>Certifications</label>
            <div className="certifications-group">
              {certificationOptions.map((cert) => (
                <div key={cert} className="checkbox-item">
                  <input
                    type="checkbox"
                    id={`cert-${cert}`}
                    checked={formData.certifications.includes(cert)}
                    onChange={() => handleCertificationChange(cert)}
                    disabled={loading}
                  />
                  <label htmlFor={`cert-${cert}`} className="checkbox-label">
                    {cert}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Packaging Type */}
          <div className="form-group">
            <label htmlFor="packaging_type">Packaging Type</label>
            <select
              id="packaging_type"
              name="packaging_type"
              value={formData.packaging_type}
              onChange={handlePackagingChange}
              disabled={loading}
            >
              <option value="">Select packaging type</option>
              {packagingOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

                  {/* IMAGE UPLOAD */}
                  <div className="mb-4">
                    <label className="form-label">Product Image *</label>
                    <input
                      type="file"
                      className={`form-control ${errors.image ? 'is-invalid' : ''}`}
                      onChange={handleFileChange}
                    />
                    {errors.image && <div className="invalid-feedback">{errors.image}</div>}
                  </div>

                  {/* PREVIEW */}
                  {imagePreview && (
                    <div className="text-center mb-3">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{ maxHeight: 180, borderRadius: 8 }}
                      />
                    </div>
                  )}

          {/* Submit Button */}
          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Uploading...
              </>
            ) : (
              'Upload Product'
            )}
          </button>
        </form>
      </div>

      {/* Uploaded Products List */}
      {uploadedProducts.length > 0 && (
        <div className="products-list-container">
          <h2>Your Products ({uploadedProducts.length})</h2>
          <div className="products-grid">
            {uploadedProducts.map((product) => (
              <div key={product.id} className="product-card">
                {product.image_path && (
                  <div className="product-image">
                    <img
                      src={`${apiConfig.API_SERVER_URL}${product.image_path}`}
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/200?text=No+Image';
                      }}
                    />
                  </div>
                )}
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="category">{product.category}</p>
                  <p className="price">₹ {parseFloat(product.price).toFixed(2)}</p>
                  {product.description && (
                    <p className="description">{product.description.substring(0, 100)}...</p>
                  )}
                  <span className="date">
                    {new Date(product.created_at).toLocaleDateString()}
                  </span>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}
          </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default UploadProductComponent;
