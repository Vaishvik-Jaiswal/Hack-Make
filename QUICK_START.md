# ODOP Marketplace - Quick Start Guide

## 🚀 Get Up and Running in 5 Minutes

### Prerequisites
- Node.js 16+ installed
- MySQL 8.0+ installed and running
- Git (optional)

---

## Step 1: Database Setup (2 minutes)

```bash
# Open MySQL
mysql -u root -p

# Run these commands:
CREATE DATABASE odop_marketplace;
USE odop_marketplace;
SOURCE database/schema.sql;

# Type: exit
```

---

## Step 2: Start Backend (1 minute)

```bash
# In terminal 1
cd backend
npm install
cp .env.example .env

# Edit .env with your database password
# Then run:
npm run dev

# You'll see: "ODOP Marketplace Backend running on http://localhost:5000"
```

---

## Step 3: Start Frontend (1 minute)

```bash
# In terminal 2
cd frontend
npm install
npm run dev

# You'll see: "Local: http://localhost:3000"
```

---

## Step 4: Test the Application

1. Open browser: `http://localhost:3000`
2. Enter phone: `9876543210`
3. Click "Send OTP"
4. Check **backend terminal** for OTP (look for `[MOCK SMS]...`)
5. Enter OTP and continue
6. Fill profile form:
   - Shop Name: `My Artisan Shop`
   - Artisan Name: `Your Name`
   - District: `Indore`
   - Udyam: `UD12AB1234567`
7. Click "Complete Profile"
8. See Dashboard!

## Step 5: Upload Your First Product

1. Click "Upload Products" button on Dashboard
2. Fill in product details:
   - Product Name: `Handmade Wooden Sculpture`
   - Description: `Beautiful wooden art piece`
   - Price: `2500`
   - Category: `Woodwork`
3. Select an image (JPG, PNG, GIF, or WebP - max 5MB)
4. Click "Upload Product"
5. See your product appear in the grid below!

---

## 📁 File Structure

```
Hack-Make/
├── backend/          ← Node.js + Express
│   └── src/
│       ├── controllers/   (API logic)
│       ├── routes/        (API endpoints)
│       └── utils/         (Helpers)
├── frontend/         ← React + Vite
│   └── src/
│       ├── components/    (UI components)
│       ├── pages/         (Pages)
│       └── services/      (API calls)
└── database/         ← SQL schema
```

---

## 🔑 Test Credentials

- **Phone**: Any 10-digit number starting with 6-9
  - `9876543210`
  - `8765432109`
  - `7654321098`

- **OTP**: Shown in backend terminal (development mode)

- **Districts**: 32 MP districts in dropdown
  - Indore, Bhopal, Jabalpur, etc.

- **Udyam**: Format `UDxxxx0000000`

---

## 🐛 Common Issues

### "Can't connect to MySQL"
```bash
# Check if MySQL is running
mysql -u root -p

# If error, restart MySQL:
# Windows: net start MySQL80
# Mac: brew services restart mysql
# Linux: sudo systemctl restart mysql
```

### "Port 3000/5000 already in use"
```bash
# Kill process on Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# On Mac/Linux:
lsof -ti:5000 | xargs kill -9
```

### "CORS Error"
- Make sure backend is running on port 5000
- Frontend on port 3000
- Check `frontend/src/config/api.js`

### "Blank page on frontend"
- Open DevTools (F12)
- Check Console tab for errors
- Check Network tab for API calls

---

## 📚 Important Files

| File | Purpose |
|------|---------|
| `backend/.env.example` | Backend config template |
| `database/schema.sql` | Create database tables |
| `frontend/src/App.jsx` | Main React component |
| `backend/src/index.js` | Server entry point |

---

## 🚀 Next Steps

1. **Customize**: Update shop, artisan names, districts
2. **Deploy**: Follow `SETUP_AND_DEPLOYMENT.md`
3. **Integrate SMS**: Update `backend/src/utils/otp.js` with Twilio/AWS
4. **Add Features**: Orders, products, payments
5. **Go Live**: Deploy to production

---

## 📖 Full Documentation

- Backend details: `backend/README.md`
- Frontend details: `frontend/README.md`
- Database setup: `database/README.md`
- Deployment guide: `SETUP_AND_DEPLOYMENT.md`
- Main README: `README.md`

---

## 💡 Tips

- Backend console shows OTP in development (for testing)
- Profile data is saved to localStorage on frontend
- All API responses are JSON format
- Seller profiles can be edited after completion
- OTP expires in 5 minutes (configurable)

---

## ❓ Need Help?

Check these files in order:
1. README.md (overview)
2. backend/README.md (API help)
3. frontend/README.md (UI help)
4. SETUP_AND_DEPLOYMENT.md (production)

Happy coding! 🎉
