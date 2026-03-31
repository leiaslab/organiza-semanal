"use client";

import { useState } from "react";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/field";
import { useAppState } from "@/context/app-state-context";
import { getOtherProductsTotal } from "@/lib/selectors";
import { currency } from "@/lib/utils";

export function OtherProductsSection() {
  const { state, addOtherProduct, deleteOtherProduct } = useAppState();
  const [form, setForm] = useState({
    name: "",
    price: 0,
    quantity: 1,
    category: "",
  });

  function handleSubmit() {
    if (!form.name.trim() || form.price <= 0 || form.quantity <= 0) return;
    addOtherProduct(form);
    setForm({
      name: "",
      price: 0,
      quantity: 1,
      category: "",
    });
  }

  return (
    <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
      <Card>
        <SectionHeading
          eyebrow="Otros productos"
          title="Compras fuera de la dieta"
          description="Registra productos semanales aparte de la dieta, como limpieza, hogar o mascotas."
        />
        <div className="grid gap-4">
          <Field label="Nombre">
            <Input
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              placeholder="Ej: alimento de Leia"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Precio">
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
            <Field label="Cantidad">
              <Input
                type="number"
                min={0}
                step="0.01"
                value={form.quantity}
                onChange={(event) =>
                  setForm((current) => ({ ...current, quantity: Number(event.target.value) || 0 }))
                }
              />
            </Field>
          </div>
          <Field label="Categoria opcional">
            <Input
              value={form.category}
              onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
              placeholder="Ej: limpieza"
            />
          </Field>
          <Button onClick={handleSubmit}>Guardar producto</Button>
        </div>
      </Card>

      <Card>
        <SectionHeading
          eyebrow="Separado"
          title="Total de otros productos"
          description="Esta lista suma por separado para no mezclar gastos semanales con la dieta."
        />
        <div className="rounded-[28px] bg-[color:rgba(213,141,106,0.12)] p-5">
          <p className="text-sm text-[var(--muted)]">Total semanal de otros productos</p>
          <p className="mt-3 text-4xl font-bold tracking-tight">{currency(getOtherProductsTotal(state))}</p>
        </div>

        <div className="mt-4 grid gap-3">
          {state.otherProducts.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-[var(--border)] bg-white/70 p-5 text-sm text-[var(--muted)]">
              Todavia no cargaste otros productos semanales.
            </div>
          ) : (
            state.otherProducts.map((product) => (
              <div
                key={product.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-[var(--border)] bg-white/75 p-4"
              >
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {product.category || "Sin categoria"} · {product.quantity} x {currency(product.price)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold">{currency(product.price * product.quantity)}</span>
                  <Button variant="ghost" onClick={() => deleteOtherProduct(product.id)}>
                    Eliminar
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </section>
  );
}
