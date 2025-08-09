import { VendorDocument } from '../models/Vendor.model';
import { Request } from 'express';

export interface AuthRequest extends Request {
  vendor?: VendorDocument;
}

export interface ApiError extends Error {
  statusCode: number;
  errors?: Record<string, string[]>;
}

export interface BidData {
  tenderId: string;
  vendorId: string;
  amount: number;
  description: string;
}

export interface BlockchainResponse {
  success: boolean;
  transactionId: string;
  timestamp: string;
}

export interface User {
  id: string;
  email: string;
  kraPin: string;
  companyName: string;
  phoneNumber: string;
  category: 'goods' | 'services';
}

export interface Bid {
  id: string;
  tenderId: string;
  vendorId: string;
  amount: number;
  description: string;
  status: 'Submitted' | 'Evaluated' | 'Awarded' | 'Rejected';
  submissionDate: string;
}

export interface Tender {
  id: string;
  title: string;
  description: string;
  category: 'goods' | 'services';
  budget: number;
  deadline: string;
  status: 'Open' | 'Closed' | 'Awarded';
}