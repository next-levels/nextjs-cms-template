import { format, formatDistance, formatRelative } from "date-fns";
import { de } from "date-fns/locale";

export function formatDate(date: Date | string | number, formatStr = "PPP") {
  return format(new Date(date), formatStr, {
    locale: de,
  });
}

export function formatDateRelative(date: Date | string | number) {
  return formatRelative(new Date(date), new Date(), {
    locale: de,
  });
}

export function formatDateDistance(date: Date | string | number) {
  return formatDistance(new Date(date), new Date(), {
    addSuffix: true,
    locale: de,
  });
}

export function isValidDate(date: unknown): boolean {
  return date instanceof Date && !isNaN(date.getTime());
}
