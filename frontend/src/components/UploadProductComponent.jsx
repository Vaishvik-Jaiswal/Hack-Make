import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import 'bootstrap-icons/font/bootstrap-icons.css';

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
    category: ''
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const categories = [
    'Textiles', 'Pottery', 'Handicrafts', 'Metalware',
    'Woodwork', 'Jewelry', 'Paintings', 'Sculptures',
    'Leather', 'Ceramics', 'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
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
      const data = new FormData();
      data.append('vendor_id', sellerId);
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('category', formData.category);
      data.append('image', selectedFile);

      const res = await api.post('/products', data);
      if (res.data?.success) {
        setSuccessMessage('Product uploaded successfully');
        setFormData({ name: '', description: '', price: '', category: '' });
        setSelectedFile(null);
        setImagePreview(null);
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

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Category *</label>
                      <select
                        className={`form-select ${errors.category ? 'is-invalid' : ''}`}
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                      >
                        <option value="">Select category</option>
                        {categories.map(c => <option key={c}>{c}</option>)}
                      </select>
                      {errors.category && <div className="invalid-feedback">{errors.category}</div>}
                    </div>
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

                  {/* SUBMIT */}
                  <button
  type="submit"
  className="btn w-100 text-white"
  disabled={loading}
  style={{
    background: 'linear-gradient(90deg, #1a237e, #2e7d32)',
    border: 'none',
    padding: '12px',
    fontWeight: 600
  }}
>
  {loading ? 'Uploading…' : 'Upload Product'}
</button>

                </form>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadProductComponent;
