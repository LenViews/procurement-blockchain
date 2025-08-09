import mongoose from 'mongoose';

export interface ITender extends mongoose.Document {
  title: string;
  description: string;
  category: 'goods' | 'services';
  budget: number;
  deadline: Date;
  status: 'Open' | 'Closed' | 'Awarded';
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TenderSchema = new mongoose.Schema<ITender>(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ['goods', 'services'],
      required: true
    },
    budget: {
      type: Number,
      required: true
    },
    deadline: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['Open', 'Closed', 'Awarded'],
      default: 'Open'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model<ITender>('Tender', TenderSchema);