import { MealSlot, ProductUnit, WeekDay } from "@/types";

export const STORAGE_KEY = "organiza-semanal-state";

export const WEEK_DAYS: WeekDay[] = [
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
  "sabado",
  "domingo",
];

export const MEAL_SLOTS: Array<{ value: MealSlot; label: string }> = [
  { value: "desayuno", label: "Desayuno" },
  { value: "almuerzo", label: "Almuerzo" },
  { value: "merienda", label: "Merienda" },
  { value: "cena", label: "Cena" },
];

export const PRODUCT_UNITS: Array<{ value: ProductUnit; label: string }> = [
  { value: "kg", label: "Kg" },
  { value: "gr", label: "Gr" },
  { value: "unidad", label: "Unidad" },
  { value: "litro", label: "Litro" },
  { value: "paquete", label: "Paquete" },
];
