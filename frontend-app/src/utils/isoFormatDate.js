import { useI18n } from "vue-i18n";
export function isoFormatDate(dateInput) {
     function parseDate(input) {
          if (input instanceof Date) return isNaN(input) ? null : input;
          if (typeof input === 'number') {
               const d = new Date(input);
               return isNaN(d) ? null : d;
          }
          if (typeof input === 'string') {
               const d = new Date(input);
               return isNaN(d) ? null : d;
          }
          return null;
     }

     function pad2(n) {
          return n.toString().padStart(2, '0');
     }

     const { t } = useI18n();

     const monthNames = [
          'calendar.january', 'calendar.february', 'calendar.march', 'calendar.april',
          'calendar.may', 'calendar.june', 'calendar.july', 'calendar.august', 'calendar.september',
          'calendar.october', 'calendar.november', 'calendar.december'
     ]

     const date = parseDate(dateInput);
     if (!date) return null;

     const year = date.getFullYear();
     const month = pad2(date.getMonth() + 1);
     const day = pad2(date.getDate());
     const hours = pad2(date.getHours());
     const minutes = pad2(date.getMinutes());
     const seconds = pad2(date.getSeconds());
     const milliseconds = date.getMilliseconds();

     const iso8601 = date.toISOString();
     const isoDate = `${year}-${month}-${day}`;
     const localDate = `${day}/${month}/${year}`;
     const longSpanishDate = `${day} de ${t(monthNames[date.getMonth()])} de ${year}`;
     const timestamp = date.getTime();

     return {
          iso8601,
          isoDate,
          localDate,
          longSpanishDate,
          timestamp,
          rawDate: date
     };
}

