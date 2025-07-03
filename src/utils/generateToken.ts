import jwt from 'jsonwebtoken';

export const generateToken = (userId: string, userRole: string): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return jwt.sign({ _id: userId, role: userRole }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};
