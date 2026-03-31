"use client";

import { useState } from "react";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/field";
import { useAppState } from "@/context/app-state-context";
import { getDietProductName, getRecipeCost } from "@/lib/selectors";
import { currency } from "@/lib/utils";

const createIngredientRow = () => ({
  id: crypto.randomUUID(),
  productId: "",
  quantity: 1,
});

export function RecipesSection() {
  const { state, addRecipe, deleteRecipe } = useAppState();
  const [name, setName] = useState("");
  const [ingredients, setIngredients] = useState([createIngredientRow()]);

  function handleSubmit() {
    const validIngredients = ingredients.filter((ingredient) => ingredient.productId && ingredient.quantity > 0);
    if (!name.trim() || validIngredients.length === 0) return;

    addRecipe({
      name,
      ingredients: validIngredients.map((ingredient) => ({
        id: ingredient.id,
        productId: ingredient.productId,
        quantity: ingredient.quantity,
      })),
    });

    setName("");
    setIngredients([createIngredientRow()]);
  }

  return (
    <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
      <Card>
        <SectionHeading
          eyebrow="Recetas"
          title="Crear receta"
          description="Combina productos de dieta y defini la cantidad necesaria de cada ingrediente."
        />
        {state.dietProducts.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-[var(--border)] bg-white/70 p-5 text-sm text-[var(--muted)]">
            Primero necesitas cargar al menos un producto de dieta.
          </div>
        ) : (
          <div className="grid gap-4">
            <Field label="Nombre de la receta">
              <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Ej: pollo con arroz" />
            </Field>

            <div className="grid gap-3">
              {ingredients.map((ingredient, index) => (
                <div key={ingredient.id} className="rounded-[24px] border border-[var(--border)] bg-white/70 p-4">
                  <p className="mb-3 text-sm font-semibold text-[var(--muted)]">Ingrediente {index + 1}</p>
                  <div className="grid gap-3 sm:grid-cols-[1.2fr_0.8fr]">
                    <Select
                      value={ingredient.productId}
                      onChange={(event) =>
                        setIngredients((current) =>
                          current.map((item) =>
                            item.id === ingredient.id ? { ...item, productId: event.target.value } : item,
                          ),
                        )
                      }
                    >
                      <option value="">Seleccionar producto</option>
                      {state.dietProducts.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                        </option>
                      ))}
                    </Select>
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      value={ingredient.quantity}
                      onChange={(event) =>
                        setIngredients((current) =>
                          current.map((item) =>
                            item.id === ingredient.id
                              ? { ...item, quantity: Number(event.target.value) || 0 }
                              : item,
                          ),
                        )
                      }
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Button variant="ghost" onClick={() => setIngredients((current) => [...current, createIngredientRow()])}>
                Agregar ingrediente
              </Button>
              <Button onClick={handleSubmit}>Guardar receta</Button>
            </div>
          </div>
        )}
      </Card>

      <Card>
        <SectionHeading
          eyebrow="Listado"
          title="Recetas cargadas"
          description="Cada receta calcula su costo en base a los productos y cantidades elegidas."
        />
        <div className="grid gap-3">
          {state.recipes.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-[var(--border)] bg-white/70 p-5 text-sm text-[var(--muted)]">
              Todavia no cargaste recetas.
            </div>
          ) : (
            state.recipes.map((recipe) => (
              <div key={recipe.id} className="rounded-[24px] border border-[var(--border)] bg-white/75 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{recipe.name}</p>
                    <p className="mt-2 text-sm text-[var(--muted)]">
                      {recipe.ingredients
                        .map((ingredient) => {
                          const product = state.dietProducts.find((item) => item.id === ingredient.productId);
                          const unit = product?.unit ? ` ${product.unit}` : "";
                          return `${getDietProductName(state, ingredient.productId)} (${ingredient.quantity}${unit})`;
                        })
                        .join(" · ")}
                    </p>
                    <p className="mt-3 text-sm font-semibold text-[var(--primary-strong)]">
                      Costo estimado: {currency(getRecipeCost(state, recipe))}
                    </p>
                  </div>
                  <Button variant="ghost" onClick={() => deleteRecipe(recipe.id)}>
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
