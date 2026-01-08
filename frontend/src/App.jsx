// import { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import LoginComponent from './components/LoginComponent';
// import RoleSelection from './components/RoleSelection';
// import OnboardingComponent from './components/OnboardingComponent';
// import DashboardPage from './pages/DashboardPage';
// import ProductDetailPage from './pages/ProductDetailPage';
// import CartPage from './pages/CartPage';
// import UploadProductComponent from './components/UploadProductComponent';
// import './App.css';

// function App() {
//   const [buyer, setBuyer] = useState(() => {
//     const saved = localStorage.getItem('buyer');
//     return saved ? JSON.parse(saved) : null;
//   });

//   const [seller, setSeller] = useState(() => {
//     const saved = localStorage.getItem('seller');
//     return saved ? JSON.parse(saved) : null;
//   });

//   const [phoneVerified, setPhoneVerified] = useState(null);
//   const [userRole, setUserRole] = useState(null);

//   const [isLoading, setIsLoading] = useState(false);

//   const handleOtpVerified = (phone) => {
//     setPhoneVerified(phone);
//   };

//   const handleRoleSelect = async (role) => {
//     setUserRole(role);
//     try {
//       const response = await fetch('/api/auth/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           phone: phoneVerified,
//           role: role,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to login');
//       }

//       const result = await response.json();
//       const user = result.data.user;

//       if (role === 'buyer') {
//         setBuyer(user);
//         localStorage.setItem('buyer', JSON.stringify(user));
//       } else {
//         setSeller(user);
//         localStorage.setItem('seller', JSON.stringify(user));
//       }
//     } catch (error) {
//       console.error('Error logging in:', error);
//       alert('Error logging in. Please try again.');
//     }
//   };

//   const handleBuyerProfileComplete = (updatedBuyer) => {
//     setBuyer(updatedBuyer);
//     localStorage.setItem('buyer', JSON.stringify(updatedBuyer));
//   };

//   const handleSellerProfileComplete = (updatedSeller) => {
//     setSeller(updatedSeller);
//     localStorage.setItem('seller', JSON.stringify(updatedSeller));
//   };

//   const handleLogout = () => {
//     setBuyer(null);
//     setSeller(null);
//     setPhoneVerified(null);
//     setUserRole(null);
//     localStorage.removeItem('buyer');
//     localStorage.removeItem('seller');
//   };

//   // Route logic
//   if (!phoneVerified) {
//     return (
//       <Router>
//         <Routes>
//           <Route
//             path="/"
//             element={<LoginComponent onOtpVerified={handleOtpVerified} />}
//           />
//           <Route path="*" element={<Navigate to="/" />} />
//         </Routes>
//       </Router>
//     );
//   }

//   if (!userRole) {
//     return (
//       <Router>
//         <Routes>
//           <Route
//             path="/"
//             element={<RoleSelection phone={phoneVerified} onRoleSelect={handleRoleSelect} />}
//           />
//           <Route path="*" element={<Navigate to="/" />} />
//         </Routes>
//       </Router>
//     );
//   }

//   // if (userRole === 'buyer') {
//   //   if (!buyer.is_profile_complete) {
//   //     return (
//   //       <Router>
//   //         <Routes>
//   //           <Route
//   //             path="/onboarding"
//   //             element={
//   //               <OnboardingComponent
//   //                 buyer={buyer}
//   //                 onProfileComplete={handleBuyerProfileComplete}
//   //               />
//   //             }
//   //           />
//   //           <Route path="*" element={<Navigate to="/onboarding" />} />
//   //         </Routes>
//   //       </Router>
//   //     );
//   //   }
//    if (userRole === 'buyer') {
//   if (!buyer || !buyer.phone) {
//     return (
//       <Router>
//         <Routes>
//           <Route path="*" element={<Navigate to="/" />} />
//         </Routes>
//       </Router>
//     );
//   }

//   if (!buyer.is_profile_complete) {
//     return (
//       <Router>
//         <Routes>
//           <Route
//             path="/onboarding"
//             element={
//               <OnboardingComponent
//                 buyer={buyer}
//                 onProfileComplete={handleBuyerProfileComplete}
//               />
//             }
//           />
//           <Route path="*" element={<Navigate to="/onboarding" />} />
//         </Routes>
//       </Router>
//     );
//   }

//     return (
//       <Router>
//         <Routes>
//           <Route
//             path="/dashboard"
//             element={<DashboardPage buyer={buyer} onLogout={handleLogout} />}
//           />
//           <Route
//             path="/product/:id"
//             element={<ProductDetailPage buyer={buyer} />}
//           />
//           <Route
//             path="/cart"
//             element={<CartPage buyer={buyer} />}
//           />
//           <Route path="*" element={<Navigate to="/dashboard" />} />
//         </Routes>
//       </Router>
//     );
//   }

//   // if (userRole === 'seller') {
//   //   if (!seller.is_profile_complete) {
//   //     return (
//   //       <Router>
//   //         <Routes>
//   //           <Route
//   //             path="/onboarding"
//   //             element={
//   //               <OnboardingComponent
//   //                 seller={seller}
//   //                 onProfileComplete={handleSellerProfileComplete}
//   //               />
//   //             }
//   //           />
//   //           <Route path="*" element={<Navigate to="/onboarding" />} />
//   //         </Routes>
//   //       </Router>
//   //     );
//   //   }
//     if (userRole === 'seller') {
//   if (!seller || !seller.phone) {
//     return (
//       <Router>
//         <Routes>
//           <Route path="*" element={<Navigate to="/" />} />
//         </Routes>
//       </Router>
//     );
//   }

