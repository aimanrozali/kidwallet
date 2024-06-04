export interface Student {
  studentID: number;
  studentName: string;
  birthDate: string;
  gender: string;
  grade: string;
  className: string;
  allergy: string[];
  wallet: Wallet;
}

export interface Wallet {
  walletID: string;
  walletBalance: number;
  cardID: string;
  currency: string;
  dailySpendingLimit: number;
  student: Student;
  transactions: Transaction[];
  totalSpentToday: number;
  reachLimit: boolean;
}

export interface Transaction {
  walletID: string;
  transactionType: number;
  amount: number;
  transactionTime: Date;
  description: string;
}