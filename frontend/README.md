# ODOP Marketplace - Frontend

React + Vite based frontend for the ODOP Marketplace seller authentication and onboarding system.

## Features

- **Login Component**: Phone number authentication with OTP verification
- **Onboarding Component**: Profile completion form
- **Dashboard**: Seller dashboard with profile information
- **Responsive Design**: Mobile-first design approach
- **State Management**: Context and localStorage for auth state

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── LoginComponent.jsx
│   │   ├── LoginComponent.css
│   │   ├── OnboardingComponent.jsx
│   │   └── OnboardingComponent.css
│   ├── pages/
│   │   ├── DashboardPage.jsx
│   │   └── DashboardPage.css
│   ├── services/
│   │   ├── api.js
│   │   └── authService.js
│   ├── hooks/
│   │   └── useAuth.js
│   ├── config/
│   │   └── api.js
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── index.html
├── vite.config.js
└── package.json
```

## Installation

```bash
cd frontend
npm install
```

## Development

```bash
npm run dev
```

Server will run on `http://localhost:3000`

## Build

```bash
npm run build
```

## API Endpoints

### Authentication
- **POST** `/api/auth/send-otp` - Send OTP to phone number
- **POST** `/api/auth/verify-otp` - Verify OTP and authenticate

### Seller
- **PUT** `/api/seller/:sellerId/profile` - Update seller profile
- **GET** `/api/seller/:sellerId/profile` - Get seller profile

## Component Flow

1. **Login Component** → User enters phone number → OTP verification
2. **Onboarding Component** → User completes profile details
3. **Dashboard** → User sees complete profile and dashboard options

## Key Features

- Phone validation (10-digit Indian numbers)
- OTP input validation (6-digit)
- Form validation for profile data
- Error handling and user feedback
- Loading states for async operations
- Local storage for session persistence
- Responsive design for mobile and desktop
