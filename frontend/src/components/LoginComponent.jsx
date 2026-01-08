// import { useState } from 'react';
// import './LoginComponent.css';
// import { sendOTP, verifyOTP } from '../services/authService';

// export const LoginComponent = ({ onOtpVerified }) => {
//   const [step, setStep] = useState('phone'); // 'phone' or 'otp'
//   const [phone, setPhone] = useState('');
//   const [otp, setOtp] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [successMessage, setSuccessMessage] = useState('');

//   const handlePhoneChange = (e) => {
//     const value = e.target.value.replace(/\D/g, '').slice(0, 10);
//     setPhone(value);
//     setError('');
//   };

//   const handlePhoneSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccessMessage('');

//     if (!phone || phone.length !== 10) {
//       setError('Please enter a valid 10-digit phone number');
//       return;
//     }

//     setLoading(true);
//     try {
//       await sendOTP(phone);
//       setSuccessMessage('OTP sent successfully!');
//       setStep('otp');
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to send OTP');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleOtpChange = (e) => {
//     const value = e.target.value.replace(/\D/g, '').slice(0, 6);
//     setOtp(value);
//     setError('');
//   };

//   const handleOtpSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccessMessage('');

//     if (!otp || otp.length !== 6) {
//       setError('Please enter a valid 6-digit OTP');
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await verifyOTP(phone, otp);
//       onOtpVerified(response.data.data.phone);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to verify OTP');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="login-container">
//       <div className="login-card">
//         <h1>ODOP Marketplace</h1>
//         <h2>Login</h2>

//         {error && <div className="error-message">{error}</div>}
//         {successMessage && <div className="success-message">{successMessage}</div>}

//         {step === 'phone' ? (
//           <form onSubmit={handlePhoneSubmit} className="login-form">
//             <div className="form-group">
//               <label htmlFor="phone">Phone Number</label>
//               <div className="phone-input-wrapper">
//                 <span className="country-code">+91</span>
//                 <input
//                   type="text"
//                   id="phone"
//                   placeholder="9876543210"
//                   value={phone}
//                   onChange={handlePhoneChange}
//                   maxLength="10"
//                   className="phone-input"
//                   disabled={loading}
//                 />
//               </div>
//               <p className="input-hint">Enter your 10-digit phone number</p>
//             </div>
//             <button
//               type="submit"
//               className="submit-btn"
//               disabled={loading || phone.length !== 10}
//             >
//               {loading ? 'Sending OTP...' : 'Send OTP'}
//             </button>
//           </form>
//         ) : (
//           <form onSubmit={handleOtpSubmit} className="login-form">
//             <div className="form-group">
//               <label htmlFor="otp">Enter OTP</label>
//               <input
//                 type="text"
//                 id="otp"
//                 placeholder="000000"
//                 value={otp}
//                 onChange={handleOtpChange}
//                 maxLength="6"
//                 className="otp-input"
//                 disabled={loading}
//               />
//               <p className="input-hint">6-digit OTP sent to +91{phone}</p>
//             </div>
//             <button
//               type="submit"
//               className="submit-btn"
//               disabled={loading || otp.length !== 6}
//             >
//               {loading ? 'Verifying...' : 'Verify OTP'}
//             </button>
//             <button
//               type="button"
//               className="back-btn"
//               onClick={() => {
//                 setStep('phone');
//                 setOtp('');
//                 setError('');
//               }}
//               disabled={loading}
//             >
//               Back
//             </button>
//           </form>
//         )}

//         <p className="terms-text">
//           By logging in, you agree to our Terms & Conditions
//         </p>
//       </div>
//     </div>
//   );
// };

// export default LoginComponent;
import { useState } from 'react';
import './LoginComponent.css';
import { sendOTP, verifyOTP } from '../services/authService';

export const LoginComponent = ({ onOtpVerified }) => {
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(value);
    setError('');
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (phone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    try {
      await sendOTP(phone);
      setSuccessMessage('OTP sent successfully');
      setStep('otp');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
    setError('');
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await verifyOTP(phone, otp);
      onOtpVerified(response.data.data.phone);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="odop-login-page">
      {/* Header */}
      <header className="odop-header">
        <img
          src="\AshokaChakra.png"
          alt="Govt of MP"
          className="odop-logo"
        />
        <h1>Government of Madhya Pradesh</h1>
        <p>One District One Product (ODOP) Marketplace</p>
      </header>

      {/* Card */}
      <div className="odop-card">
        {/* Left Panel */}
        <div className="odop-left">
          <h2>Login Access Portal</h2>
          <p>
            Official login for ODOP Marketplace, a Government of
            Madhya Pradesh initiative to promote local products nationwide.
          </p>

          <ul>
            <li>Secure OTP-based authentication</li>
            <li>Pan-India marketplace access</li>
            <li>Government-backed platform</li>
          </ul>
        </div>

        {/* Right Panel */}
        <div className="odop-right">
          <h3> Login</h3>
          <p className="subtext">
            Login using your registered mobile number.
          </p>

          {error && <div className="error-message">{error}</div>}
          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}

          {step === 'phone' ? (
            <form onSubmit={handlePhoneSubmit}>
              <label>Mobile Number</label>
              <div className="mobile-input">
                <span>+91</span>
                <input
                  type="text"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="Enter 10-digit mobile number"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading || phone.length !== 10}
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit}>
              <label>Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={handleOtpChange}
                placeholder="6-digit OTP"
                disabled={loading}
              />

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>

              <button
                type="button"
                className="back-btn"
                onClick={() => {
                  setStep('phone');
                  setOtp('');
                  setError('');
                }}
              >
                Back
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="odop-footer">
        © Government of Madhya Pradesh · ODOP Marketplace <br />
        This system is monitored for security purposes.
      </footer>
    </div>
  );
};

export default LoginComponent;
