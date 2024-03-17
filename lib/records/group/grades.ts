import app from '~/lib/app';

export type GradesRecord = app.Nullable<any>;

export function updateGradesRecord (
  current: GradesRecord,
  original: GradesRecord,
  subject_id: string,
  person_id: string,
  value: string,
): GradesRecord {
  let record: GradesRecord = current;

  record = Object.freeze({
    ...record,
    [subject_id]: Object.freeze({
      ...record?.[subject_id],
      [person_id]: value,
    }),
  });

  const savedValue = original?.[subject_id]?.[person_id] ?? '';

  if (savedValue === value) {
    const newGrades = {
      ...record,
      [subject_id]: {
        ...record?.[subject_id],
        [person_id]: undefined,
      },
    };
    delete newGrades[subject_id][person_id];
    if (!Object.keys(newGrades[subject_id]).length) {
      delete newGrades[subject_id];
      if (!Object.keys(newGrades).length) {
        record = null;
        return;
      }
    }
    Object.freeze(newGrades);
    Object.freeze(newGrades[subject_id]);
    record = newGrades;
  }

  return record;
}
