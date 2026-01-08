// import { useState } from 'react';
// import './OnboardingComponent.css';

// const DISTRICTS = [
//   'Agar Malwa',
//   'Alirajpur',
//   'Anuppur',
//   'Ashok Nagar',
//   'Balaghat',
//   'Barwani',
//   'Betul',
//   'Bhind',
//   'Bhopal',
//   'Burhanpur',
//   'Chhatarpur',
//   'Chhindwara',
//   'Damoh',
//   'Datia',
//   'Dewas',
//   'Dhar',
//   'Dindori',
//   'Guna',
//   'Gwalior',
//   'Harda',
//   'Hoshangabad',
//   'Indore',
//   'Jabalpur',
//   'Jhabua',
//   'Katni',
//   'Khandwa',
//   'Khargone',
//   'Mandla',
//   'Mandsaur',
//   'Morena',
//   'Narsinghpur',
//   'Neemuch',
//   'Niwari',
//   'Panna',
//   'Raisen',
//   'Rajgarh',
//   'Ratlam',
//   'Rewa',
//   'Sagar',
//   'Satna',
//   'Sehore',
//   'Seoni',
//   'Shahdol',
//   'Shajapur',
//   'Sheopur',
//   'Shivpuri',
//   'Sidhi',
//   'Singrauli',
//   'Tikamgarh',
//   'Ujjain',
//   'Umaria',
//   'Vidisha',
// ];

// export const OnboardingComponent = ({ buyer, seller, onProfileComplete }) => {
//   const isSeller = !!seller;
//   const user = buyer || seller;
//   const [formData, setFormData] = useState(() => {
//     if (isSeller) {
//       return {
//         shop_name: '',
//         artisan_name: '',
//         district: '',
//         udyam_number: '',
//       };
//     } else {
//       return {
//         name: '',
//         org_type: 'INDIVIDUAL',
//         email: '',
//         gst_no: '',
//         district_name: '',
//       };
//     }
//   });

//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [successMessage, setSuccessMessage] = useState('');

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     // Clear error for this field
//     if (errors[name]) {
//       setErrors((prev) => ({
//         ...prev,
//         [name]: '',
//       }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (isSeller) {
//       if (!formData.shop_name || formData.shop_name.trim().length < 3) {
//         newErrors.shop_name = 'Shop name must be at least 3 characters';
//       }

//       if (!formData.artisan_name || formData.artisan_name.trim().length < 2) {
//         newErrors.artisan_name = 'Artisan name must be at least 2 characters';
//       }

//       if (!formData.district) {
//         newErrors.district = 'Please select a district';
//       }

//       const udyamRegex = /^UD\d{11}$/;
//       if (!formData.udyam_number || !udyamRegex.test(formData.udyam_number)) {
//         newErrors.udyam_number = 'Invalid Udyam number (format: UD followed by 11 digits)';
//       }
//     } else {
//       if (!formData.name || formData.name.trim().length < 2) {
//         newErrors.name = 'Name must be at least 2 characters';
//       }

//       const validOrgTypes = [
//         'INDIVIDUAL',
//         'PROPRIETORSHIP',
//         'PARTNERSHIP',
//         'COMPANY',
//         'CO_OPERATIVE',
//         'JOINT_VENTURE',
//         'TRUST',
//         'SOCIETY',
//         'LLP',
//         'PSU_CENTRAL',
//         'PSU_STATE',
//         'NOT_REGISTERED_IN_INDIA'
//       ];
//       if (!formData.org_type || !validOrgTypes.includes(formData.org_type)) {
//         newErrors.org_type = 'Please select a valid organization type';
//       }

//       if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//         newErrors.email = 'Please enter a valid email address';
//       }

//       if (formData.org_type !== 'INDIVIDUAL' && (!formData.gst_no || !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gst_no.toUpperCase()))) {
//         newErrors.gst_no = 'Please enter a valid GST number';
//       }

