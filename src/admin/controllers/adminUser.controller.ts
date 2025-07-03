import { Request, Response } from 'express';
import { getAllUsers, updateUserById, deleteUserById, createUser } from '../services/adminUser.service';

export const adminListAllUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await getAllUsers();
    res.status(200).json({
      success: true,
      data: { users: users.map((user: any) => user.userData) },
    });
  } catch (error) {
    console.error('Admin list all users error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const adminUpdateUser = async (req: Request, res: Response): Promise<void> => {
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

export const adminDeleteUser = async (req: Request, res: Response): Promise<void> => {
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

export const adminCreateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Name, email, and password are required' });
      return;
    }
    const user = await createUser(name, email, password, role);
    res.status(201).json({
      success: true,
      message: 'user created successfully',
      data: { user: user.userData },
    });
  } catch (error) {
    console.error('admin create user error:', error);
    res.status(500).json({ success: false, message: 'internal server error' });
  }
};
