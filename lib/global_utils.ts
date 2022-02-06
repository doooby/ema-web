import { formatISO } from 'date-fns';

export function raise (error: Error) {
  console.error(error);
  throw error;
}

export function warn (message: string, ...context: any) {
  console.log('EMA warning', message);
  if (context) console.log(...context);
}

export function warnOfError (error: Error, ...context: any) {
  console.log('EMA error', error.message);
  if (context) console.log(...context);
  console.error(error);
}

export function formatDate (date?: Date): string {
  if (!date) return '';
  return formatISO(date, { representation: 'date' });
}

export function sanitizedDate (date: any): undefined | Date {
  return (date instanceof Date && !isNaN(date as any))
    ? date
    : undefined;
}