//       if (!formData.district_name) {
//         newErrors.district_name = 'Please select a district';
//       }
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSuccessMessage('');

//     if (!validateForm()) {
//       return;
//     }

//     setLoading(true);
//     try {
//       if (isSeller) {
//         const response = await fetch('/api/seller/profile', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             phone: seller.phone,
//             shop_name: formData.shop_name.trim(),
//             artisan_name: formData.artisan_name.trim(),
//             district: formData.district,
//             udyam_number: formData.udyam_number.toUpperCase(),
//           }),
//         });

//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(errorData.message || 'Failed to save profile');
//         }

//         const result = await response.json();
//         onProfileComplete(result.data.seller);
//       } else {
//         const response = await fetch('/api/buyer/profile', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             phone: buyer.phone,
//             name: formData.name.trim(),
//             org_type: formData.org_type,
//             email: formData.email ? formData.email.trim() : null,
//             gst_no: formData.gst_no ? formData.gst_no.toUpperCase() : null,
//             district_name: formData.district_name,
//           }),
//         });

//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(errorData.message || 'Failed to save profile');
//         }

//         const result = await response.json();
//         onProfileComplete(result.data.buyer);
//       }
//     } catch (error) {
//       setErrors({
//         general: error.message || 'Failed to update profile',
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="onboarding-container">
//       <div className="onboarding-card">
//         <h1>Complete Your {isSeller ? 'Seller' : 'Buyer'} Profile</h1>
//         <p className="subtitle">Phone: +91{user?.phone}</p>

//         {errors.general && <div className="error-message">{errors.general}</div>}
//         {successMessage && <div className="success-message">{successMessage}</div>}

//         <form onSubmit={handleSubmit} className="onboarding-form">
//           {isSeller ? (
//             <>
//               <div className="form-group">
//                 <label htmlFor="shop_name">Shop Name *</label>
//                 <input
//                   type="text"
//                   id="shop_name"
//                   name="shop_name"
//                   placeholder="Enter your shop name"
//                   value={formData.shop_name}
//                   onChange={handleInputChange}
//                   disabled={loading}
//                   maxLength="100"
//                   className={errors.shop_name ? 'error' : ''}
//                 />
//                 {errors.shop_name && <span className="error-text">{errors.shop_name}</span>}
//               </div>

//               <div className="form-group">
//                 <label htmlFor="artisan_name">Artisan Name *</label>
//                 <input
//                   type="text"
//                   id="artisan_name"
//                   name="artisan_name"
//                   placeholder="Enter artisan's full name"
//                   value={formData.artisan_name}
//                   onChange={handleInputChange}
//                   disabled={loading}
//                   maxLength="100"
//                   className={errors.artisan_name ? 'error' : ''}
//                 />
//                 {errors.artisan_name && <span className="error-text">{errors.artisan_name}</span>}
//               </div>

//               <div className="form-group">
//                 <label htmlFor="district">District *</label>
//                 <select
//                   id="district"
//                   name="district"
//                   value={formData.district}
//                   onChange={handleInputChange}
//                   disabled={loading}
//                   className={errors.district ? 'error' : ''}
//                 >
//                   <option value="">Select a district</option>
//                   {DISTRICTS.map((district) => (
//                     <option key={district} value={district}>
//                       {district}
//                     </option>
//                   ))}
//                 </select>
//                 {errors.district && <span className="error-text">{errors.district}</span>}
//               </div>

