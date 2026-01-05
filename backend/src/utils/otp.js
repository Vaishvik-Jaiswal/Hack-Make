// Generate a random 6-digit OTP
function generateOTP(length = 6) {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}

// Mock SMS sending function
// In production, integrate with services like Twilio, AWS SNS, etc.
function sendSMS(phoneNumber, otp) {
  console.log(`[MOCK SMS] Sending OTP ${otp} to ${phoneNumber}`);
  // Actual implementation would call SMS API here
  return true;
}

module.exports = {
  generateOTP,
  sendSMS,
};
