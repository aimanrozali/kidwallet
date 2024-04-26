import { Meals } from "./meals";

export interface Orders {
  meal: Meals,
  orderDate: Date,
  quantity: number,
  status: number,
}

/* Status:
         * 0 - Not Collected
         * 1 - Collected
         * 2 - Cancelled
         */
