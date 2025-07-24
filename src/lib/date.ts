import { format } from "date-fns";
import { de } from "date-fns/locale";

function formatDate(date: Date, customFormat = "dd.MM.yyyy") {
  return format(date, customFormat, {
    locale: de,
  });
}

export { formatDate };
