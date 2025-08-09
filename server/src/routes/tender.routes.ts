import { Router } from 'express';
import {
  createTender,
  getAllTenders,
  getTenderDetails
} from '../controllers/tender.controller';
import { auth } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createTenderSchema } from '../middleware/validate.middleware';

const router = Router();

// @route   POST api/tenders
// @desc    Create a tender
// @access  Private (Admin)
router.post('/', [auth, validate(createTenderSchema)], createTender);

// @route   GET api/tenders
// @desc    Get all tenders
// @access  Public
router.get('/', getAllTenders);

// @route   GET api/tenders/:id
// @desc    Get tender details
// @access  Public
router.get('/:id', getTenderDetails);

export default router;