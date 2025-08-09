import { Router } from 'express';
import {
  submitBid,
  getVendorBids,
  getBidDetails
} from '../controllers/bid.controller';
import { auth } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { submitBidSchema } from '../middleware/validate.middleware';

const router = Router();

// @route   POST api/bids
// @desc    Submit a bid
// @access  Private
router.post('/', [auth, validate(submitBidSchema)], submitBid);

// @route   GET api/bids
// @desc    Get all bids by vendor
// @access  Private
router.get('/', auth, getVendorBids);

// @route   GET api/bids/:id
// @desc    Get bid details
// @access  Private
router.get('/:id', auth, getBidDetails);

export default router;