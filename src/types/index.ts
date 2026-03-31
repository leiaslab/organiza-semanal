export type ProductUnit = "kg" | "gr" | "unidad" | "litro" | "paquete";
export type WeekDay =
  | "lunes"
  | "martes"
  | "miercoles"
  | "jueves"
  | "viernes"
  | "sabado"
  | "domingo";
export type MealSlot = "desayuno" | "almuerzo" | "merienda" | "cena";

export interface DietProduct {
  id: string;
  name: string;
  price: number;
  unit: ProductUnit;
}

export interface RecipeIngredient {
  id: string;
  productId: string;
  quantity: number;
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: RecipeIngredient[];
}

export interface WeeklyDietDay {
  day: WeekDay;
  meals: Record<MealSlot, string | null>;
}

export interface OtherWeeklyProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category?: string;
}

export interface AppState {
  dietProducts: DietProduct[];
  recipes: Recipe[];
  weeklyDietPlan: WeeklyDietDay[];
  otherProducts: OtherWeeklyProduct[];
}
