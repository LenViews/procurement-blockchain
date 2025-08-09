import { Router } from 'express';
import authRoutes from './auth.routes';
import bidRoutes from './bid.routes';
import tenderRoutes from './tender.routes';
import vendorRoutes from './vendor.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/bids', bidRoutes);
router.use('/tenders', tenderRoutes);
router.use('/vendors', vendorRoutes);

export default router;