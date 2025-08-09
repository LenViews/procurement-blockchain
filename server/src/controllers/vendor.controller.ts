import { Request, Response } from 'express';
import Vendor from '../models/Vendor.model';
import { AuthRequest } from '../types';

export const getVendorProfile = async (req: AuthRequest, res: Response) => {
  if (!req.vendor) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  try {
    const vendor = await Vendor.findById(req.vendor.id)
      .select('-password -blacklisted -createdAt -updatedAt');
    res.json(vendor);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error('Unknown error in getVendorProfile');
    }
    res.status(500).send('Server error');
  }
};

export const updateVendorProfile = async (req: AuthRequest, res: Response) => {
  if (!req.vendor) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  try {
    const { companyName, phoneNumber } = req.body;

    const vendor = await Vendor.findByIdAndUpdate(
      req.vendor.id,
      { companyName, phoneNumber },
      { new: true }
    ).select('-password -blacklisted -createdAt -updatedAt');

    res.json(vendor);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error('Unknown error in updateVendorProfile');
    }
    res.status(500).send('Server error');
  }
};

export const getAllVendors = async (req: Request, res: Response) => {
  try {
    const vendors = await Vendor.find({ blacklisted: false })
      .select('-password -blacklisted -createdAt -updatedAt');
    res.json(vendors);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error('Unknown error in getAllVendors');
    }
    res.status(500).send('Server error');
  }
};