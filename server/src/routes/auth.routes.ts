import { Router } from 'express';
import {
  registerVendor,
  loginVendor,
  getVendor,
  logoutVendor
} from '../controllers/auth.controller';
import { auth } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { registerVendorSchema, loginVendorSchema } from '../middleware/validate.middleware';

const router = Router();

// @route   POST api/auth/register
// @desc    Register vendor
// @access  Public
router.post('/register', validate(registerVendorSchema), registerVendor);

// @route   POST api/auth/login
// @desc    Login vendor
// @access  Public
router.post('/login', validate(loginVendorSchema), loginVendor);

// @route   GET api/auth/me
// @desc    Get current vendor
// @access  Private
router.post('/logout', logoutVendor);
router.get('/me', auth, getVendor);

export default router;