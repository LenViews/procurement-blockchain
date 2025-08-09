import { Request, Response } from 'express';
import Tender from '../models/Tender.model';
import { AuthRequest } from '../types';

export const createTender = async (req: AuthRequest, res: Response) => {
  if (!req.vendor) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  try {
    const { title, description, category, budget, deadline } = req.body;

    const tender = new Tender({
      title,
      description,
      category,
      budget,
      deadline,
      createdBy: req.vendor.id,
      status: 'Open'
    });

    await tender.save();
    res.status(201).json(tender);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error('Unknown error in createTender');
    }
    res.status(500).send('Server error');
  }
};

export const getAllTenders = async (req: Request, res: Response) => {
  try {
    const tenders = await Tender.find({ status: 'Open' })
      .sort('-createdAt')
      .populate('createdBy', 'companyName');
    res.json(tenders);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error('Unknown error in getAllTenders');
    }
    res.status(500).send('Server error');
  }
};

export const getTenderDetails = async (req: Request, res: Response) => {
  try {
    const tender = await Tender.findById(req.params.id)
      .populate('createdBy', 'companyName');

    if (!tender) {
      return res.status(404).json({ message: 'Tender not found' });
    }

    res.json(tender);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error('Unknown error in getTenderDetails');
    }
    res.status(500).send('Server error');
  }
};