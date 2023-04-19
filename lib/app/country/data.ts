import { Option } from '~/lib/app';

type OptionsBuilder = () => Option[];

export interface Data {
  options: {
    records: {
      courses: {
        accreditation_authority: OptionsBuilder;
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
              { value: 'gov', textKey: 'db.record.courses.accreditation_authority.gov' },
              { value: 'ngo', textKey: 'db.record.courses.accreditation_authority.ngo' },
            ];
          },
        },
      },
    },
  };
}
