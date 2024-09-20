
import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import bcrypt from 'bcryptjs';


export const registerUser = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  try {
    const existingUser: IUser | null = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    
    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error: any) {
    console.log(error,"error");
    return res.status(500).json({ message: 'Server error' });
  }
};


export const loginUser = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  try {
    const user: IUser | null = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    return res.status(200).json({ message: 'Login successful', user:user.email });
  } catch (error: any) {
    return res.status(500).json({ message: 'Server error' });
  }
};
