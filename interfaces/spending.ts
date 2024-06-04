export interface CumulativeSpending {
  date: string;
  totalSpending: number;
}

interface ApiResponse {
  data: CumulativeSpending[];
  success: boolean;
  message: string;
}