//   if (!seller.is_profile_complete) {
//     return (
//       <Router>
//         <Routes>
//           <Route
//             path="/onboarding"
//             element={
//               <OnboardingComponent
//                 seller={seller}
//                 onProfileComplete={handleSellerProfileComplete}
//               />
//             }
//           />
//           <Route path="*" element={<Navigate to="/onboarding" />} />
//         </Routes>
//       </Router>
//     );
//   }

//     return (
//       <Router>
//         <Routes>
//           <Route
//             path="/dashboard"
//             element={<DashboardPage seller={seller} onLogout={handleLogout} />}
//           />
//           <Route
//             path="/upload"
//             element={<UploadProductComponent seller={seller} onLogout={handleLogout} />}
//           />
//           <Route path="*" element={<Navigate to="/dashboard" />} />
//         </Routes>
//       </Router>
//     );
//   }
// }

// export default App;



import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginComponent from './components/LoginComponent';
import RoleSelection from './components/RoleSelection';
import OnboardingComponent from './components/OnboardingComponent';
import DashboardPage from './pages/DashboardPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import UploadProductComponent from './components/UploadProductComponent';
import './App.css';

function App() {
  const [buyer, setBuyer] = useState(() => {
    const saved = localStorage.getItem('buyer');
    return saved ? JSON.parse(saved) : null;
  });

  const [seller, setSeller] = useState(() => {
    const saved = localStorage.getItem('seller');
    return saved ? JSON.parse(saved) : null;
  });

  const [phoneVerified, setPhoneVerified] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const handleOtpVerified = (phone) => {
    setPhoneVerified(phone);
  };

  const handleRoleSelect = async (role) => {
    setUserRole(role);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phoneVerified,
          role: role,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to login');
      }

      const result = await response.json();
      const user = result.data.user;

      if (role === 'buyer') {
        setBuyer(user);
        localStorage.setItem('buyer', JSON.stringify(user));
      } else {
        setSeller(user);
        localStorage.setItem('seller', JSON.stringify(user));
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Error logging in. Please try again.');
    }
  };

  const handleBuyerProfileComplete = (updatedBuyer) => {
    setBuyer(updatedBuyer);
    localStorage.setItem('buyer', JSON.stringify(updatedBuyer));
  };

  const handleSellerProfileComplete = (updatedSeller) => {
    setSeller(updatedSeller);
    localStorage.setItem('seller', JSON.stringify(updatedSeller));
  };

  const handleLogout = () => {
    setBuyer(null);
    setSeller(null);
    setPhoneVerified(null);
    setUserRole(null);
    localStorage.removeItem('buyer');
    localStorage.removeItem('seller');
  };

  // Route logic
  if (!phoneVerified) {
    return (
      <Router>
        <Routes>
          <Route
            path="/"
            element={<LoginComponent onOtpVerified={handleOtpVerified} />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    );
  }

  if (!userRole) {
    return (
      <Router>
        <Routes>
          <Route
            path="/"
            element={<RoleSelection phone={phoneVerified} onRoleSelect={handleRoleSelect} />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    );
  }

  // if (userRole === 'buyer') {
  //   if (!buyer.is_profile_complete) {
  //     return (
  //       <Router>
  //         <Routes>
  //           <Route
  //             path="/onboarding"
  //             element={
  //               <OnboardingComponent
  //                 buyer={buyer}
  //                 onProfileComplete={handleBuyerProfileComplete}
  //               />
  //             }
  //           />
  //           <Route path="*" element={<Navigate to="/onboarding" />} />
  //         </Routes>
  //       </Router>
  //     );
  //   }
   if (userRole === 'buyer') {
  if (!buyer || !buyer.phone) {
    return (
      <Router>
        <Routes>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    );
  }

  if (!buyer.is_profile_complete) {
    return (
      <Router>
        <Routes>
          <Route
            path="/onboarding"
            element={
              <OnboardingComponent
                buyer={buyer}
                onProfileComplete={handleBuyerProfileComplete}
              />
            }
          />
          <Route path="*" element={<Navigate to="/onboarding" />} />
        </Routes>
      </Router>
    );
  }

    return (
      <Router>
        <Routes>
          <Route
            path="/dashboard"
            element={<DashboardPage buyer={buyer} onLogout={handleLogout} />}
          />
          <Route
            path="/product/:id"
            element={<ProductDetailPage buyer={buyer} />}
          />
          <Route
            path="/cart"
            element={<CartPage buyer={buyer} />}
          />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    );
  }

  // if (userRole === 'seller') {
  //   if (!seller.is_profile_complete) {
  //     return (
  //       <Router>
  //         <Routes>
  //           <Route
  //             path="/onboarding"
  //             element={
  //               <OnboardingComponent
  //                 seller={seller}
  //                 onProfileComplete={handleSellerProfileComplete}
  //               />
  //             }
  //           />
  //           <Route path="*" element={<Navigate to="/onboarding" />} />
  //         </Routes>
  //       </Router>
  //     );
  //   }
    if (userRole === 'seller') {
  if (!seller || !seller.phone) {
    return (
      <Router>
        <Routes>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    );
  }

  if (!seller.is_profile_complete) {
    return (
      <Router>
        <Routes>
          <Route
            path="/onboarding"
            element={
              <OnboardingComponent
                seller={seller}
                onProfileComplete={handleSellerProfileComplete}
              />
            }
          />
          <Route path="*" element={<Navigate to="/onboarding" />} />
        </Routes>
      </Router>
    );
  }

    return (
      <Router>
        <Routes>
          <Route
            path="/dashboard"
            element={<DashboardPage seller={seller} onLogout={handleLogout} />}
          />
          <Route
            path="/upload"
            element={<UploadProductComponent seller={seller} onLogout={handleLogout} />}
          />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    );
  }
}

export default App;
