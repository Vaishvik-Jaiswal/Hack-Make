import { useState } from 'react';
import './OnboardingComponent.css';
import { updateSellerProfile } from '../services/authService';
import 'bootstrap-icons/font/bootstrap-icons.css';
import MpMapIcon from '../components/icons/MpMapIcon';


const DISTRICTS = [
  'Indore', 'Bhopal', 'Jabalpur', 'Ujjain', 'Gwalior', 'Sagi', 'Ratlam',
  'Dewas', 'Dhar', 'Khargone', 'Barwani', 'Jhabua', 'Alirajpur', 'Vidisha',
  'Raisen', 'Sehore', 'Ashok Nagar', 'Guna', 'Damoh', 'Panna', 'Chhatarpur',
  'Satna', 'Rewa', 'Singrauli', 'Shahdol', 'Umaria', 'Anuppur', 'Seoni',
  'Mandla', 'Dindori', 'Chhindwara', 'Balaghat',
];

export const OnboardingComponent = ({ seller, onProfileComplete }) => {
  const [formData, setFormData] = useState({
    shop_name: '',
    artisan_name: '',
    district: '',
    udyam_number: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.shop_name || formData.shop_name.trim().length < 3) {
      newErrors.shop_name = 'Shop name must be at least 3 characters';
    }

    if (!formData.artisan_name || formData.artisan_name.trim().length < 2) {
      newErrors.artisan_name = 'Artisan name must be at least 2 characters';
    }

    if (!formData.district) {
      newErrors.district = 'Please select a district';
    }

    const udyamRegex = /^UD[A-Z0-9]{10}$/;
    if (!formData.udyam_number || !udyamRegex.test(formData.udyam_number.toUpperCase())) {
      newErrors.udyam_number = 'Invalid Udyam number (format: UDxxxx0000000)';
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
      await updateSellerProfile(seller.id, {
        shop_name: formData.shop_name.trim(),
        artisan_name: formData.artisan_name.trim(),
        district: formData.district,
        udyam_number: formData.udyam_number.toUpperCase(),
      });

      setSuccessMessage('Profile completed successfully!');
      setTimeout(() => {
        onProfileComplete({
          ...seller,
          ...formData,
          is_profile_complete: true,
        });
      }, 1500);
    } catch (error) {
      setErrors({
        general: error.response?.data?.message || 'Failed to update profile',
      });
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
    {/* GRADIENT NAVBAR */}
    <div
      className="px-4 py-3"
      style={{
        background: 'linear-gradient(90deg, #1a237e, #2e7d32)',
        color: '#ffffff'
      }}
    >
      <div className="d-flex align-items-center gap-3">
        <i className="bi bi-record-circle fs-3"></i>
        <div>
          <h5 className="mb-0 fw-bold">ODOP Marketplace</h5>
          <small className="opacity-75">
            Government of Madhya Pradesh · Seller Onboarding
          </small>
        </div>
      </div>
    </div>

    {/* MAIN CONTENT */}
    <div className="container-fluid position-relative py-5">
      {/* MP MAP ICON */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          right: '-25%',
          pointerEvents: 'none',
          zIndex: 0
        }}
      >
        <MpMapIcon size={460} color="#1a237e" opacity={0.06} />
      </div>

      <div className="row g-0 position-relative" style={{ zIndex: 1 }}>
        {/* LEFT INFO PANEL */}
        <div className="col-lg-4 px-5">
          <h4 className="fw-bold mb-3">Seller Profile Registration</h4>

          <p className="text-muted fs-5">
            Register your business under the One District One Product (ODOP)
            initiative to reach buyers across India.
          </p>

          <ul className="list-unstyled mt-4">
            <li className="mb-3 d-flex gap-2">
              <i className="bi bi-check-circle-fill text-success"></i>
              Verified seller identity
            </li>
            <li className="mb-3 d-flex gap-2">
              <i className="bi bi-geo-alt-fill text-primary"></i>
              District-based product mapping
            </li>
            <li className="mb-3 d-flex gap-2">
              <i className="bi bi-bank2 text-secondary"></i>
              Government-backed marketplace
            </li>
          </ul>

          <div className="fw-semibold opacity-50 mt-5">
            Satyamev Jayate
          </div>
        </div>

        {/* RIGHT FORM PANEL */}
        <div className="col-lg-8 bg-white p-5 rounded shadow-sm">
          <div className="mb-4">
            <h3
              className="fw-bold"
              style={{
                background: 'linear-gradient(90deg, #1a237e, #2e7d32)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Complete Your Profile
            </h3>
            <p className="text-muted">
              Registered mobile number: <strong>+91{seller?.phone}</strong>
            </p>
          </div>

          {errors.general && (
            <div className="alert alert-danger">{errors.general}</div>
          )}
          {successMessage && (
            <div className="alert alert-success">{successMessage}</div>
          )}

          <form onSubmit={handleSubmit} className="row g-4">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Shop Name</label>
              <input
                type="text"
                name="shop_name"
                className={`form-control ${errors.shop_name ? 'is-invalid' : ''}`}
                value={formData.shop_name}
                onChange={handleInputChange}
              />
              {errors.shop_name && <div className="invalid-feedback">{errors.shop_name}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Artisan Name</label>
              <input
                type="text"
                name="artisan_name"
                className={`form-control ${errors.artisan_name ? 'is-invalid' : ''}`}
                value={formData.artisan_name}
                onChange={handleInputChange}
              />
              {errors.artisan_name && <div className="invalid-feedback">{errors.artisan_name}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">District</label>
              <select
                name="district"
                className={`form-select ${errors.district ? 'is-invalid' : ''}`}
                value={formData.district}
                onChange={handleInputChange}
              >
                <option value="">Select district</option>
                {DISTRICTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              {errors.district && <div className="invalid-feedback">{errors.district}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Udyam Number</label>
              <input
                type="text"
                name="udyam_number"
                className={`form-control ${errors.udyam_number ? 'is-invalid' : ''}`}
                value={formData.udyam_number}
                onChange={handleInputChange}
              />
              {errors.udyam_number && <div className="invalid-feedback">{errors.udyam_number}</div>}
            </div>

            <div className="col-12 mt-4">
              <button
                type="submit"
                className="btn text-white fw-semibold px-5"
                disabled={loading}
                style={{
                  background: 'linear-gradient(90deg, #1a237e, #2e7d32)',
                  border: 'none',
                  padding: '12px 32px'
                }}
              >
                {loading ? 'Submitting…' : 'Submit & Continue'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
);


};

export default OnboardingComponent;
