import i18n from "i18next";

/**
 * Format a number using Intl.NumberFormat with the current i18n language.
 */
export function formatNumber(
  value: number,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(i18n.language, options).format(value);
}

/**
 * Format a date using Intl.DateTimeFormat with the current i18n language.
 */
export function formatDate(
  date: Date | number,
  options?: Intl.DateTimeFormatOptions
): string {
  const d = typeof date === "number" ? new Date(date) : date;
  return new Intl.DateTimeFormat(i18n.language, options).format(d);
}

/**
 * Format a value as currency using Intl.NumberFormat with the current i18n language.
 */
export function formatCurrency(
  value: number,
  currency: string,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(i18n.language, {
    style: "currency",
    currency,
    ...options,
  }).format(value);
}
