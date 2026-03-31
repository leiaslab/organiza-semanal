"use client";

import Image from "next/image";
import { startTransition, useEffect, useState } from "react";
import { currency } from "@/lib/utils";

type CategoryKey =
  | "recetas"
  | "alimentos"
  | "bebidas"
  | "limpieza"
  | "cuidado-personal"
  | "total-gastos";
type ThemeMode = "light" | "dark";
type MealKey = "desayuno" | "almuerzo" | "merienda" | "cena";
type FoodItem = {
  id: string;
  name: string;
  pricePerKilo: number;
  kilos: number;
};
type SpendingCategoryKey = "alimentos" | "bebidas" | "limpieza" | "cuidado-personal";
type SpendingItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

const THEME_STORAGE_KEY = "organiza-home-theme";
const FOOD_STORAGE_KEY = "organiza-home-foods";
const SPENDING_STORAGE_KEY = "organiza-home-spending";

function readStorageValue(key: string) {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorageValue(key: string, value: string) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(key, value);
  } catch {}
}

const categories: Array<{
  key: CategoryKey;
  label: string;
  description: string;
}> = [
  {
    key: "recetas",
    label: "Recetas",
    description: "Tus preparaciones semanales en un solo lugar.",
  },
  {
    key: "alimentos",
    label: "Alimentos",
    description: "Control simple de compras y consumo de comida.",
  },
  {
    key: "bebidas",
    label: "Bebidas",
    description: "Organizá lo que necesitás tomar durante la semana.",
  },
  {
    key: "limpieza",
    label: "Limpieza",
    description: "Productos del hogar ordenados y visibles.",
  },
  {
    key: "cuidado-personal",
    label: "Cuidado personal",
    description: "Lo esencial para tu rutina, sin mezclar todo.",
  },
  {
    key: "total-gastos",
    label: "Total gastos",
    description: "Un resumen simple de los gastos principales de la semana.",
  },
];

const weekDays = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"] as const;
const DIET_PRELOAD_VERSION = "v2";

const defaultWeeklyDiet: Record<(typeof weekDays)[number], Record<MealKey, string[]>> = {
  Lunes: {
    desayuno: ["2 huevos", "1 cafe"],
    almuerzo: ["200 gr de pollo", "150 gr de brocoli"],
    merienda: ["1 banana"],
    cena: ["200 gr de pollo", "250 gr de calabaza"],
  },
  Martes: {
    desayuno: ["2 huevos", "1 cafe"],
    almuerzo: ["200 gr de pollo", "150 gr de brocoli"],
    merienda: ["1 banana"],
    cena: ["200 gr de pollo", "250 gr de calabaza"],
  },
  Miercoles: {
    desayuno: ["2 huevos", "1 cafe"],
    almuerzo: ["200 gr de pollo", "150 gr de brocoli"],
    merienda: ["1 banana"],
    cena: ["200 gr de pollo", "250 gr de calabaza"],
  },
  Jueves: {
    desayuno: ["2 huevos", "1 cafe"],
    almuerzo: ["200 gr de pollo", "150 gr de brocoli"],
    merienda: ["1 banana"],
    cena: ["200 gr de pollo", "250 gr de calabaza"],
  },
  Viernes: {
    desayuno: ["2 huevos", "1 cafe"],
    almuerzo: ["200 gr de pollo", "150 gr de brocoli"],
    merienda: ["1 banana"],
    cena: ["200 gr de pollo", "250 gr de calabaza"],
  },
  Sabado: {
    desayuno: ["2 huevos", "1 cafe"],
    almuerzo: ["200 gr de pollo", "150 gr de brocoli"],
    merienda: ["1 banana"],
    cena: ["200 gr de pollo", "250 gr de calabaza"],
  },
  Domingo: {
    desayuno: ["2 huevos", "1 cafe"],
    almuerzo: ["200 gr de pollo", "150 gr de brocoli"],
    merienda: ["1 banana"],
    cena: ["200 gr de pollo", "250 gr de calabaza"],
  },
};

const ingredientColorClasses = [
  "ingredient-chip-rose",
  "ingredient-chip-amber",
  "ingredient-chip-mint",
  "ingredient-chip-sky",
  "ingredient-chip-lilac",
];

