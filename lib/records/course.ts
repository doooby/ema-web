import * as mappers from '~/lib/api/mappers';
import { EducationLevel } from '~/lib/records/education_level';

const { object, recordId, prop, assoc, val } = mappers;

export interface Course {
  id: number;
  education_level: mappers.AssociatedRecord<EducationLevel>;
  name_en: string;
  name: string;
  grade: number;
}

export interface CourseAssociations {
  education_level: mappers.AssociatedRecordsIndex,
}

export function mapCourse (value: any, associations?: CourseAssociations): Course {
  return object(value, root => ({
    id: recordId(root),
    name_en: prop('name_en', root, val.string),
    name: prop('name', root, val.string),
    grade: prop('grade', root, val.integer),
    education_level: assoc('education_level', root, associations?.education_level),
  }));
}

export const mapCourseAssociations = mappers.createAssociationsMapper<CourseAssociations>(
  'education_level',
);
