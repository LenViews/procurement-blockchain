import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Vendor from '../models/Vendor.model';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/env';
import { AuthRequest } from '../types';
import { registerVendorSchema, loginVendorSchema } from '../middleware/validate.middleware';

export const registerVendor = async (req: Request, res: Response) => {
  try {
    const { email, password, kraPin, companyName, phoneNumber, category } = req.body;

    // Check if vendor exists
    let vendor = await Vendor.findOne({ email });
    if (vendor) {
      return res.status(400).json({ message: 'Vendor already exists' });
    }

    // Create new vendor
    vendor = new Vendor({
      email,
      password,
      kraPin,
      companyName,
      phoneNumber,
      category
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    vendor.password = await bcrypt.hash(password, salt);

    await vendor.save();

    // Create JWT
    const payload = {
      vendor: {
        id: vendor.id
      }
    };

    jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN }, (err, token) => {
      if (err) throw err;
      res.json({ token, vendor });
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error(err);
    }
    res.status(500).send('Server error');
  }
};

export const loginVendor = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if vendor exists
    const vendor = await Vendor.findOne({ email });
    if (!vendor) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if vendor is blacklisted
    if (vendor.blacklisted) {
      return res.status(403).json({ message: 'Account suspended. Contact support' });
    }

    // Create JWT
    const payload = {
      vendor: {
        id: vendor.id
      }
    };

    jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN }, (err, token) => {
      if (err) throw err;
      res.json({ token, vendor });
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error(err);
    }
    res.status(500).send('Server error');
  }
};

export const getVendor = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.vendor) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const vendor = await Vendor.findById(req.vendor.id).select('-password');
    res.json(vendor);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error(err);
    }
    res.status(500).send('Server error');
  }
};