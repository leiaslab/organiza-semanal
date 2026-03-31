import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/section-heading";
import {
  getAssignedMealsCount,
  getDayDietTotal,
  getGrandTotal,
  getOtherProductsTotal,
  getWeeklyDietTotal,
} from "@/lib/selectors";
import { currency, toTitleCase } from "@/lib/utils";
import { AppState } from "@/types";

export function Dashboard({ state }: { state: AppState }) {
  const weeklyDietTotal = getWeeklyDietTotal(state);
  const otherProductsTotal = getOtherProductsTotal(state);
  const grandTotal = getGrandTotal(state);

  return (
    <section className="panel-grid">
      <SectionHeading
        eyebrow="Resumen"
        title="Organizacion semanal clara"
        description="Una vista simple para separar lo que vas a gastar en la dieta semanal y lo que corresponde a otros productos."
      />

      <Card className="overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#214f45_0%,#2c6e60_55%,#efe2bf_145%)] text-white">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">Total general</p>
            <h3 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">{currency(grandTotal)}</h3>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
              La app mantiene la dieta separada de los otros productos para que puedas planificar mejor la semana.
            </p>
          </div>

          <div className="grid gap-3">
            <div className="rounded-[28px] border border-white/15 bg-white/12 p-5 backdrop-blur-sm">
              <p className="text-sm text-white/70">Dieta semanal</p>
              <p className="mt-2 text-3xl font-bold">{currency(weeklyDietTotal)}</p>
            </div>
            <div className="rounded-[28px] border border-white/15 bg-white/12 p-5 backdrop-blur-sm">
              <p className="text-sm text-white/70">Otros productos</p>
              <p className="mt-2 text-3xl font-bold">{currency(otherProductsTotal)}</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm text-[var(--muted)]">Recetas asignadas</p>
          <p className="mt-3 text-4xl font-bold tracking-tight">{getAssignedMealsCount(state)}</p>
          <p className="mt-2 text-sm text-[var(--muted)]">Comidas cargadas dentro del plan semanal.</p>
        </Card>
        <Card>
          <p className="text-sm text-[var(--muted)]">Productos de dieta</p>
          <p className="mt-3 text-4xl font-bold tracking-tight">{state.dietProducts.length}</p>
          <p className="mt-2 text-sm text-[var(--muted)]">Base de ingredientes para tus recetas.</p>
        </Card>
        <Card>
          <p className="text-sm text-[var(--muted)]">Otros productos</p>
          <p className="mt-3 text-4xl font-bold tracking-tight">{state.otherProducts.length}</p>
          <p className="mt-2 text-sm text-[var(--muted)]">Compras semanales fuera de la dieta.</p>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <h3 className="text-xl font-bold tracking-tight">Totales de la semana</h3>
          <div className="mt-5 grid gap-3">
            <div className="flex items-center justify-between rounded-[24px] border border-[var(--border)] bg-white/75 p-4">
              <span className="font-semibold">Total de dieta semanal</span>
              <span className="text-lg font-bold">{currency(weeklyDietTotal)}</span>
            </div>
            <div className="flex items-center justify-between rounded-[24px] border border-[var(--border)] bg-white/75 p-4">
              <span className="font-semibold">Total de otros productos</span>
              <span className="text-lg font-bold">{currency(otherProductsTotal)}</span>
            </div>
            <div className="flex items-center justify-between rounded-[24px] bg-[color:rgba(44,110,96,0.1)] p-4">
              <span className="font-semibold">Total general final</span>
              <span className="text-xl font-bold text-[var(--primary-strong)]">{currency(grandTotal)}</span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-xl font-bold tracking-tight">Costo por dia</h3>
          <div className="mt-5 grid gap-3">
            {state.weeklyDietPlan.map((dayPlan) => (
              <div
                key={dayPlan.day}
                className="flex items-center justify-between rounded-[24px] border border-[var(--border)] bg-white/75 p-4"
              >
                <span className="font-semibold">{toTitleCase(dayPlan.day)}</span>
                <span className="text-base font-bold">{currency(getDayDietTotal(state, dayPlan))}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}
