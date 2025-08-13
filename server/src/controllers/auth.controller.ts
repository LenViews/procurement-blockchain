import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Vendor from '../models/Vendor.model';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/env';
import { AuthRequest } from '../types';
import { registerVendorSchema, loginVendorSchema } from '../middleware/validate.middleware';

export const registerVendor = async (req: Request, res: Response) => {
  try {
    const { email, password, kraPin, companyName, phoneNumber, category } = req.body;

    // Check if vendor exists
    const existingVendor = await Vendor.findOne({ 
      $or: [
        { email },
        { kraPin }
      ]
    });
    
    if (existingVendor) {
      const errors: Record<string, string> = {};
      if (existingVendor.email === email) {
        errors.email = 'Email is already registered';
      }
      if (existingVendor.kraPin === kraPin) {
        errors.kraPin = 'KRA Pin is already registered';
      }
      return res.status(400).json({ 
        success: false,
        message: 'Registration failed',
        errors
      });
    }

    // Create new vendor - password will be hashed in the model's pre-save hook
    const vendor = new Vendor({
      email,
      password,
      kraPin: kraPin.toUpperCase(),
      companyName,
      phoneNumber,
      category
    });

    await vendor.save();

    // Create JWT
    const payload = {
      vendor: {
        id: vendor.id
      }
    };

    // Remove password from response
    const vendorResponse = vendor.toObject();
    delete vendorResponse.password;

    jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN }, (err, token) => {
      if (err) {
        console.error('JWT signing error:', err);
        return res.status(500).json({ 
          success: false,
          message: 'Error generating token'
        });
      }
      res.status(201).json({ 
        success: true,
        token,
        vendor: vendorResponse 
      });
    });
  } catch (err: unknown) {
    console.error('Registration error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error during registration',
      error: err instanceof Error ? err.message : 'Unknown error'
    });
  }
};

export const loginVendor = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Email and password are required' 
      });
    }

    // Check if vendor exists
    const vendor = await Vendor.findOne({ email: email.toLowerCase() });
    if (!vendor) {
      return res.status(400).json({ 
        success: false,
        message: 'No vendor found with this email' 
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false,
        message: 'Incorrect password' 
      });
    }

    // Check if vendor is blacklisted
    if (vendor.blacklisted) {
      return res.status(403).json({ 
        success: false,
        message: 'Account suspended. Please contact support' 
      });
    }

    // Create JWT
    const payload = {
      vendor: {
        id: vendor.id
      }
    };

    // Remove password from response
    const vendorResponse = vendor.toObject();
    delete vendorResponse.password;

    jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN }, (err, token) => {
      if (err) {
        console.error('JWT signing error:', err);
        return res.status(500).json({ 
          success: false,
          message: 'Error generating token'
        });
      }
      res.json({ 
        success: true,
        token,
        vendor: vendorResponse 
      });
    });
  } catch (err: unknown) {
    console.error('Login error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error during login',
      error: err instanceof Error ? err.message : 'Unknown error'
    });
  }
};

export const getVendor = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.vendor) {
      return res.status(401).json({ 
        success: false,
        message: 'Unauthorized: No vendor information found' 
      });
    }
    
    const vendor = await Vendor.findById(req.vendor.id)
      .select('-password -__v')
      .lean();
      
    if (!vendor) {
      return res.status(404).json({ 
        success: false,
        message: 'Vendor not found' 
      });
    }

    res.json({ 
      success: true,
      vendor 
    });
  } catch (err: unknown) {
    console.error('Get vendor error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching vendor',
      error: err instanceof Error ? err.message : 'Unknown error'
    });
  }
};

export const logoutVendor = async (req: AuthRequest, res: Response) => {
  try {
    // Invalidate the token on the client side
    // This is a stateless logout, so no server-side action is needed
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (err: unknown) {
    console.error('Logout error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error during logout',
      error: err instanceof Error ? err.message : 'Unknown error'
    });
  }
};