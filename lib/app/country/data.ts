import app from '~/lib/app';

type OptionsBuilder = () => app.Option[];

export interface Data {
  options: {
    records: {
      courses: {
        accreditation_authority: OptionsBuilder;
      };
      schools: {
        education_types: OptionsBuilder;
        gender_dedications: OptionsBuilder;
      }
    }
  }
}

export function defaultCountryData (): Data {
  return {
    options: {
      records: {
        courses: {
          accreditation_authority () {
            return [
              { value: 'gov', textKey: 'db.common.accreditation_authority.gov' },
              { value: 'ngo', textKey: 'db.common.accreditation_authority.ngo' },
            ];
          },
        },
        schools: {
          education_types () {
            return [
              { value: 'formal', textKey: 'db.common.education_type.formal' },
              { value: 'informal', textKey: 'db.common.education.informal' },
            ];
          },
          gender_dedications () {
            return [
              { value: 'formal', textKey: 'db.common.genders.boys.p' },
              { value: 'informal', textKey: 'db.common.genders.girls.p' },
            ];
          },
        },
      },
    },
  };
}
