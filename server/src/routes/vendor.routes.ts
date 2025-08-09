import { Router } from 'express';
import {
  getVendorProfile,
  updateVendorProfile,
  getAllVendors
} from '../controllers/vendor.controller';
import { auth } from '../middleware/auth.middleware';

const router = Router();

// @route   GET api/vendors/me
// @desc    Get vendor profile
// @access  Private
router.get('/me', auth, getVendorProfile);

// @route   PUT api/vendors/me
// @desc    Update vendor profile
// @access  Private
router.put('/me', auth, updateVendorProfile);

// @route   GET api/vendors
// @desc    Get all vendors
// @access  Public
router.get('/', getAllVendors);

export default router;