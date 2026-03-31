"use client";

import { createContext, startTransition, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { sampleState } from "@/data/sample-data";
import { STORAGE_KEY, WEEK_DAYS } from "@/lib/constants";
import {
  AppState,
  DietProduct,
  MealSlot,
  OtherWeeklyProduct,
  Recipe,
  WeeklyDietDay,
} from "@/types";

interface AppStateContextValue {
  state: AppState;
  hydrated: boolean;
  addDietProduct: (product: Omit<DietProduct, "id">) => void;
  deleteDietProduct: (productId: string) => void;
  addRecipe: (recipe: Omit<Recipe, "id">) => void;
  deleteRecipe: (recipeId: string) => void;
  assignRecipeToMeal: (day: WeeklyDietDay["day"], meal: MealSlot, recipeId: string | null) => void;
  addOtherProduct: (product: Omit<OtherWeeklyProduct, "id">) => void;
  deleteOtherProduct: (productId: string) => void;
}

const AppStateContext = createContext<AppStateContextValue | null>(null);

function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function createEmptyWeeklyPlan() {
  return WEEK_DAYS.map((day) => ({
    day,
    meals: {
      desayuno: null,
      almuerzo: null,
      merienda: null,
      cena: null,
    },
  }));
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(sampleState);
  const hydrated = true;

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return;
      }

      startTransition(() => {
        setState(JSON.parse(stored) as AppState);
      });
    } catch {}
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  const value = useMemo<AppStateContextValue>(
    () => ({
      state,
      hydrated,
      addDietProduct(product) {
        setState((current) => ({
          ...current,
          dietProducts: [{ ...product, id: createId("diet-product") }, ...current.dietProducts],
        }));
      },
      deleteDietProduct(productId) {
        setState((current) => ({
          ...current,
          dietProducts: current.dietProducts.filter((product) => product.id !== productId),
          recipes: current.recipes.map((recipe) => ({
            ...recipe,
            ingredients: recipe.ingredients.filter((ingredient) => ingredient.productId !== productId),
          })),
        }));
      },
      addRecipe(recipe) {
        setState((current) => ({
          ...current,
          recipes: [{ ...recipe, id: createId("recipe") }, ...current.recipes],
        }));
      },
      deleteRecipe(recipeId) {
        setState((current) => ({
          ...current,
          recipes: current.recipes.filter((recipe) => recipe.id !== recipeId),
          weeklyDietPlan: current.weeklyDietPlan.map((dayPlan) => ({
            ...dayPlan,
            meals: {
              desayuno: dayPlan.meals.desayuno === recipeId ? null : dayPlan.meals.desayuno,
              almuerzo: dayPlan.meals.almuerzo === recipeId ? null : dayPlan.meals.almuerzo,
              merienda: dayPlan.meals.merienda === recipeId ? null : dayPlan.meals.merienda,
              cena: dayPlan.meals.cena === recipeId ? null : dayPlan.meals.cena,
            },
          })),
        }));
      },
      assignRecipeToMeal(day, meal, recipeId) {
        setState((current) => ({
          ...current,
          weeklyDietPlan: (current.weeklyDietPlan.length ? current.weeklyDietPlan : createEmptyWeeklyPlan()).map(
            (dayPlan) =>
              dayPlan.day === day
                ? {
                    ...dayPlan,
                    meals: {
                      ...dayPlan.meals,
                      [meal]: recipeId,
                    },
                  }
                : dayPlan,
          ),
        }));
      },
      addOtherProduct(product) {
        setState((current) => ({
          ...current,
          otherProducts: [{ ...product, id: createId("other-product") }, ...current.otherProducts],
        }));
      },
      deleteOtherProduct(productId) {
        setState((current) => ({
          ...current,
          otherProducts: current.otherProducts.filter((product) => product.id !== productId),
        }));
      },
    }),
    [hydrated, state],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState debe usarse dentro de AppStateProvider");
  }
  return context;
}
