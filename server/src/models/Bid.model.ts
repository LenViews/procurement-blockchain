import mongoose from 'mongoose';

export interface IBid extends mongoose.Document {
  tenderId: mongoose.Types.ObjectId;
  vendorId: mongoose.Types.ObjectId;
  amount: number;
  description: string;
  status: 'Submitted' | 'Evaluated' | 'Awarded' | 'Rejected';
  blockchainTxId: string;
  documents?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const BidSchema = new mongoose.Schema<IBid>(
  {
    tenderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tender',
      required: true
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['Submitted', 'Evaluated', 'Awarded', 'Rejected'],
      default: 'Submitted'
    },
    blockchainTxId: {
      type: String,
      required: true
    },
    documents: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);

export default mongoose.model<IBid>('Bid', BidSchema);