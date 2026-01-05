import { useState } from 'react';
import './OnboardingComponent.css';
import { updateSellerProfile } from '../services/authService';

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
    <div className="onboarding-container">
      <div className="onboarding-card">
        <h1>Complete Your Profile</h1>
        <p className="subtitle">Phone: +91{seller?.phone}</p>

        {errors.general && <div className="error-message">{errors.general}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <form onSubmit={handleSubmit} className="onboarding-form">
          <div className="form-group">
            <label htmlFor="shop_name">Shop Name *</label>
            <input
              type="text"
              id="shop_name"
              name="shop_name"
              placeholder="Enter your shop name"
              value={formData.shop_name}
              onChange={handleInputChange}
              disabled={loading}
              maxLength="100"
              className={errors.shop_name ? 'error' : ''}
            />
            {errors.shop_name && <span className="error-text">{errors.shop_name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="artisan_name">Artisan Name *</label>
            <input
              type="text"
              id="artisan_name"
              name="artisan_name"
              placeholder="Enter artisan's full name"
              value={formData.artisan_name}
              onChange={handleInputChange}
              disabled={loading}
              maxLength="100"
              className={errors.artisan_name ? 'error' : ''}
            />
            {errors.artisan_name && <span className="error-text">{errors.artisan_name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="district">District *</label>
            <select
              id="district"
              name="district"
              value={formData.district}
              onChange={handleInputChange}
              disabled={loading}
              className={errors.district ? 'error' : ''}
            >
              <option value="">Select a district</option>
              {DISTRICTS.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
            {errors.district && <span className="error-text">{errors.district}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="udyam_number">Udyam Number *</label>
            <input
              type="text"
              id="udyam_number"
              name="udyam_number"
              placeholder="UDxxxx0000000"
              value={formData.udyam_number}
              onChange={handleInputChange}
              disabled={loading}
              maxLength="20"
              className={errors.udyam_number ? 'error' : ''}
            />
            {errors.udyam_number && <span className="error-text">{errors.udyam_number}</span>}
            <p className="input-hint">Format: 2 letters (UD) followed by alphanumeric characters</p>
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Completing Profile...' : 'Complete Profile'}
          </button>
        </form>

        <p className="info-text">
          All fields are required to complete your profile and access the dashboard.
        </p>
      </div>
    </div>
  );
};

export default OnboardingComponent;
