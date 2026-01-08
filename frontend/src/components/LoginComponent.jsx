import { useState } from 'react';
import { sendOTP, verifyOTP } from '../services/authService';
import AshokaChakraIcon from './icons/AshokaChakraIcon';

const LoginComponent = ({ onOtpVerified }) => {
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePhoneChange = (e) => {
    setPhone(e.target.value.replace(/\D/g, '').slice(0, 10));
    setError('');
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
    setError('');
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    if (phone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setLoading(true);
    try {
      await sendOTP(phone);
      setSuccessMessage('OTP has been sent to your registered mobile number.');
      setStep('otp');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  // Prevent double submission
  const [otpSubmitted, setOtpSubmitted] = useState(false);
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError('Please enter the 6-digit OTP.');
      return;
    }
    if (otpSubmitted) return; // Prevent double call
    setOtpSubmitted(true);
    setLoading(true);
    try {
      const res = await verifyOTP(phone, otp);
      setError('');
      if (onOtpVerified) onOtpVerified(phone); // set phoneVerified in App
      // Removed: onLoginSuccess(res.data.data.seller); - this bypasses role selection
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP.');
      setOtpSubmitted(false); // Allow retry on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container-fluid min-vh-100 d-flex align-items-center position-relative"
      style={{
        background: 'linear-gradient(135deg, #f0f4ff 0%, #e8f5e9 100%)',
        overflow: 'hidden'
      }}
    >
      {/* INDIA MAP ICON WATERMARK */}
      <i
        className="bi bi-globe-central-south-asia"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '420px',
          color: '#1a237e',
          opacity: 0.04,
          pointerEvents: 'none'
        }}
      />

      <div className="container position-relative">

        {/* GOVT HEADER */}
        <div className="row mb-5">
          <div className="col text-center">
            <AshokaChakraIcon size={56} color="#1a237e" />
            <h4 className="fw-bold text-primary mt-3 mb-1">
              Government of Madhya Pradesh
            </h4>
            <div className="text-muted small">
              One District One Product (ODOP) Marketplace
            </div>
          </div>
        </div>

        {/* LOGIN CARD */}
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-lg border-0 overflow-hidden">
              <div className="row g-0">

                {/* LEFT INFO PANEL */}
                <div
                  className="col-md-5 p-4 text-white position-relative"
                  style={{
                    background: 'linear-gradient(180deg, #1a237e, #2e7d32)'
                  }}
                >
                  <h6 className="fw-semibold mb-3">
                    Access Portal
                  </h6>

                  <p className="small opacity-75">
                    Official login for ODOP Marketplace, a Government
                    of Madhya Pradesh initiative to promote local products
                    nationwide.
                  </p>

                  <ul className="small mt-4">
                    <li className="mb-2">
                      <i className="bi bi-shield-check me-2"></i>
                      Secure OTP-based authentication
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-map me-2"></i>
                      Pan-India marketplace access
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-bank me-2"></i>
                      Government-backed platform
                    </li>
                  </ul>

                  {/* JAI STAMBH STYLE WATERMARK */}
                  <i
                    className="bi bi-bank"
                    style={{
                      position: 'absolute',
                      bottom: 20,
                      right: 20,
                      fontSize: '120px',
                      opacity: 0.08
                    }}
                  />
                </div>

                {/* RIGHT FORM PANEL */}
                <div className="col-md-7 p-5 bg-white">
                  <h6 className="fw-semibold mb-2">
                    Login
                  </h6>
                  <p className="text-muted small mb-4">
                    Login using your registered mobile number.
                  </p>

                  {error && (
                    <div className="alert alert-danger small">{error}</div>
                  )}
                  {successMessage && (
                    <div className="alert alert-success small">{successMessage}</div>
                  )}

                  {step === 'phone' ? (
                    <form onSubmit={handlePhoneSubmit}>
                      <div className="mb-3">
                        <label className="form-label">
                          Mobile Number
                        </label>
                        <div className="input-group">
                          <span className="input-group-text">+91</span>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter 10-digit mobile number"
                            value={phone}
                            onChange={handlePhoneChange}
                            disabled={loading}
                          />
                        </div>
                      </div>

                      <button
                        className="btn btn-primary w-100"
                        disabled={loading || phone.length !== 10}
                      >
                        {loading ? 'Sending OTP…' : 'Send OTP'}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleOtpSubmit}>
                      <div className="mb-3">
                        <label className="form-label">
                          One Time Password (OTP)
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter 6-digit OTP"
                          value={otp}
                          onChange={handleOtpChange}
                          disabled={loading}
                        />
                        <div className="form-text">
                          OTP sent to +91 {phone}
                        </div>
                      </div>

                      <button
                        className="btn btn-primary w-100"
                        disabled={loading || otp.length !== 6}
                      >
                        {loading ? 'Verifying…' : 'Verify & Login'}
                      </button>

                      <button
                        type="button"
                        className="btn btn-link w-100 mt-2"
                        onClick={() => setStep('phone')}
                      >
                        Change mobile number
                      </button>
                    </form>
                  )}
                </div>

              </div>

              {/* FOOTER */}
              <div className="card-footer text-center small text-muted bg-light">
                © Government of Madhya Pradesh • ODOP Marketplace  
                <br />
                This system is monitored for security purposes.
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginComponent;
