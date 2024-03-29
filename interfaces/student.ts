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
  currency: string;
  dailySpendingLimit: number;
  studentID: number;
}