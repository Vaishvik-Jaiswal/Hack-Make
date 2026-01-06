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

// Validate Udyam number format (should be 12 characters: UD followed by 11 digits)
function isValidUdyamNumber(udyamNumber) {
  const udyamRegex = /^UD\d{11}$/;
  return udyamRegex.test(udyamNumber);
}

// Validate district (must be from valid list)
const validDistricts = [
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
