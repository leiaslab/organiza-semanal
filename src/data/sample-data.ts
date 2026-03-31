import { WEEK_DAYS } from "@/lib/constants";
import { AppState } from "@/types";

export const sampleState: AppState = {
  dietProducts: [
    { id: "diet-product-1", name: "Avena", price: 18, unit: "gr" },
    { id: "diet-product-2", name: "Leche", price: 1700, unit: "litro" },
    { id: "diet-product-3", name: "Pan lactal", price: 2200, unit: "paquete" },
    { id: "diet-product-4", name: "Huevos", price: 320, unit: "unidad" },
    { id: "diet-product-5", name: "Pollo", price: 7800, unit: "kg" },
    { id: "diet-product-6", name: "Arroz", price: 7, unit: "gr" },
    { id: "diet-product-7", name: "Yogur", price: 2100, unit: "unidad" },
    { id: "diet-product-8", name: "Banana", price: 450, unit: "unidad" },
  ],
  recipes: [
    {
      id: "recipe-1",
      name: "Desayuno de avena",
      ingredients: [
        { id: "ingredient-1", productId: "diet-product-1", quantity: 80 },
        { id: "ingredient-2", productId: "diet-product-2", quantity: 1 },
        { id: "ingredient-3", productId: "diet-product-8", quantity: 1 },
      ],
    },
    {
      id: "recipe-2",
      name: "Pollo con arroz",
      ingredients: [
        { id: "ingredient-4", productId: "diet-product-5", quantity: 0.4 },
        { id: "ingredient-5", productId: "diet-product-6", quantity: 150 },
      ],
    },
    {
      id: "recipe-3",
      name: "Merienda simple",
      ingredients: [
        { id: "ingredient-6", productId: "diet-product-7", quantity: 1 },
        { id: "ingredient-7", productId: "diet-product-8", quantity: 1 },
      ],
    },
    {
      id: "recipe-4",
      name: "Tostadas con huevo",
      ingredients: [
        { id: "ingredient-8", productId: "diet-product-3", quantity: 0.5 },
        { id: "ingredient-9", productId: "diet-product-4", quantity: 2 },
      ],
    },
  ],
  weeklyDietPlan: WEEK_DAYS.map((day, index) => ({
    day,
    meals: {
      desayuno: index < 5 ? "recipe-1" : "recipe-4",
      almuerzo: index < 6 ? "recipe-2" : null,
      merienda: "recipe-3",
      cena: index % 2 === 0 ? "recipe-4" : null,
    },
  })),
  otherProducts: [
    { id: "other-1", name: "Alimento de Leia", price: 14500, quantity: 1, category: "Mascotas" },
    { id: "other-2", name: "Jabon en polvo", price: 8900, quantity: 1, category: "Limpieza" },
    { id: "other-3", name: "Papel de cocina", price: 2600, quantity: 2, category: "Hogar" },
  ],
};
