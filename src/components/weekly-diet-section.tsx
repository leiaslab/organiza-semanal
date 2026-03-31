"use client";

import { SectionHeading } from "@/components/section-heading";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/field";
import { useAppState } from "@/context/app-state-context";
import { MEAL_SLOTS } from "@/lib/constants";
import { getDayDietTotal, getRecipeById, getRecipeCost, getWeeklyDietTotal } from "@/lib/selectors";
import { currency, toTitleCase } from "@/lib/utils";

export function WeeklyDietSection() {
  const { state, assignRecipeToMeal } = useAppState();

  return (
    <section className="panel-grid">
      <SectionHeading
        eyebrow="Plan semanal"
        title="Dieta organizada por dia"
        description="Asigna recetas a desayuno, almuerzo, merienda y cena para calcular el costo de cada dia y el total semanal."
      />

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <div className="grid gap-4">
            {state.weeklyDietPlan.map((dayPlan) => (
              <div key={dayPlan.day} className="rounded-[28px] border border-[var(--border)] bg-white/75 p-4 md:p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold tracking-tight">{toTitleCase(dayPlan.day)}</h3>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      Total del dia: {currency(getDayDietTotal(state, dayPlan))}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {MEAL_SLOTS.map((mealSlot) => {
                    const selectedRecipe = getRecipeById(state, dayPlan.meals[mealSlot.value]);

                    return (
                      <label key={mealSlot.value} className="grid gap-2">
                        <span className="text-sm font-semibold text-[var(--text)]">{mealSlot.label}</span>
                        <Select
                          value={dayPlan.meals[mealSlot.value] ?? ""}
                          onChange={(event) =>
                            assignRecipeToMeal(
                              dayPlan.day,
                              mealSlot.value,
                              event.target.value ? event.target.value : null,
                            )
                          }
                        >
                          <option value="">Sin receta</option>
                          {state.recipes.map((recipe) => (
                            <option key={recipe.id} value={recipe.id}>
                              {recipe.name}
                            </option>
                          ))}
                        </Select>
                        <span className="text-xs text-[var(--muted)]">
                          {selectedRecipe
                            ? `Costo de la comida: ${currency(getRecipeCost(state, selectedRecipe))}`
                            : "Todavia no hay receta asignada"}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeading
            eyebrow="Total"
            title="Resumen de dieta"
            description="Seguimiento rapido del costo semanal segun las recetas asignadas."
          />
          <div className="rounded-[28px] bg-[color:rgba(44,110,96,0.1)] p-5">
            <p className="text-sm text-[var(--muted)]">Total semanal de dieta</p>
            <p className="mt-3 text-4xl font-bold tracking-tight text-[var(--primary-strong)]">
              {currency(getWeeklyDietTotal(state))}
            </p>
          </div>
          <div className="mt-4 grid gap-3">
            {state.weeklyDietPlan.map((dayPlan) => (
              <div
                key={dayPlan.day}
                className="flex items-center justify-between rounded-[22px] border border-[var(--border)] bg-white/75 p-4"
              >
                <span className="font-semibold">{toTitleCase(dayPlan.day)}</span>
                <span className="text-sm font-bold">{currency(getDayDietTotal(state, dayPlan))}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}
