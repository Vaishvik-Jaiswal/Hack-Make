import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UploadProductComponent.css';
import api from '../services/api';
import apiConfig from '../config/api';

export const UploadProductComponent = ({ seller, onLogout }) => {
  const navigate = useNavigate();
  const sellerId = seller?.id;

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!seller) {
      window.location.href = '/';
    }
  }, [seller]);

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
    'Textiles',
    'Pottery',
    'Handicrafts',
    'Metalware',
    'Woodwork',
    'Jewelry',
    'Paintings',
    'Sculptures',
    'Leather',
    'Ceramics',
    'Other'
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
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
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
    
    if (!file) {
      setSelectedFile(null);
      setImagePreview(null);
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        image: 'Only image files are allowed (JPEG, PNG, GIF, WebP)'
      }));
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        image: 'File size must be less than 5MB'
      }));
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    setSelectedFile(file);
    setErrors((prev) => ({
      ...prev,
      image: ''
    }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Add visual feedback
    const wrapper = e.currentTarget;
    wrapper.style.backgroundColor = '#f0f2ff';
    wrapper.style.borderColor = '#764ba2';
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Remove visual feedback
    const wrapper = e.currentTarget;
    wrapper.style.backgroundColor = '';
    wrapper.style.borderColor = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Reset visual feedback
    const wrapper = e.currentTarget;
    wrapper.style.backgroundColor = '';
    wrapper.style.borderColor = '';
    
    // Get the file from drop event
    const file = e.dataTransfer.files[0];
    if (file) {
      // Create a synthetic event to reuse handleFileChange
      const syntheticEvent = {
        target: {
          files: [file]
        }
      };
      handleFileChange(syntheticEvent);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name || formData.name.trim().length < 3) {
      newErrors.name = 'Product name must be at least 3 characters';
    }

    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be a valid positive number';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!selectedFile) {
      newErrors.image = 'Product image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Create FormData for multipart/form-data
      const formDataToSend = new FormData();
      formDataToSend.append('vendor_id', sellerId);
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('price', formData.price);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('quantity_per_month', formData.quantity_per_month);
      formDataToSend.append('certifications', formData.certifications.join(','));
      formDataToSend.append('packaging_type', formData.packaging_type);
      formDataToSend.append('image', selectedFile);

      const response = await api.post('/products', formDataToSend);

      if (response.data && response.data.success) {
        setSuccessMessage('Product uploaded successfully! 🎉');
        
        // Add to uploaded products list
        if (response.data.data && response.data.data.product) {
          setUploadedProducts((prev) => [response.data.data.product, ...prev]);
        }

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

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setErrors({
        general: error.response?.data?.message || error.message || 'Failed to upload product'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-product-container">
      <nav className="upload-nav">
        <button 
          className="back-btn"
          onClick={() => navigate('/seller/dashboard')}
        >
          ← Back to Dashboard
        </button>
        <button onClick={onLogout} className="logout-btn-upload">Logout</button>
      </nav>

      <div className="upload-product-card">
        <h1>Upload Your Product</h1>
        <p className="subtitle">Sell your handmade products on ODOP Marketplace</p>

        {errors.general && <div className="error-message">{errors.general}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <form onSubmit={handleSubmit} className="upload-form">
          {/* Product Name */}
          <div className="form-group">
            <label htmlFor="name">Product Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="e.g., Handmade Wooden Sculpture"
              value={formData.name}
              onChange={handleInputChange}
              disabled={loading}
              maxLength="255"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Describe your product, materials used, dimensions, etc."
              value={formData.description}
              onChange={handleInputChange}
              disabled={loading}
              rows="5"
              maxLength="1000"
            />
            <span className="char-count">
              {formData.description.length}/1000 characters
            </span>
          </div>

          {/* Price */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price (₹) *</label>
              <input
                type="number"
                id="price"
                name="price"
                placeholder="999"
                value={formData.price}
                onChange={handleInputChange}
                disabled={loading}
                step="0.01"
                min="0"
                className={errors.price ? 'error' : ''}
              />
              {errors.price && <span className="error-text">{errors.price}</span>}
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

          {/* Image Upload */}
          <div className="form-group">
            <label htmlFor="image">Product Image *</label>
            <div 
              className={`file-input-wrapper ${errors.image ? 'error' : ''}`}
              onClick={() => document.getElementById('image').click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleFileChange}
                disabled={loading}
                className="file-input"
              />
              <span className="file-label">
                {selectedFile ? selectedFile.name : 'Choose image or drag and drop'}
              </span>
            </div>
            {errors.image && <span className="error-text">{errors.image}</span>}
            <p className="file-hint">Max size: 5MB. Formats: JPEG, PNG, GIF, WebP</p>
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="image-preview-container">
              <p className="preview-label">Image Preview:</p>
              <img src={imagePreview} alt="Product preview" className="image-preview" />
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
  );
};

export default UploadProductComponent;