//               <div className="form-group">
//                 <label htmlFor="udyam_number">Udyam Number *</label>
//                 <input
//                   type="text"
//                   id="udyam_number"
//                   name="udyam_number"
//                   placeholder="UDddddddddddd"
//                   value={formData.udyam_number}
//                   onChange={handleInputChange}
//                   disabled={loading}
//                   maxLength="20"
//                   className={errors.udyam_number ? 'error' : ''}
//                 />
//                 {errors.udyam_number && <span className="error-text">{errors.udyam_number}</span>}
//                 <p className="input-hint">Format: 2 letters (UD) followed by alphanumeric characters</p>
//               </div>
//             </>
//           ) : (
//             <>
//               <div className="form-group">
//                 <label htmlFor="name">Full Name *</label>
//                 <input
//                   type="text"
//                   id="name"
//                   name="name"
//                   placeholder="Enter your full name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   disabled={loading}
//                   maxLength="100"
//                   className={errors.name ? 'error' : ''}
//                 />
//                 {errors.name && <span className="error-text">{errors.name}</span>}
//               </div>

//               <div className="form-group">
//                 <label htmlFor="org_type">Organization Type *</label>
//                 <select
//                   id="org_type"
//                   name="org_type"
//                   value={formData.org_type}
//                   onChange={handleInputChange}
//                   disabled={loading}
//                   className={errors.org_type ? 'error' : ''}
//                 >
//                   <option value="">Select a organization type</option>
//                   <option value="INDIVIDUAL">Individual</option>
//                   <option value="PROPRIETORSHIP">Proprietorship</option>
//                   <option value="PARTNERSHIP">Partnership</option>
//                   <option value="COMPANY">Company</option>
//                   <option value="CO_OPERATIVE">Co-operative</option>
//                   <option value="JOINT_VENTURE">Joint Venture</option>
//                   <option value="TRUST">Trust</option>
//                   <option value="SOCIETY">Society</option>
//                   <option value="LLP">LLP</option>
//                   <option value="PSU_CENTRAL">PSU Central</option>
//                   <option value="PSU_STATE">PSU State</option>
//                   <option value="NOT_REGISTERED_IN_INDIA">Not Registered in India</option>
//                 </select>
//                 {errors.org_type && <span className="error-text">{errors.org_type}</span>}
//               </div>

//               <div className="form-group">
//                 <label htmlFor="email">Email (Optional)</label>
//                 <input
//                   type="email"
//                   id="email"
//                   name="email"
//                   placeholder="Enter your email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   disabled={loading}
//                   maxLength="100"
//                   className={errors.email ? 'error' : ''}
//                 />
//                 {errors.email && <span className="error-text">{errors.email}</span>}
//               </div>

//               {formData.org_type !== 'INDIVIDUAL' && (
//                 <div className="form-group">
//                   <label htmlFor="gst_no">GST Number *</label>
//                   <input
//                     type="text"
//                     id="gst_no"
//                     name="gst_no"
//                     placeholder="22AAAAA0000A1Z5"
//                     value={formData.gst_no}
//                     onChange={handleInputChange}
//                     disabled={loading}
//                     maxLength="15"
//                     className={errors.gst_no ? 'error' : ''}
//                   />
//                   {errors.gst_no && <span className="error-text">{errors.gst_no}</span>}
//                   <p className="input-hint">Required for non-individual buyers</p>
//                 </div>
//               )}

//               <div className="form-group">
//                 <label htmlFor="district_name">District *</label>
//                 <select
//                   id="district_name"
//                   name="district_name"
//                   value={formData.district_name}
//                   onChange={handleInputChange}
//                   disabled={loading}
//                   className={errors.district_name ? 'error' : ''}
//                 >
//                   <option value="">Select a district</option>
//                   {DISTRICTS.map((district) => (
//                     <option key={district} value={district}>
//                       {district}
//                     </option>
//                   ))}
//                 </select>
//                 {errors.district_name && <span className="error-text">{errors.district_name}</span>}
//               </div>
//             </>
//           )}

//           <button
//             type="submit"
//             className="submit-btn"
//             disabled={loading}
//           >
//             {loading ? 'Completing Profile...' : 'Complete Profile'}
//           </button>
//         </form>

//         <p className="info-text">
//           All fields are required to complete your profile and access the dashboard.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default OnboardingComponent;


import { useState } from 'react';
import './OnboardingComponent.css';

