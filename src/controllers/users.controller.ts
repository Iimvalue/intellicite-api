import { Request, Response } from 'express';
import {
  findUserByEmail,
  findUserById,
  createUser,
  validateUserCredentials,
  getAllUsers,
  updateUserById,
  deleteUserById
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

    const user = await findUserById(userId);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

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

// Admin: Get all users
export const getUsers = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = await getAllUsers();

    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: {
        users: users.map((user) => user.userData),
      },
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// admin: update user by ID
export const adminUpdateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, email, role, password } = req.body;
    const update: any = {};
    if (name !== undefined) update.name = name;
    if (email !== undefined) update.email = email;
    if (role !== undefined) update.role = role;
    if (password !== undefined) update.password = password;
    const user = await updateUserById(id, update);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: { user: user.userData },
    });
  } catch (error) {
    console.error('Admin update user error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// admin: delete user by ID
export const adminDeleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await deleteUserById(id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: { user: user.userData },
    });
  } catch (error) {
    console.error('Admin delete user error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
