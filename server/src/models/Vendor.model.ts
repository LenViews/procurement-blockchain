import mongoose, { Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';

export interface VendorDocument extends Document {
  email: string;
  password: string;
  kraPin: string;
  companyName: string;
  phoneNumber: string;
  category: 'goods' | 'services';
  blacklisted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VendorSchema = new mongoose.Schema<VendorDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    kraPin: {
      type: String,
      required: true,
      unique: true,
      uppercase: true
    },
    companyName: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ['goods', 'services'],
      required: true
    },
    blacklisted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// Hash password before saving
VendorSchema.pre<VendorDocument>('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err as Error);
  }
});

const Vendor: Model<VendorDocument> = mongoose.model<VendorDocument>('Vendor', VendorSchema);
export default Vendor;