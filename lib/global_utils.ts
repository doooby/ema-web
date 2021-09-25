import { formatISO } from 'date-fns';

export function raise (error: Error) {
  notify('error', error);
  throw error;
}

export function notify (
  type: 'error',
  message: string | Error,
  context?: any,
): void {
  switch (type) {
    case 'error':
      console.error(message);
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
