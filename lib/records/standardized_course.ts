import * as mappers from '~/lib/api/mappers';
import { EducationLevel } from '~/lib/records';
import { FormFieldDefinition } from '~/components/Form';
import * as dbFields from '~/components/database/controls';
import { asControl } from '~/components/database/controls';
import GradingType from '~/components/database/records/courses/controls/GradingType.vue';

const { object, recordId, prop, assoc, val } = mappers;

export interface StandardizedCourse {
  id: number;
  education_level: mappers.AssociatedRecord<EducationLevel>;
  name_en: string;
  name: string;
}

export interface StandardizedCourseAssociations {
  education_level: mappers.AssociatedRecordsIndex,
}

export const standardizedCourse = {
  mapRecord (value: any, associations?: StandardizedCourseAssociations): StandardizedCourse {
    return object(value, root => ({
      id: recordId(root),
      education_level: assoc('education_level', root, associations?.education_level),
      name_en: prop('name_en', root, val.string),
      name: prop('name', root, val.string),
    }));
  },
  mapAssociations: mappers.createAssociationsMapper<StandardizedCourseAssociations>(
    'education_level',
  ),
  recordControls (countryId: null | number): FormFieldDefinition[] {
    return [
      [ 'name', 'name' ],
      [ 'education_level', dbFields.AssociatedRecord, {
        entity: 'education_levels',
        params: {
          country_id: countryId,
        },
      } ],
      [ 'grade', 'integer', { maxLength: 2 } ],
      [ 'accreditation_authority', 'selectOrFill', {
        options: standardizedCourse.accreditationAuthorityOptions(),
      } ],
      [ 'lesson_duration', 'integer', { rightLabel: 'app.time.minutes.p' } ],
      [ 'attendance_limit', 'integer', {
        requireable: true,
        rightLabel: { text: '%' },
      } ],
      [ 'grading_type', asControl(GradingType) ],
      [ 'description', 'textMultiline' ],
    ];
  },
  accreditationAuthorityOptions () {
    return Object.freeze([
      { value: 'gov', text: 'db.record.standardized_courses.accreditation_authority.gov' },
      { value: 'ngo', text: 'db.record.standardized_courses.accreditation_authority.ngo' },
    ]);
  },
};
