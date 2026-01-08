# ODOP Marketplace - Seller Authentication System

A complete, production-ready seller authentication and onboarding system for the ODOP (One District One Product) Marketplace in Madhya Pradesh.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Database Setup](#database-setup)
- [API Documentation](#api-documentation)
- [Features](#features)

## 🎯 Overview

This system enables artisans and small business owners in Madhya Pradesh to:
1. Register using their phone number (OTP verification)
2. Complete their seller profile with shop details
3. Access the seller dashboard

## 🛠️ Tech Stack

### Backend
- **Framework**: Express.js (Node.js)
- **Database**: MySQL
- **Validation**: Custom validators
- **OTP**: Mock SMS service (extensible for Twilio, AWS SNS, etc.)

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: CSS3

### Database
- **MySQL**: 8.0+
- **Tables**: `sellers`, `otp_codes`, `otp_attempts` (optional)

## 📁 Project Structure

```
Hack-Make/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── sellerController.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   └── sellerRoutes.js
│   │   ├── middleware/
│   │   ├── utils/
│   │   │   ├── otp.js
│   │   │   └── validators.js
│   │   └── index.js
│   ├── package.json
│   ├── .env.example
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LoginComponent.jsx
│   │   │   └── OnboardingComponent.jsx
│   │   ├── pages/
│   │   │   └── DashboardPage.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── authService.js
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── README.md
├── database/
│   ├── schema.sql
│   ├── seed.sql
│   └── README.md
└── README.md (this file)
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- MySQL 8.0+
- Git (optional)

### 1. Database Setup

```bash
# Open MySQL client
mysql -u root -p

# Create database
CREATE DATABASE odop_marketplace;

# Use database
USE odop_marketplace;

# Import schema
SOURCE database/schema.sql;

# (Optional) Import sample data
SOURCE database/seed.sql;
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your database credentials
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=odop_marketplace

# Start development server
npm run dev
# Server runs on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
# Client runs on http://localhost:3000
```

## 📚 API Documentation

### Authentication Endpoints

#### Send OTP
```http
POST /api/auth/send-otp
Content-Type: application/json

{
  "phone": "9876543210"
}

Response:
{
  "success": true,
  "message": "OTP sent successfully to 9876543210",
  "phone": "9876543210",
  "devOTP": "123456" // Only in development
}
```

#### Verify OTP
```http
POST /api/auth/verify-otp
Content-Type: application/json

{
  "phone": "9876543210",
  "otp": "123456"
}

Response:
{
  "success": true,
  "message": "OTP verified successfully",
  "data": {
    "seller": {
      "id": 1,
      "phone": "9876543210",
      "shop_name": null,
      "artisan_name": null,
      "district": null,
      "udyam_number": null,
      "is_profile_complete": false
    }
  }
}
```

### Seller Endpoints

#### Update Profile
```http
PUT /api/seller/:sellerId/profile
Content-Type: application/json

{
  "shop_name": "Artisan Shop",
  "artisan_name": "John Doe",
  "district": "Indore",
  "udyam_number": "UD12345678901"
}

Response:
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "seller": {
      "id": 1,
      "phone": "9876543210",
      "shop_name": "Artisan Shop",
      "artisan_name": "John Doe",
      "district": "Indore",
      "udyam_number": "UD12AB1234567",
      "is_profile_complete": true
    }
  }
}
```

#### Get Profile
```http
GET /api/seller/:sellerId/profile

Response:
{
  "success": true,
  "data": {
    "seller": {
      "id": 1,
      "phone": "9876543210",
      "shop_name": "Artisan Shop",
      "artisan_name": "John Doe",
      "district": "Indore",
      "udyam_number": "UD12345678901",
      "is_profile_complete": true,
      "created_at": "2024-01-05T10:00:00Z"
    }
  }
}
```

## ✨ Features

### Authentication
- ✅ Phone-based OTP authentication
- ✅ 6-digit OTP with 5-minute expiry
- ✅ Automatic seller account creation
- ✅ Session persistence with localStorage
- ✅ Phone number validation (Indian format)

### Profile Management
- ✅ Shop name and artisan name collection
- ✅ District selection (52 Madhya Pradesh districts)
- ✅ Udyam registration number validation
- ✅ Profile completion tracking
- ✅ Data validation and error handling

### User Interface
- ✅ Responsive design (mobile-first)
- ✅ Modern gradient UI
- ✅ Form validation with error messages
- ✅ Loading states for async operations
- ✅ Success/error feedback messages
- ✅ Seller dashboard with profile info

### Security
- ✅ Input validation on client and server
- ✅ Database indexing for performance
- ✅ OTP expiry handling
- ✅ Phone number sanitization
- ✅ CORS enabled for production

## 🔐 Valid Districts

The system supports all 52 districts of Madhya Pradesh:

Indore, Bhopal, Jabalpur, Ujjain, Gwalior, Sagi, Ratlam, Dewas, Dhar, Khargone, Barwani, Jhabua, Alirajpur, Vidisha, Raisen, Sehore, Ashok Nagar, Guna, Damoh, Panna, Chhatarpur, Satna, Rewa, Singrauli, Shahdol, Umaria, Anuppur, Seoni, Mandla, Dindori, Chhindwara, Balaghat

(Full list in `backend/src/utils/validators.js`)

## 📝 Database Schema

### sellers table
- `id` (INT, Primary Key)
- `phone` (VARCHAR(10), Unique)
- `shop_name` (VARCHAR(100))
- `artisan_name` (VARCHAR(100))
- `district` (VARCHAR(50))
- `udyam_number` (VARCHAR(20))
- `is_profile_complete` (BOOLEAN, default: false)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### otp_codes table
- `id` (INT, Primary Key)
- `phone` (VARCHAR(10))
- `code` (VARCHAR(6))
- `created_at` (TIMESTAMP)
- `expires_at` (TIMESTAMP)

### otp_attempts table (Optional)
- `id` (INT, Primary Key)
- `phone` (VARCHAR(10), Unique)
- `attempt_count` (INT)
- `last_attempt` (TIMESTAMP)
- `is_blocked` (BOOLEAN)
- `blocked_until` (TIMESTAMP)

## 🧪 Testing

### Test Phone Number
Use any 10-digit number starting with 6-9:
- `9876543210`
- `8765432109`
- `7654321098`

### Test OTP
In development mode, the OTP is returned in the API response (`devOTP` field).

## 🚀 Deployment

### Backend Deployment

1. Set up environment variables on your server
2. Install MySQL and Node.js
3. Create database with schema
4. Configure CORS for your frontend domain
5. Deploy to your server (AWS, Heroku, DigitalOcean, etc.)

### Frontend Deployment

1. Build the frontend: `npm run build`
2. Deploy `dist` folder to your hosting (Vercel, Netlify, AWS S3, etc.)
3. Update API base URL in `src/config/api.js`

## 📖 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [React Router Documentation](https://reactrouter.com/)

## 🤝 Contributing

Contributions are welcome! Please follow the existing code structure and styling conventions.

## 📄 License

This project is provided as-is for the ODOP Marketplace initiative.

## 🆘 Troubleshooting

### Database Connection Error
- Check MySQL service is running
- Verify credentials in `.env`
- Ensure database exists

### CORS Error
- Check API URL in frontend config
- Ensure CORS middleware is enabled
- Verify port numbers

### OTP Not Received
- In development, OTP is shown in API response
- In production, integrate with SMS service (Twilio, AWS SNS)
- Check phone number format

## 📞 Support

For issues and questions, please refer to the individual README files in `backend/` and `frontend/` directories.
