// import { useState } from 'react';
// import { ShoppingBag, Store } from 'lucide-react';
// import './RoleSelection.css';

// export const RoleSelection = ({ phone, onRoleSelect }) => {
//   const [loading, setLoading] = useState(false);

//   const handleRoleSelect = async (role) => {
//     setLoading(true);
//     try {
//       await onRoleSelect(role);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="role-selection-container">
//       <div className="role-selection-card">
//         <h1>ODOP Marketplace</h1>
//         <h2>Welcome! Choose your role</h2>
//         <p>Phone: +91{phone}</p>

//         <div className="role-buttons">
//           <button
//             onClick={() => handleRoleSelect('buyer')}
//             className="role-btn buyer-btn"
//             disabled={loading}
//           >
//             <ShoppingBag size={20} style={{ marginRight: '8px' }} />
//             {loading ? 'Loading...' : 'Continue as Buyer'}
//           </button>
//           <button
//             onClick={() => handleRoleSelect('seller')}
//             className="role-btn seller-btn"
//             disabled={loading}
//           >
//             <Store size={20} style={{ marginRight: '8px' }} />
//             {loading ? 'Loading...' : 'Continue as Seller'}
//           </button>
//         </div>

//         <p className="info-text">
//           Select your role to proceed to the marketplace.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default RoleSelection;

import { useState } from 'react';
import { ShoppingBag, Store } from 'lucide-react';
import './RoleSelection.css';

export const RoleSelection = ({ phone, onRoleSelect }) => {
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = async (role) => {
    setLoading(true);
    try {
      await onRoleSelect(role);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="role-selection-container">
      <div className="role-selection-card">

        {/* LEFT PANEL */}
        <div className="role-selection-left">
          <h1>Government of Madhya Pradesh</h1>
          <p>
            One District One Product (ODOP) Marketplace empowers local artisans
            and buyers across Madhya Pradesh.
          </p>
          <ul>
            <li>✔ Authentic district products</li>
            <li>✔ Secure & trusted platform</li>
            <li>✔ Government-backed initiative</li>
          </ul>
        </div>

        {/* RIGHT PANEL */}
        <div className="role-selection-right">
          <h2>ODOP Marketplace</h2>
          <p className="subtitle">Choose your role to continue</p>
          <p className="subtitle">+91 {phone}</p>

          <div className="role-buttons">
            <button
              onClick={() => handleRoleSelect('buyer')}
              className="role-btn buyer-btn"
              disabled={loading}
            >
              <ShoppingBag size={18} />
              {loading ? 'Loading...' : 'Continue as Buyer'}
            </button>

            <button
              onClick={() => handleRoleSelect('seller')}
              className="role-btn seller-btn"
              disabled={loading}
            >
              <Store size={18} />
              {loading ? 'Loading...' : 'Continue as Seller'}
            </button>
          </div>

          <p className="info-text">
            Select your role to proceed to the marketplace.
          </p>
        </div>

      </div>
    </div>
  );
};

export default RoleSelection;
