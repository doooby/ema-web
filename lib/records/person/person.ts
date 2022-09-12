import { asFieldType, controls, FormFieldDefinition } from '~/components/Form';
import { person, common } from '~/lib/records';
import CaregiversField from '~/components/database/records/people/CaregiversField.vue';

export function editControls (): FormFieldDefinition[] {
  return [
    [ 'first_name', controls.name ],
    [ 'last_name', controls.name ],
    [ 'born_on', controls.date ],
    [ 'gender', controls.select, {
      options: common.options.formalGenders(),
    } ],
    [ 'passport_no', controls.text ],
    [ 'telephone_no', controls.text ],
    [ 'mother_tongue', controls.select, {
      options: [],
    } ],
    [ 'spoken_languages', controls.select, {
      options: [],
    } ],
    [ 'disability', controls.selectOrFill, {
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
