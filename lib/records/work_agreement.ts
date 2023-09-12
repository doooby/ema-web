import { BRecord, RecordAssociations, recordsQueries } from '~/lib/api2';
import { application_record } from '~/lib/records/index';
import { wai } from '~/vendor/wai';
import { mapAssociation, mapAssociations, mapDate, mapName } from '~/lib/api2/mappers';
import { controls, FormFieldDefinition } from '~/components/Form';
import { dbFields } from '~/components/database/fields';
import app from '~/lib/app';

export const entity = 'work_agreements';

export interface WorkAgreement extends application_record.SharedAttributes {
  school: BRecord;
  person: BRecord;
  projects?: BRecord[];
  donors?: BRecord[];
  position?: string;
  external_id?: string;
  navision_id?: string;
  starts_on?: Date;
  ends_on?: Date;
  resigned_on?: Date;
  resignation_reason?: string[];
  comment?: string;
}

export function parseRecord (
  value: unknown,
  associations?: RecordAssociations,
): WorkAgreement {
  return wai.object(value => ({
    ...application_record.parseSharedAttributes(value),
    school: wai.prop('school_id', value, mapAssociation('schools', associations)),
    person: wai.prop('person_id', value, mapAssociation('people', associations)),
    projects: wai.prop('projects_ids', value, mapAssociations('projects', associations)),
    donors: wai.prop('donors_ids', value, mapAssociations('donors', associations)),
    position: wai.prop('position', value, wai.nullable(wai.string)),
    external_id: wai.prop('external_id', value, wai.nullable(wai.string)),
    navision_id: wai.prop('navision_id', value, wai.nullable(wai.string)),
    starts_on: wai.prop('starts_on', value, wai.nullable(mapDate)),
    ends_on: wai.prop('ends_on', value, wai.nullable(mapDate)),
    resigned_on: wai.prop('resigned_on', value, wai.nullable(mapDate)),
    resignation_reason: wai.prop('resignation_reason', value, wai.nullable(mapName)),
    comment: wai.prop('comment', value, wai.nullable(wai.string)),
  }))(value);
}

export const queries = {
  search: recordsQueries.search(entity, parseRecord),
  searchB: recordsQueries.searchB(entity),
  create: recordsQueries.create(entity),
  update: recordsQueries.update(entity),
};

export function recordControls ({
  countryData,
}: {
  countryData?: app.session.CountryData;
}): FormFieldDefinition[] {
  return [
    [ 'school', dbFields.selectBRecord, {
      entity: 'schools',
    } ],
    [ 'person', dbFields.selectBRecord, {
      entity: 'people',
    } ],
    [ 'projects', dbFields.selectManyBRecords, {
      entity: 'projects',
    } ],
    [ 'donors', dbFields.selectManyBRecords, {
      entity: 'donors',
    } ],
    [ 'position', controls.select, {
      options: app.internalOptionsList(countryData, 'contract_positions'),
    } ],
    [ 'external_id', controls.text ],
    [ 'navision_id', controls.text ],
    [ 'starts_on', controls.calendar ],
    [ 'ends_on', controls.calendar ],
    [ 'resigned_on', controls.calendar ],
    [ 'resignation_reason', controls.selectOrFill, {
      options: app.extendOptionsList(
        app.internalOptionsList(countryData, 'resignation_reasons'),
        { empty: true },
      ),
    } ],
    [ 'comment', controls.textMultiline ],
  ];
}
