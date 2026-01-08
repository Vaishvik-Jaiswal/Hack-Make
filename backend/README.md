# Backend - ODOP Marketplace

Express.js backend for seller authentication and profile management.

## Quick Start

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev
```

Server runs on `http://localhost:5000`

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js        # MySQL connection pool
│   ├── controllers/
│   │   ├── authController.js  # Auth endpoints (send-otp, verify-otp)
│   │   └── sellerController.js # Seller endpoints (profile)
│   ├── routes/
│   │   ├── authRoutes.js      # Auth routes
│   │   └── sellerRoutes.js    # Seller routes
│   ├── middleware/            # Express middleware
│   ├── utils/
│   │   ├── otp.js             # OTP generation and SMS
│   │   └── validators.js      # Input validation functions
│   └── index.js               # Server entry point
├── package.json
├── .env.example              # Environment variables template
└── README.md
```

## Environment Variables

Create a `.env` file in the backend directory:

```env
NODE_ENV=development
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=odop_marketplace

JWT_SECRET=your_jwt_secret_key_here

OTP_EXPIRY_MINUTES=5
OTP_LENGTH=6
```

## Dependencies

- **express**: Web framework
- **mysql2**: MySQL client
- **dotenv**: Environment variables
- **cors**: CORS middleware
- **body-parser**: Request parsing
- **uuid**: Unique IDs

## API Endpoints

### Authentication (`/api/auth`)
- `POST /send-otp` - Send OTP to phone number
- `POST /verify-otp` - Verify OTP and authenticate

### Seller (`/api/seller`)
- `GET /:sellerId/profile` - Get seller profile
- `PUT /:sellerId/profile` - Update seller profile

## Database Setup

```bash
# MySQL
mysql -u root -p
CREATE DATABASE odop_marketplace;
USE odop_marketplace;
SOURCE ../database/schema.sql;
```

## Key Features

- ✅ Phone-based OTP authentication
- ✅ Automatic seller account creation
- ✅ Profile completion workflow
- ✅ Input validation
- ✅ Error handling
- ✅ Database connection pooling
- ✅ Environment-based configuration

## Development

### Install Dependencies
```bash
npm install
```

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
NODE_ENV=production node src/index.js
```

## API Usage Examples

### Send OTP
```bash
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"9876543210"}'
```

### Verify OTP
```bash
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"9876543210","otp":"123456"}'
```

### Update Profile
```bash
curl -X PUT http://localhost:5000/api/seller/1/profile \
  -H "Content-Type: application/json" \
  -d '{
    "shop_name":"My Shop",
    "artisan_name":"John Doe",
    "district":"Indore",
    "udyam_number":"UD12345678901"
  }'
```

## Validation Rules

### Phone Number
- 10 digits
- Must start with 6-9
- Indian format only

### OTP
- 6 digits
- Alphanumeric
- 5-minute expiry (configurable)

### Shop Name
- 3-100 characters
- Required for profile completion

### Artisan Name
- 2-100 characters
- Required for profile completion

### Udyam Number
- Format: UDddddddddddd (starts with UD, followed by 11 digits)
- 12 characters total

### District
- Must be from valid Madhya Pradesh districts list
- 52 districts supported

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (development only)"
}
```

## Database Indexes

The schema includes indexes on:
- `phone` (sellers table)
- `phone` (otp_codes table)
- `is_profile_complete` (sellers table)
- `expires_at` (otp_codes table)

## OTP Implementation

The system uses mocked SMS sending. To integrate with real SMS services:

1. Update `sendSMS()` in `src/utils/otp.js`
2. Add Twilio, AWS SNS, or similar SDK
3. Update package.json dependencies

Example for Twilio:
```javascript
const twilio = require('twilio');
const client = twilio(accountSid, authToken);

function sendSMS(phoneNumber, otp) {
  return client.messages.create({
    body: `Your OTP is: ${otp}`,
    from: '+1234567890',
    to: `+91${phoneNumber}`
  });
}
```

## Performance Optimization

- Connection pooling for database
- Indexes on frequently queried columns
- OTP auto-expiry cleanup
- Request validation before DB queries

## Security Considerations

- Input sanitization
- SQL injection prevention (prepared statements)
- OTP expiry enforcement
- Phone number validation
- CORS configuration
- Environment variables for sensitive data

## Troubleshooting

### Database Connection Error
```
Check:
1. MySQL service is running
2. Credentials are correct
3. Database exists
4. Port 3306 is accessible
```

### CORS Error
```
Update src/index.js:
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### OTP Not Sending
```
In development, OTP is returned in response (devOTP field)
Check console for mock SMS logs
```

## Next Steps

1. Integrate with real SMS service (Twilio, AWS SNS)
2. Add JWT authentication
3. Implement rate limiting
4. Add logging system
5. Set up monitoring and error tracking
6. Deploy to production
