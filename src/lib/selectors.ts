import { AppState, Recipe, WeeklyDietDay } from "@/types";

export function getDietProductName(state: AppState, productId: string) {
  return state.dietProducts.find((product) => product.id === productId)?.name ?? "Producto eliminado";
}

export function getRecipeCost(state: AppState, recipe: Recipe) {
  return recipe.ingredients.reduce((sum, ingredient) => {
    const product = state.dietProducts.find((item) => item.id === ingredient.productId);
    if (!product) return sum;
    return sum + product.price * ingredient.quantity;
  }, 0);
}

export function getRecipeById(state: AppState, recipeId: string | null) {
  if (!recipeId) return null;
  return state.recipes.find((recipe) => recipe.id === recipeId) ?? null;
}

export function getDayDietTotal(state: AppState, dayPlan: WeeklyDietDay) {
  return Object.values(dayPlan.meals).reduce((sum, recipeId) => {
    const recipe = getRecipeById(state, recipeId);
    if (!recipe) return sum;
    return sum + getRecipeCost(state, recipe);
  }, 0);
}

export function getWeeklyDietTotal(state: AppState) {
  return state.weeklyDietPlan.reduce((sum, dayPlan) => sum + getDayDietTotal(state, dayPlan), 0);
}

export function getOtherProductsTotal(state: AppState) {
  return state.otherProducts.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function getGrandTotal(state: AppState) {
  return getWeeklyDietTotal(state) + getOtherProductsTotal(state);
}

export function getDietRecipesCount(state: AppState) {
  return state.recipes.length;
}

export function getAssignedMealsCount(state: AppState) {
  return state.weeklyDietPlan.reduce((sum, dayPlan) => {
    return sum + Object.values(dayPlan.meals).filter(Boolean).length;
  }, 0);
}
