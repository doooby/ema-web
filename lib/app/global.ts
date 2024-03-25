import { formatISO, parseISO } from 'date-fns';

// export const GLOBAL_DATE_FORMAT = 'dd/MM/uuuu';

export function warn (message: string, ...context: any) {
  console.log('EMA warning', message);
  if (context) console.log(...context);
}

export function warnOfError (error, ...context: any) {
  console.error(error);
  if (context) console.log(...context);
}

// this strips the timezone, which is necessary, when sending the date to the server
// TODO deprecated, use `app.internals.dateToParam`
export function dateToParam (date?: Date): string {
  if (!date) return '';
  return formatISO(date, { representation: 'date' });
}

// TOTO rename to parseParamDate
export function parseDate (value?: string) {
  return value ? parseISO(value) : undefined;
}

export function sanitizedDate (date: any): undefined | Date {
  return (date instanceof Date && !isNaN(date as any))
    ? date
    : undefined;
}
