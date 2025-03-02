import crypto from 'crypto';

// Function to generate a random JWT secret
function generateJwtSecret(length) {
  return crypto.randomBytes(length).toString('hex');
}

// Generate a 32-byte (64-character) JWT secret
const jwtSecret = generateJwtSecret(32);
console.log('Generated JWT_SECRET:', jwtSecret);
