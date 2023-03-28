import { asFieldType, controls, FormFieldDefinition } from '~/components/Form';
import { common, person } from '~/lib/records';
import CaregiversField from '~/components/database/records/people/CaregiversField.vue';
import { recordsQueries } from '~/lib/api2';

export const entity = 'people';

export const queries = {
  searchB: recordsQueries.searchB(entity),
};

export function editControls (): FormFieldDefinition[] {
  return [
    [ 'first_name', controls.name ],
    [ 'last_name', controls.name ],
    [ 'born_on', controls.date ],
    [ 'gender', controls.select, {
      options: common.options.formalGenders(),
    } ],
    [ 'citizen_id', controls.text ],
    [ 'passport_no', controls.text ],
    [ 'telephone_no', controls.text ],
    [ 'mother_tongue', controls.select, {
      options: [],
    } ],
    [ 'outside_school', controls.select, {
      options: person.outsideSchool(),
    } ],
    [ 'nationality', controls.select, {
      options: [],
    } ],
    [ 'spoken_languages', controls.listMultiple, {
      options: [],
    } ],
    [ 'registered_on', controls.date ],
    [ 'enrollment_reasons', controls.listMultiple, {
      options: person.enrollmentReasons(),
    } ],
    [ 'disabilities', controls.listMultiple, {
      options: person.disabilityOptions(),
    } ],
    [ 'disability_diagnosis', controls.boolean ],
    [ 'assistance_needed', controls.boolean ],
    [ 'assistance_provided', controls.boolean ],
    [ 'disability_note', controls.textMultiline ],
    [ 'residency_status', controls.selectOrFill, {
      options: person.ResidencyStatusOptions(),
    } ],
    [ 'school_distance_km', controls.integer ],
    [ 'school_distance_min', controls.integer ],
    [ 'school_transport', controls.selectOrFill, {
      options: person.schoolTransportOptions(),
    } ],
    [ 'caregivers', asFieldType(CaregiversField) ],
  ];
}
