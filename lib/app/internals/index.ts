import { formatISO } from 'date-fns';

export { default as Admission } from './Admission';
export { default as Options } from './Options';

export function dateToParam (date?: Date): string {
  if (!date) return '';
  return formatISO(date, { representation: 'date' });
}