const dayColorStyles = [
  { backgroundColor: "#ffe4ea", color: "#97385a", borderColor: "#fecdd3" },
  { backgroundColor: "#fff1d6", color: "#94651b", borderColor: "#fde2a7" },
  { backgroundColor: "#e3f8ee", color: "#21664b", borderColor: "#bdebd4" },
  { backgroundColor: "#e2efff", color: "#315d8c", borderColor: "#bfdbfe" },
  { backgroundColor: "#efe5ff", color: "#6d46a7", borderColor: "#d8b4fe" },
  { backgroundColor: "#ffe3dc", color: "#a34a38", borderColor: "#fdba74" },
  { backgroundColor: "#ffe3f1", color: "#a23a72", borderColor: "#f9a8d4" },
];

export function AppShell() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("recetas");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [previousCategory, setPreviousCategory] = useState<CategoryKey | null>(null);
  const [activeDay, setActiveDay] = useState<((typeof weekDays)[number] | null)>(null);
  const [editingMeal, setEditingMeal] = useState<MealKey | null>(null);
  const [mealDraft, setMealDraft] = useState("");
  const [weeklyDiet, setWeeklyDiet] = useState({
    version: DIET_PRELOAD_VERSION,
    days: defaultWeeklyDiet,
  });
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [spendingItems, setSpendingItems] = useState<Record<SpendingCategoryKey, SpendingItem[]>>({
    alimentos: [],
    bebidas: [],
    limpieza: [],
    "cuidado-personal": [],
  });
  const [foodForm, setFoodForm] = useState({
    name: "",
    pricePerKilo: "",
    kilos: "",
  });
  const [spendingForms, setSpendingForms] = useState<Record<SpendingCategoryKey, { name: string; price: string; quantity: string }>>({
    alimentos: { name: "", price: "", quantity: "" },
    bebidas: { name: "", price: "", quantity: "" },
    limpieza: { name: "", price: "", quantity: "" },
    "cuidado-personal": { name: "", price: "", quantity: "" },
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const storedTheme = readStorageValue(THEME_STORAGE_KEY);
    const storedFoodItems = readStorageValue(FOOD_STORAGE_KEY);
    const storedSpendingItems = readStorageValue(SPENDING_STORAGE_KEY);

    startTransition(() => {
      if (storedTheme === "dark") {
        setTheme("dark");
      }

      if (storedFoodItems) {
        try {
          setFoodItems(JSON.parse(storedFoodItems) as FoodItem[]);
        } catch {}
      }

      if (storedSpendingItems) {
        try {
          setSpendingItems(JSON.parse(storedSpendingItems) as Record<SpendingCategoryKey, SpendingItem[]>);
        } catch {}
      }
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    navigator.serviceWorker.register("/sw.js").catch(() => {
      // If registration fails, the app still works online.
    });
  }, []);

  useEffect(() => {
    writeStorageValue(FOOD_STORAGE_KEY, JSON.stringify(foodItems));
  }, [foodItems]);

  useEffect(() => {
    writeStorageValue(SPENDING_STORAGE_KEY, JSON.stringify(spendingItems));
  }, [spendingItems]);

  function toggleTheme() {
    const nextTheme: ThemeMode = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    writeStorageValue(THEME_STORAGE_KEY, nextTheme);
  }

  const currentCategory = categories.find((category) => category.key === activeCategory) ?? categories[0];
  const visibleWeeklyDiet =
    weeklyDiet.version === DIET_PRELOAD_VERSION ? weeklyDiet.days : defaultWeeklyDiet;
  const alimentosTotal = foodItems.reduce(
    (sum, item) => sum + item.pricePerKilo * item.kilos,
    0,
  );
  const bebidasTotal = spendingItems.bebidas.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const limpiezaTotal = spendingItems.limpieza.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cuidadoPersonalTotal = spendingItems["cuidado-personal"].reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const totalGastosGeneral = alimentosTotal + bebidasTotal + limpiezaTotal + cuidadoPersonalTotal;

  function handleAddFoodItem() {
    const pricePerKilo = Number(foodForm.pricePerKilo);
    const kilos = Number(foodForm.kilos);

    if (!foodForm.name.trim() || pricePerKilo <= 0 || kilos <= 0) {
      return;
    }

    setFoodItems((current) => [
      {
        id: crypto.randomUUID(),
        name: foodForm.name.trim(),
        pricePerKilo,
        kilos,
      },
      ...current,
    ]);
    setFoodForm({
      name: "",
      pricePerKilo: "",
      kilos: "",
    });
  }

  function handleDeleteFoodItem(itemId: string) {
    setFoodItems((current) => current.filter((item) => item.id !== itemId));
  }

  function handleAddSpendingItem(category: SpendingCategoryKey) {
    const form = spendingForms[category];
    const price = Number(form.price);
    const quantity = Number(form.quantity);

    if (!form.name.trim() || price <= 0 || quantity <= 0) {
      return;
    }

    setSpendingItems((current) => ({
      ...current,
      [category]: [
        {
          id: crypto.randomUUID(),
          name: form.name.trim(),
          price,
          quantity,
        },
        ...current[category],
      ],
    }));

    setSpendingForms((current) => ({
      ...current,
      [category]: { name: "", price: "", quantity: "" },
    }));
  }

  function handleDeleteSpendingItem(category: SpendingCategoryKey, itemId: string) {
    setSpendingItems((current) => ({
      ...current,
      [category]: current[category].filter((item) => item.id !== itemId),
    }));
  }

  function handleCategoryChange(category: CategoryKey) {
    handleCloseMealEditor();
    if (category !== activeCategory) {
      setPreviousCategory(activeCategory);
    }
    setActiveCategory(category);
    setIsMobileMenuOpen(false);
    setActiveDay(null);
    setEditingMeal(null);
  }

  function handleGoBack() {
    if (activeDay) {
      handleCloseMealEditor();
      setActiveDay(null);
      return;
    }

    if (previousCategory) {
      const target = previousCategory;
      setPreviousCategory(null);
      setActiveCategory(target);
      return;
    }

    setActiveCategory("recetas");
  }

  function parseMealDraft(value: string) {
    return value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function handleStartMealEditor(day: (typeof weekDays)[number], mealKey: MealKey) {
    if (activeDay && editingMeal) {
      const nextItems = parseMealDraft(mealDraft);

      setWeeklyDiet((current) => ({
        version: DIET_PRELOAD_VERSION,
        days: {
          ...(current.version === DIET_PRELOAD_VERSION ? current.days : defaultWeeklyDiet),
          [activeDay]: {
            ...(current.version === DIET_PRELOAD_VERSION ? current.days : defaultWeeklyDiet)[activeDay],
            [editingMeal]: nextItems,
          },
        },
      }));
    }

    setEditingMeal(mealKey);
    setMealDraft(visibleWeeklyDiet[day][mealKey].join("\n"));
  }

  function handleCloseMealEditor() {
    if (activeDay && editingMeal) {
      const nextItems = parseMealDraft(mealDraft);

      setWeeklyDiet((current) => ({
        version: DIET_PRELOAD_VERSION,
        days: {
          ...(current.version === DIET_PRELOAD_VERSION ? current.days : defaultWeeklyDiet),
          [activeDay]: {
            ...(current.version === DIET_PRELOAD_VERSION ? current.days : defaultWeeklyDiet)[activeDay],
            [editingMeal]: nextItems,
          },
        },
      }));
    }

    setEditingMeal(null);
    setMealDraft("");
  }

  function renderSpendingCategory(category: SpendingCategoryKey, title: string) {
    const items = spendingItems[category];
    const form = spendingForms[category];
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
      <div className="placeholder-grid">
        <article className="placeholder-card">
          <p className="placeholder-label">Agregar {title.toLowerCase()}</p>
          <div className="mt-4 grid gap-3">
            <input
              value={form.name}
              onChange={(event) =>
                setSpendingForms((current) => ({
                  ...current,
                  [category]: { ...current[category], name: event.target.value },
                }))
              }
              placeholder="Nombre del producto"
              className="w-full rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-base text-[var(--text)] outline-none"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(event) =>
                  setSpendingForms((current) => ({
                    ...current,
                    [category]: { ...current[category], price: event.target.value },
                  }))
                }
                placeholder="Precio"
                className="w-full rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-base text-[var(--text)] outline-none"
              />
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.quantity}
                onChange={(event) =>
                  setSpendingForms((current) => ({
                    ...current,
                    [category]: { ...current[category], quantity: event.target.value },
                  }))
                }
                placeholder="Cantidad"
                className="w-full rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-base text-[var(--text)] outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => handleAddSpendingItem(category)}
              className="rounded-full bg-[var(--primary)] px-5 py-3 text-base font-semibold text-white shadow-md transition hover:opacity-95"
            >
              Agregar {title.toLowerCase()}
            </button>
          </div>
        </article>

        <article className="placeholder-card">
          <p className="placeholder-label">Lista de {title.toLowerCase()}</p>
          <div className="mt-4 grid gap-3">
            {items.length === 0 ? (
              <p className="placeholder-text">Todavia no cargaste {title.toLowerCase()}.</p>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-[22px] border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[var(--text)]">{item.name}</p>
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        {currency(item.price)} x {item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-lg font-bold text-[var(--text)]">
                        {currency(item.price * item.quantity)}
                      </p>
                      <button
                        type="button"
                        className="item-delete-button"
                        aria-label={`Borrar ${item.name}`}
                        onClick={() => handleDeleteSpendingItem(category, item.id)}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </article>

        <article className="placeholder-card">
          <p className="placeholder-label">Total {title.toLowerCase()}</p>
          <p className="placeholder-text">
            <strong>{currency(total)}</strong>
          </p>
        </article>
      </div>
    );
  }

  function renderContent() {
    if (activeCategory === "recetas") {
      if (!activeDay) {
        return (
          <div className="recipe-days-layout recipe-view">
            <div className="recipe-days-list">
              {weekDays.map((day, index) => (
                <button
                  key={day}
                  type="button"
                  className="day-pill"
                  style={dayColorStyles[index % dayColorStyles.length]}
                  onClick={() => {
                    handleCloseMealEditor();
                    setActiveDay(day);
                  }}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        );
      }

      const dayMeals = visibleWeeklyDiet[activeDay];

      return (
        <div className="recipe-detail-view recipe-view">
          <div className="recipe-detail-header">
            <button
              type="button"
              className="back-button"
              onClick={() => {
                handleCloseMealEditor();
                setActiveDay(null);
              }}
            >
              ← Volver
            </button>
            <div className="text-center">
              <p className="placeholder-label">Dia seleccionado</p>
              <h3 className="recipe-day-title">{activeDay}</h3>
            </div>
          </div>

          <div className="recipe-meals-grid">
            {([
              ["desayuno", "Desayuno"],
              ["almuerzo", "Almuerzo"],
              ["merienda", "Merienda"],
              ["cena", "Cena"],
            ] as Array<[MealKey, string]>).map(([mealKey, mealLabel]) => (
              <article key={mealKey} className="placeholder-card recipe-placeholder">
                <div className="meal-card-header">
                  <p className="placeholder-label">{mealLabel}</p>
                  <button
                    type="button"
                    className="meal-edit-button"
                    onClick={() =>
                      editingMeal === mealKey
                        ? handleCloseMealEditor()
                        : handleStartMealEditor(activeDay, mealKey)
                    }
                  >
                    {editingMeal === mealKey ? "Guardar" : "Editar"}
                  </button>
                </div>
                <div className="ingredient-chip-list">
                  {dayMeals[mealKey].map((item, index) => (
                    <span
                      key={`${mealKey}-${item}-${index}`}
                      className={`ingredient-chip ${ingredientColorClasses[index % ingredientColorClasses.length]}`}
                    >
                      {item}
                    </span>
                  ))}
                </div>
                {editingMeal === mealKey ? (
                  <textarea
                    value={mealDraft}
                    onChange={(event) => setMealDraft(event.target.value)}
                    className="recipe-editor"
                  />
                ) : null}
              </article>
            ))}
          </div>
        </div>
      );
    }

    if (activeCategory === "alimentos") {
      return (
        <div className="placeholder-grid">
          <article className="placeholder-card">
            <p className="placeholder-label">Agregar alimentos</p>
            <div className="mt-4 grid gap-3">
              <input
                value={foodForm.name}
                onChange={(event) => setFoodForm((current) => ({ ...current, name: event.target.value }))}
                placeholder="Nombre del producto"
                className="w-full rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-base text-[var(--text)] outline-none"
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={foodForm.pricePerKilo}
                  onChange={(event) =>
                    setFoodForm((current) => ({ ...current, pricePerKilo: event.target.value }))
                  }
                  placeholder="Precio por kilo"
                  className="w-full rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-base text-[var(--text)] outline-none"
                />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={foodForm.kilos}
                  onChange={(event) => setFoodForm((current) => ({ ...current, kilos: event.target.value }))}
                  placeholder="Cantidad en kilos"
                  className="w-full rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-base text-[var(--text)] outline-none"
                />
              </div>
              <button
                type="button"
                onClick={handleAddFoodItem}
                className="rounded-full bg-[var(--primary)] px-5 py-3 text-base font-semibold text-white shadow-md transition hover:opacity-95"
              >
                Agregar alimento
              </button>
            </div>
          </article>

          <article className="placeholder-card">
            <p className="placeholder-label">Lista de alimentos</p>
            <div className="mt-4 grid gap-3">
              {foodItems.length === 0 ? (
                <p className="placeholder-text">Todavia no cargaste alimentos.</p>
              ) : (
                foodItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[22px] border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-[var(--text)]">{item.name}</p>
                        <p className="mt-1 text-sm text-[var(--muted)]">
                          {currency(item.pricePerKilo)} por kilo · {item.kilos} kg
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="text-lg font-bold text-[var(--text)]">
                          {currency(item.pricePerKilo * item.kilos)}
                        </p>
                        <button
                          type="button"
                          className="item-delete-button"
                          aria-label={`Borrar ${item.name}`}
                          onClick={() => handleDeleteFoodItem(item.id)}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </article>

          <article className="placeholder-card">
            <p className="placeholder-label">Total alimentos</p>
            <p className="placeholder-text">
              <strong>{currency(alimentosTotal)}</strong>
            </p>
          </article>
        </div>
      );
    }

    if (activeCategory === "bebidas") {
      return renderSpendingCategory("bebidas", "Bebidas");
    }

    if (activeCategory === "limpieza") {
      return renderSpendingCategory("limpieza", "Limpieza");
    }

    if (activeCategory === "cuidado-personal") {
      return renderSpendingCategory("cuidado-personal", "Cuidado personal");
    }

    if (activeCategory === "total-gastos") {
      return (
        <div className="placeholder-grid">
          <article className="placeholder-card">
            <p className="placeholder-label">Resumen de gastos</p>
            <p className="placeholder-text">Alimentos: {currency(alimentosTotal)}</p>
            <p className="placeholder-text">Bebidas: {currency(bebidasTotal)}</p>
            <p className="placeholder-text">Limpieza: {currency(limpiezaTotal)}</p>
            <p className="placeholder-text">Cuidado personal: {currency(cuidadoPersonalTotal)}</p>
            <p className="placeholder-text">
              <strong>Total general: {currency(totalGastosGeneral)}</strong>
            </p>
          </article>
        </div>
      );
    }

    return (
      <div className="placeholder-grid">
        <article className="placeholder-card">
          <p className="placeholder-label">Vista inicial</p>
          <p className="placeholder-text">
            Aca vamos a mostrar el contenido principal de <strong>{currentCategory.label}</strong>.
          </p>
        </article>

        <article className="placeholder-card">
          <p className="placeholder-label">Proximo paso</p>
          <p className="placeholder-text">
            Por ahora esta seccion funciona como placeholder visual para que la app se vea limpia y ordenada.
          </p>
        </article>
      </div>
    );
  }

  return (
    <main className="home-shell">
      <div className="home-frame">
        <section className="hero-block">
          <div className="hero-logo-wrap">
            <Image
              src="/foto.png.jpeg"
              alt="Logo de la app"
              width={120}
              height={120}
              priority
              className="hero-logo"
            />
          </div>

          <div className="hero-title-wrap">
            <h1 className="hero-title">Organizacion comidas y gastos semanal</h1>
          </div>
        </section>

        <section className="md:hidden">
          <div className="flex items-center justify-between gap-3 rounded-[28px] border border-[var(--border)] bg-[var(--surface)] px-4 py-3 shadow-[0_12px_30px_rgba(31,37,44,0.08)] backdrop-blur-xl">
            <div className="min-w-0">
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
                Categoria activa
              </p>
              <p className="truncate text-base font-semibold text-[var(--text)]">{currentCategory.label}</p>
            </div>
            <button
              type="button"
              aria-label={isMobileMenuOpen ? "Cerrar menu" : "Abrir menu"}
              aria-expanded={isMobileMenuOpen}
              className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-strong)] text-[var(--text)] shadow-md transition active:scale-[0.98]"
              onClick={() => setIsMobileMenuOpen((current) => !current)}
            >
              <span className="text-xl leading-none">{isMobileMenuOpen ? "×" : "☰"}</span>
            </button>
          </div>

          {isMobileMenuOpen ? (
            <div className="mt-3 rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-3 shadow-[0_18px_40px_rgba(31,37,44,0.1)] backdrop-blur-xl">
              <div className="grid gap-2">
                {categories.map((category) => {
                  const isActive = category.key === activeCategory;

                  return (
                    <button
                      key={category.key}
                      type="button"
                      className={`flex w-full items-center justify-between rounded-[22px] border px-4 py-3 text-left text-base font-semibold transition active:scale-[0.99] ${
                        category.key === "total-gastos"
                          ? isActive
                            ? "border-red-700 bg-red-700 text-white"
                            : "border-red-500 bg-red-500 text-white"
                          : isActive
                            ? "border-transparent bg-[var(--primary)] text-white"
                            : "border-[var(--border)] bg-[var(--surface-strong)] text-[var(--text)]"
                      }`}
                      onClick={() => handleCategoryChange(category.key)}
                    >
                      <span>{category.label}</span>
                      <span className={`text-sm ${isActive ? "opacity-100" : "opacity-40"}`}>
                        {isActive ? "Activa" : "Abrir"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </section>

        <section className="category-menu hidden md:flex" aria-label="Categorias principales">
          {categories.map((category) => {
            const isActive = category.key === activeCategory;

            return (
              <button
                key={category.key}
                type="button"
                className={`category-chip ${
                  category.key === "total-gastos"
                    ? isActive
                      ? "!border-red-700 !bg-red-700 !text-white hover:!bg-red-800"
                      : "!border-red-500 !bg-red-500 !text-white hover:!border-red-600 hover:!bg-red-600"
                    : isActive
                      ? "category-chip-active"
                      : ""
                }`}
                onClick={() => handleCategoryChange(category.key)}
              >
                {category.label}
              </button>
            );
          })}
        </section>

        <section className="content-card">
          <div className="content-topbar">
            <button type="button" className="back-button" onClick={handleGoBack}>
              ← Atras
            </button>
          </div>
          <div className="content-badge">Categoria activa</div>
          <h2 className="content-title">{currentCategory.label}</h2>
          <p className="content-description">{currentCategory.description}</p>
          <div key={`${activeCategory}-${activeDay ?? "lista"}`} className="screen-transition">
            {renderContent()}
          </div>
        </section>

        <button
          type="button"
          className="theme-toggle"
          aria-label="Cambiar entre modo claro y oscuro"
          aria-pressed={theme === "dark"}
          onClick={toggleTheme}
        >
          <span className={`theme-toggle-track ${theme === "dark" ? "theme-toggle-track-dark" : ""}`}>
            <span className={`theme-toggle-thumb ${theme === "dark" ? "theme-toggle-thumb-dark" : ""}`} />
          </span>
          <span className="theme-toggle-text">{theme === "dark" ? "Oscuro" : "Claro"}</span>
        </button>
      </div>
    </main>
  );
}
