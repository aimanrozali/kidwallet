export interface Drinks {
  id: string;
  drink_name: string;
  price: number;
  imgUrl: string;
  calories: number;
  nutrition_facts: Nutritionfacts;
  allergens: string[];
}

interface Nutritionfacts {
  sugar: string;
  vitamin_c?: string;
  calcium?: string;
  caffeine?: string;
  antioxidants?: string;
}