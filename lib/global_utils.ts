import { formatISO } from 'date-fns';

export function raise (error: Error) {
  notify('error', error);
  throw error;
}

export function warn (message: string, context?: any) {
  notify('warn', message, context);
}

export function notify (
  type: 'error' | 'warn',
  message: string | Error,
  context?: any,
): void {
  switch (type) {
    case 'error':
      // eslint-disable-next-line no-console
      console.error(message);
      break;
    case 'warn':
      // eslint-disable-next-line no-console
      console.error(message);
      // eslint-disable-next-line no-console
      if (context) console.log('warn context: ', context);
      break;
  }
}

export function forTimeout (time: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, time));
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
