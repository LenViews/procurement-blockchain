import { Response } from 'express';
import Bid from '../models/Bid.model';
import Tender from '../models/Tender.model';
import { submitBidToBlockchain } from '../services/blockchain.services';
import { AuthRequest } from '../types';

export const submitBid = async (req: AuthRequest, res: Response) => {
  if (!req.vendor) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  try {
    const { tenderId, amount, description } = req.body;
    const vendorId = req.vendor.id;

    // Check if tender exists
    const tender = await Tender.findById(tenderId);
    if (!tender) {
      return res.status(404).json({ message: 'Tender not found' });
    }

    // Check if tender is still open
    if (tender.status !== 'Open') {
      return res.status(400).json({ message: 'Tender is no longer accepting bids' });
    }

    // Check if vendor has already bid
    const existingBid = await Bid.findOne({ tenderId, vendorId });
    if (existingBid) {
      return res.status(400).json({ message: 'You have already submitted a bid for this tender' });
    }

    // Submit to blockchain
    const blockchainResponse = await submitBidToBlockchain({
      tenderId,
      vendorId,
      amount,
      description
    });

    // Create bid in database
    const bid = new Bid({
      tenderId,
      vendorId,
      amount,
      description,
      status: 'Submitted',
      blockchainTxId: blockchainResponse.transactionId
    });

    await bid.save();
    res.status(201).json(bid);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error('Unknown error in submitBid');
    }
    res.status(500).send('Server error');
  }
};

export const getVendorBids = async (req: AuthRequest, res: Response) => {
  if (!req.vendor) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  try {
    const bids = await Bid.find({ vendorId: req.vendor.id })
      .populate('tenderId', 'title description status deadline')
      .sort('-createdAt');
    res.json(bids);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error('Unknown error in getVendorBids');
    }
    res.status(500).send('Server error');
  }
};

export const getBidDetails = async (req: AuthRequest, res: Response) => {
  if (!req.vendor) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  try {
    const bid = await Bid.findOne({
      _id: req.params.id,
      vendorId: req.vendor.id
    }).populate('tenderId', 'title description status deadline');

    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }

    res.json(bid);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error('Unknown error in getBidDetails');
    }
    res.status(500).send('Server error');
  }
};