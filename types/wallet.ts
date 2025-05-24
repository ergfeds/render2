export interface WalletState {
  currentUser: User | null;
  users: User[];
  currencies: Currency[];
  transactions: Transaction[];
  pendingTransactions: Transaction[];
  notifications: Notification[];
  supportTickets: SupportTicket[];
  unreadNotificationsCount: number;
  exchangeRate: number;
  authToken: string | null;
  
  // Initialize data from API
  initializeData: () => Promise<{ success: boolean; error?: any }>;
  
  // User actions
  setCurrentUser: (user: User & { token?: string }) => Promise<void>;
  logout: () => void;
  
  // Transaction actions
  sendTransaction: (transactionData: {
    fromAddress: string;
    toAddress: string;
    amount: number;
    currency: string;
    description?: string;
  }) => Promise<Transaction | undefined>;
  
  approveTransaction: (transactionId: string) => Promise<void>;
  rejectTransaction: (transactionId: string, reason: string) => Promise<void>;
  generateWalletAddress: (currency: string) => Promise<string | null>;
  updateExchangeRate: (currencyId: string, rate: number) => Promise<void>;
  
  // Notification actions
  addNotification: (notificationData: {
    userId: string;
    title: string;
    message: string;
    type: Notification['type'];
    transactionId?: string;
  }) => Promise<void>;
  
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  
  // Support ticket actions
  createSupportTicket: (ticketData: {
    subject: string;
    message: string;
  }) => Promise<SupportTicket | undefined>;
  
  respondToSupportTicket: (ticketId: string, message: string, fromAdmin: boolean) => Promise<void>;
  closeSupportTicket: (ticketId: string) => Promise<void>;
  
  // User balance actions
  adjustUserBalance: (userId: string, currency: string, amount: number) => Promise<void>;
  
  // KYC Actions
  submitKyc: (userId: string, kycData: Omit<KYCData, 'submissionDate'>) => Promise<void>;
  approveKyc: (userId: string) => Promise<void>;
  rejectKyc: (userId: string, reason: string) => Promise<void>;
  
  // Profile actions
  updateProfile: (profileData: {
    name?: string;
    email?: string;
    avatar?: string;
  }) => Promise<User | undefined>;
  
  changePassword: (passwordData: {
    currentPassword: string;
    newPassword: string;
  }) => Promise<{ success: boolean } | undefined>;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  walletAddresses: Record<string, string>;
  balances: Record<string, number>;
  kycStatus: 'unverified' | 'pending' | 'verified';
  kycData?: KYCData;
  transactions?: string[]; // Array of transaction IDs
  supportTickets?: string[]; // Array of support ticket IDs
  isAdmin?: boolean;
  avatar?: string;
  token?: string; // JWT token for authentication
}

export interface KYCData {
  fullName: string;
  dateOfBirth: string;
  address: string;
  idType?: 'passport' | 'drivers_license' | 'national_id';
  idNumber: string;
  idFrontImage: string;
  idBackImage: string;
  selfieImage: string;
  submissionDate: number;
  rejectionReason?: string;
}

export interface Transaction {
  id: string;
  fromAddress: string;
  toAddress: string;
  amount: number;
  fee?: number;
  currency: string;
  timestamp: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  hash?: string;
  memo?: string;
  description?: string;
  rejectionReason?: string;
  // Add missing properties
  fromUserId?: string;
  toUserId?: string;
}

export interface Currency {
  id: string;
  name: string;
  symbol: string;
  decimals: number;
  color: string;
  exchangeRate: number; // USD per 1 unit
  logoUrl: string; // URL to the currency logo
}

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  status: 'open' | 'in_progress' | 'closed';
  createdAt?: number;
  timestamp: number;
  messages: SupportMessage[];
}

export interface SupportMessage {
  id: string;
  sender: 'user' | 'admin';
  content: string;
  timestamp: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'transaction' | 'kyc' | 'security' | 'support' | 'system' | 'admin';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  actionLink?: string;
  transactionId?: string;
}