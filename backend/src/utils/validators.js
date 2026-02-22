// Validate phone number (Indian format: 10 digits)
function isValidPhone(phone) {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
}

// Validate OTP (6 digits)
function isValidOTP(otp) {
  return /^\d{6}$/.test(otp);
}

// Validate shop name
function isValidShopName(shopName) {
  return shopName && shopName.trim().length >= 3 && shopName.trim().length <= 100;
}

// Validate artisan name
function isValidArtisanName(artisanName) {
  return artisanName && artisanName.trim().length >= 2 && artisanName.trim().length <= 100;
}

// Validate Udyam number format (12 chars: UD + 10 alphanumeric, e.g. UD1234AB5670)
function isValidUdyamNumber(udyamNumber) {
  const udyamRegex = /^UD[A-Z0-9]{10}$/;
  return udyamRegex.test(udyamNumber.toUpperCase());
}

// Validate district (must be from valid list)
const validDistricts = [
  'Indore',
  'Bhopal',
  'Jabalpur',
  'Ujjain',
  'Gwalior',
  'Sagi',
  'Ratlam',
  'Dewas',
  'Dhar',
  'Khargone',
  'Barwani',
  'Jhabua',
  'Alirajpur',
  'Vidisha',
  'Raisen',
  'Sehore',
  'Ashok Nagar',
  'Guna',
  'Damoh',
  'Panna',
  'Chhatarpur',
  'Satna',
  'Rewa',
  'Singrauli',
  'Shahdol',
  'Umaria',
  'Anuppur',
  'Seoni',
  'Mandla',
  'Dindori',
  'Chhindwara',
  'Balaghat',
];

function isValidDistrict(district) {
  return validDistricts.includes(district);
}

module.exports = {
  isValidPhone,
  isValidOTP,
  isValidShopName,
  isValidArtisanName,
  isValidUdyamNumber,
  isValidDistrict,
  validDistricts,
};
