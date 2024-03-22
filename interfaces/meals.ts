export interface Meals {
  id: string;
  meal_name: string;
  price: number;
  imgUrl: string;
  calories: number;
  nutrition_facts: Nutritionfacts;
  allergens: string[];
}

interface Nutritionfacts {
  protein: string;
  carbohydrates: string;
  fat: string;
  fiber: string;
}