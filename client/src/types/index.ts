export interface User {
  id: string;
  kraPin: string;
  companyName: string;
  email: string;
  phoneNumber: string;
  category: 'goods' | 'services';
  blacklisted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Bid {
  id: string;
  tenderId: string;
  vendorId: string;
  amount: number;
  description: string;
  status: 'Submitted' | 'Evaluated' | 'Awarded' | 'Rejected';
  submissionDate: string;
  documents: string[];
}

export interface Tender {
  id: string;
  title: string;
  description: string;
  category: 'goods' | 'services';
  budget: number;
  deadline: string;
  status: 'Open' | 'Closed' | 'Awarded';
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}