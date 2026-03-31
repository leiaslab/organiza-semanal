"use client";

import { useState } from "react";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/field";
import { useAppState } from "@/context/app-state-context";
import { PRODUCT_UNITS } from "@/lib/constants";
import { currency, toTitleCase } from "@/lib/utils";
import { ProductUnit } from "@/types";

export function DietProductsSection() {
  const { state, addDietProduct, deleteDietProduct } = useAppState();
  const [form, setForm] = useState({
    name: "",
    price: 0,
    unit: "unidad" as ProductUnit,
  });

  function handleSubmit() {
    if (!form.name.trim() || form.price <= 0) return;
    addDietProduct(form);
    setForm({ name: "", price: 0, unit: "unidad" });
  }

  return (
    <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
      <Card>
        <SectionHeading
          eyebrow="Dieta"
          title="Productos de dieta"
          description="Crea la base de ingredientes que usaras luego dentro de las recetas."
        />
        <div className="grid gap-4">
          <Field label="Nombre del producto">
            <Input
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              placeholder="Ej: pechuga de pollo"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Precio por unidad">
              <Input
                type="number"
                min={0}
                step="0.01"
                value={form.price}
                onChange={(event) =>
                  setForm((current) => ({ ...current, price: Number(event.target.value) || 0 }))
                }
              />
            </Field>
            <Field label="Tipo de unidad">
              <Select
                value={form.unit}
                onChange={(event) =>
                  setForm((current) => ({ ...current, unit: event.target.value as ProductUnit }))
                }
              >
                {PRODUCT_UNITS.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <Button onClick={handleSubmit}>Guardar producto</Button>
        </div>
      </Card>

      <Card>
        <SectionHeading
          eyebrow="Base"
          title="Ingredientes disponibles"
          description="Cada producto queda listo para ser usado dentro de una o varias recetas."
        />
        <div className="grid gap-3">
          {state.dietProducts.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-[var(--border)] bg-white/70 p-5 text-sm text-[var(--muted)]">
              Todavia no cargaste productos de dieta.
            </div>
          ) : (
            state.dietProducts.map((product) => (
              <div
                key={product.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-[var(--border)] bg-white/75 p-4"
              >
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {currency(product.price)} por {toTitleCase(product.unit)}
                  </p>
                </div>
                <Button variant="ghost" onClick={() => deleteDietProduct(product.id)}>
                  Eliminar
                </Button>
              </div>
            ))
          )}
        </div>
      </Card>
    </section>
  );
}
