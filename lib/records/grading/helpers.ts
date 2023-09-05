import { BRecord } from '~/lib/api2';
import { course } from '~/lib/records';
import { reverse, times } from 'lodash';

export function buildSubjectsGrading (course: course.Course): {
  subject: BRecord;
  grading: undefined | course.grading.GradingDefinition;
}[] {
  return (course.subjects ?? []).map(({ subject, grading }) => ({
    subject,
    grading: buildGradingDefinition(grading ?? course.preferred_grading),
  }));
}

function buildGradingDefinition (
  grading: undefined | [string, string, (undefined | string)],
): undefined | course.grading.GradingDefinition {
  if (!grading?.[0]) return;

  let type, min, max, isReversed, options;
  const minChar = grading[0].charCodeAt(0);
  if (grading[0].length === 1 && minChar >= 65 && minChar <= 90) {
    type = 'letter';
    min = sanitizeGradingLetter(grading[0]);
    max = sanitizeGradingLetter(grading[1]);
    [ min, max, isReversed ] = buildRange(min, max);
    options = buildOptions(min, max, isReversed,
      value => String.fromCharCode(value));
  } else {
    type = 'number';
    min = sanitizeNumericalGrade(grading[0]);
    max = sanitizeNumericalGrade(grading[1]);
    [ min, max, isReversed ] = buildRange(min, max);
    options = buildOptions(min, max, isReversed,
      value => String(value));
  }

  return {
    type,
    limit: [ min, max ],
    options,
    requiredIndex: findRequiredIndex(grading[2], options),
  };
}

function sanitizeNumericalGrade (input: string): null | number {
  const value = Number.parseInt(input);
  return (isNaN(value) || value < 0 || value > 100) ? null : value;
}

function sanitizeGradingLetter (char: string): null | number {
  const ord = char.charCodeAt(0);
  if (ord >= 65 && ord <= 90) return ord;
  return null;
}

function buildRange (min: number, max: number): [number, number, boolean] {
  if (min > max) {
    return [ max, min, true ];
  } else {
    return [ min, max, false ];
  }
}

function buildOptions (
  min: number,
  max: number,
  isReversed: boolean,
  map: (value: number) => string,
): string[] {
  let list = times(max - min + 1, (index) => {
    return map(min + index);
  });
  if (isReversed) list = reverse(list);
  list.splice(0, 0, '');
  return list;
}

function findRequiredIndex (
  input: undefined | string,
  options: string[],
): undefined | number {
  if (input) {
    const index = options.indexOf(input);
    if (index !== -1) return index;
  }
}
