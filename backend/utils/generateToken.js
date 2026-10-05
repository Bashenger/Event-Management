import jwt from 'jsonwebtoken';

export const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'campus_super_secret_jwt_key_2026_secure',
    {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    }
  );
};
