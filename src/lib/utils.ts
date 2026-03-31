export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function currency(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(date: string) {
  if (!date) return "Sin fecha";
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
  }).format(new Date(`${date}T12:00:00`));
}

export function isSameDay(date: string, compareDate: Date) {
  const a = new Date(`${date}T12:00:00`);
  return (
    a.getFullYear() === compareDate.getFullYear() &&
    a.getMonth() === compareDate.getMonth() &&
    a.getDate() === compareDate.getDate()
  );
}

export function getTodayInputValue() {
  return new Date().toISOString().slice(0, 10);
}

export function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

export function toTitleCase(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
