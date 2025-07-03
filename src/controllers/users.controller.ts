import { Request, Response } from 'express';
import {
  findUserByEmail,
  findUserById,
  createUser,
  validateUserCredentials,
  updateUserById,
 
} from '../services/users.service';
import { generateToken } from '../utils/generateToken';
import { AuthRequest } from '../middlewares/auth.middleware';
// Register a new user
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Name, email, and password are required' });
      return;
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      res.status(400).json({ success: false, message: 'User with this email already exists' });
      return;
    }

    let assignedRole: 'user' | 'admin' = 'user';
    if (role === 'admin') {
      assignedRole = 'admin';
    }

    const newUser = await createUser(name, email, password, assignedRole);
    const token = generateToken((newUser._id as any).toString(), newUser.role);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: newUser.userData,
        token,
      },
    });
  } catch (error) {
    console.error('Register user error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required' });
      return;
    }

    const user = await validateUserCredentials(email, password);
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    const token = generateToken(String(user._id), user.role);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.userData,
        token,
      },
    });
  } catch (error) {
    console.error('Login user error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ success: false, message: 'User not authenticated' });
      return;
    }

    const user = await findUserById(userId);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'User profile retrieved successfully',
      data: {
        user: user.userData,
      },
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Update user profile
export const updateUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { name, email } = req.body;

    if (!userId) {
      res.status(401).json({ success: false, message: 'User not authenticated' });
      return;
    }

    const update: any = {};
    if (name !== undefined) update.name = name;
    if (email !== undefined) update.email = email;
    const user = await updateUserById(userId, update);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    res.status(200).json({
      success: true,
      message: 'User profile updated successfully',
      data: {
        user: user.userData,
      },
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ...admin user functions removed. All admin user logic is now in the admin folder...
