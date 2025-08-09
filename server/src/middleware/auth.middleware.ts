import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env';
import Vendor from '../models/Vendor.model';
import { AuthRequest } from '../types';

export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { vendor: { id: string } };

    // Get vendor from token
    const vendor = await Vendor.findById(decoded.vendor.id).select('-password');

    if (!vendor) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    if (vendor.blacklisted) {
      return res.status(403).json({ message: 'Account suspended' });
    }

    req.vendor = vendor;
    next();
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Authentication error:', err.message);
    } else {
      console.error('Unknown authentication error:', err);
    }
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export const admin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.vendor || !req.vendor.email.includes('admin')) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};