const DISTRICTS = [
  'Agar Malwa',
  'Alirajpur',
  'Anuppur',
  'Ashok Nagar',
  'Balaghat',
  'Barwani',
  'Betul',
  'Bhind',
  'Bhopal',
  'Burhanpur',
  'Chhatarpur',
  'Chhindwara',
  'Damoh',
  'Datia',
  'Dewas',
  'Dhar',
  'Dindori',
  'Guna',
  'Gwalior',
  'Harda',
  'Hoshangabad',
  'Indore',
  'Jabalpur',
  'Jhabua',
  'Katni',
  'Khandwa',
  'Khargone',
  'Mandla',
  'Mandsaur',
  'Morena',
  'Narsinghpur',
  'Neemuch',
  'Niwari',
  'Panna',
  'Raisen',
  'Rajgarh',
  'Ratlam',
  'Rewa',
  'Sagar',
  'Satna',
  'Sehore',
  'Seoni',
  'Shahdol',
  'Shajapur',
  'Sheopur',
  'Shivpuri',
  'Sidhi',
  'Singrauli',
  'Tikamgarh',
  'Ujjain',
  'Umaria',
  'Vidisha',
];

export const OnboardingComponent = ({ buyer, seller, onProfileComplete }) => {
  const isSeller = !!seller;
  const user = buyer || seller;
  const [formData, setFormData] = useState(() => {
    if (isSeller) {
      return {
        shop_name: '',
        artisan_name: '',
        district: '',
        udyam_number: '',
      };
    } else {
      return {
        name: '',
        org_type: 'INDIVIDUAL',
        email: '',
        gst_no: '',
        district_name: '',
      };
    }
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

    if (isSeller) {
      if (!formData.shop_name || formData.shop_name.trim().length < 3) {
        newErrors.shop_name = 'Shop name must be at least 3 characters';
      }

      if (!formData.artisan_name || formData.artisan_name.trim().length < 2) {
        newErrors.artisan_name = 'Artisan name must be at least 2 characters';
      }

      if (!formData.district) {
        newErrors.district = 'Please select a district';
      }

      const udyamRegex = /^UD\d{11}$/;
      if (!formData.udyam_number || !udyamRegex.test(formData.udyam_number)) {
        newErrors.udyam_number = 'Invalid Udyam number (format: UD followed by 11 digits)';
      }
    } else {
      if (!formData.name || formData.name.trim().length < 2) {
        newErrors.name = 'Name must be at least 2 characters';
      }

      const validOrgTypes = [
        'INDIVIDUAL',
        'PROPRIETORSHIP',
        'PARTNERSHIP',
        'COMPANY',
        'CO_OPERATIVE',
        'JOINT_VENTURE',
        'TRUST',
        'SOCIETY',
        'LLP',
        'PSU_CENTRAL',
        'PSU_STATE',
        'NOT_REGISTERED_IN_INDIA'
      ];
      if (!formData.org_type || !validOrgTypes.includes(formData.org_type)) {
        newErrors.org_type = 'Please select a valid organization type';
      }

      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }

      if (formData.org_type !== 'INDIVIDUAL' && (!formData.gst_no || !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gst_no.toUpperCase()))) {
        newErrors.gst_no = 'Please enter a valid GST number';
      }

      if (!formData.district_name) {
        newErrors.district_name = 'Please select a district';
      }
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
      if (isSeller) {
        const response = await fetch('/api/seller/profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone: seller.phone,
            shop_name: formData.shop_name.trim(),
            artisan_name: formData.artisan_name.trim(),
            district: formData.district,
            udyam_number: formData.udyam_number.toUpperCase(),
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to save profile');
        }

        const result = await response.json();
        onProfileComplete(result.data.seller);
      } else {
        const response = await fetch('/api/buyer/profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone: buyer.phone,
            name: formData.name.trim(),
            org_type: formData.org_type,
            email: formData.email ? formData.email.trim() : null,
            gst_no: formData.gst_no ? formData.gst_no.toUpperCase() : null,
            district_name: formData.district_name,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to save profile');
        }

        const result = await response.json();
        onProfileComplete(result.data.buyer);
      }
    } catch (error) {
      setErrors({
        general: error.message || 'Failed to update profile',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="onboarding-container">

       <div className="gov-header">
        <h1>Government of Madhya Pradesh</h1>
        <p>One District One Product (ODOP) Marketplace</p>
      </div>

      <div className="onboarding-card">
         <div className="onboarding-left">
        <h2>{isSeller ? 'Seller Access Portal' : 'Buyer Access Portal'}</h2>
          <p>
            Join the ODOP Marketplace to support local artisans and access
            authentic district products across Madhya Pradesh.
          </p>
          <ul>
            <li>✔ Government-backed platform</li>
            <li>✔ Secure & trusted transactions</li>
            <li>✔ Verified district products</li>
          </ul>
        </div>
      <div className="onboarding-right">
          <h3>Complete Your {isSeller ? 'Seller' : 'Buyer'} Profile</h3>
          <p className="subtitle">+91 {user?.phone}</p>

        {errors.general && <div className="error-message">{errors.general}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <form onSubmit={handleSubmit} className="onboarding-form">
          {isSeller ? (
            <>
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
                  placeholder="UDddddddddddd"
                  value={formData.udyam_number}
                  onChange={handleInputChange}
                  disabled={loading}
                  maxLength="20"
                  className={errors.udyam_number ? 'error' : ''}
                />
                {errors.udyam_number && <span className="error-text">{errors.udyam_number}</span>}
                <p className="input-hint">Format: 2 letters (UD) followed by alphanumeric characters</p>
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={loading}
                  maxLength="100"
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="org_type">Organization Type *</label>
                <select
                  id="org_type"
                  name="org_type"
                  value={formData.org_type}
                  onChange={handleInputChange}
                  disabled={loading}
                  className={errors.org_type ? 'error' : ''}
                >
                  <option value="">Select a organization type</option>
                  <option value="INDIVIDUAL">Individual</option>
                  <option value="PROPRIETORSHIP">Proprietorship</option>
                  <option value="PARTNERSHIP">Partnership</option>
                  <option value="COMPANY">Company</option>
                  <option value="CO_OPERATIVE">Co-operative</option>
                  <option value="JOINT_VENTURE">Joint Venture</option>
                  <option value="TRUST">Trust</option>
                  <option value="SOCIETY">Society</option>
                  <option value="LLP">LLP</option>
                  <option value="PSU_CENTRAL">PSU Central</option>
                  <option value="PSU_STATE">PSU State</option>
                  <option value="NOT_REGISTERED_IN_INDIA">Not Registered in India</option>
                </select>
                {errors.org_type && <span className="error-text">{errors.org_type}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email (Optional)</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={loading}
                  maxLength="100"
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              {formData.org_type !== 'INDIVIDUAL' && (
                <div className="form-group">
                  <label htmlFor="gst_no">GST Number *</label>
                  <input
                    type="text"
                    id="gst_no"
                    name="gst_no"
                    placeholder="22AAAAA0000A1Z5"
                    value={formData.gst_no}
                    onChange={handleInputChange}
                    disabled={loading}
                    maxLength="15"
                    className={errors.gst_no ? 'error' : ''}
                  />
                  {errors.gst_no && <span className="error-text">{errors.gst_no}</span>}
                  <p className="input-hint">Required for non-individual buyers</p>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="district_name">District *</label>
                <select
                  id="district_name"
                  name="district_name"
                  value={formData.district_name}
                  onChange={handleInputChange}
                  disabled={loading}
                  className={errors.district_name ? 'error' : ''}
                >
                  <option value="">Select a district</option>
                  {DISTRICTS.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
                {errors.district_name && <span className="error-text">{errors.district_name}</span>}
              </div>
            </>
          )}

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
    </div>
  );
};

export default OnboardingComponent;
