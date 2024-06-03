// export interface Meals {
//   id: string;
//   meal_name: string;
//   price: number;
//   imgUrl: string;
//   calories: number;
//   nutrition_facts: Nutritionfacts;
//   allergens: string[];
// }

interface Nutritionfacts {
  protein: string;
  carbohydrates: string;
  fat: string;
  fiber: string;
}

export interface Meals {
  mealID: number;
  vendorID: number;
  mealName: string;
  description: string;
  price: number;
  stock: number;
  isMeal: boolean;
  availability: boolean;
  calories: number;
  mealPic: string;
  allergens: string[];
  servingSize: number;
  carbohydrate: number;
  fat: number;
  protein: number;
  sodium: number;
  fiber: number;
  sugar: number;
  caffeine: number;
  vitaminC: number;
  calcium: number;
}