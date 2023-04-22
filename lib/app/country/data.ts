import app from '~/lib/app';

type OptionsBuilder = () => app.Option[];

export interface Data {
  options: {
    records: {
      courses: {
        accreditationAuthorities: OptionsBuilder;
      };
      schools: {
        educationTypes: OptionsBuilder;
      };
      people: {
        genders: OptionsBuilder;
        disabilities: OptionsBuilder;
        enrollmentReasons: OptionsBuilder;
        outsideSchoolTerms: OptionsBuilder;
        residencyStatuses: OptionsBuilder;
        schoolTransports: OptionsBuilder;
        caregiverRelations: OptionsBuilder;
      }
    }
  }
}

function mapOptions (textKeyPrefix: string, values: string[]): app.Option[] {
  return values.map(value => ({
    value,
    textKey: `${textKeyPrefix}.${value}`,
  }));
}

// TODO t81
// 1. validate & complete these lists
// 2. unify & change keys to `app.internal_lists.<courses.accreditationAuthorities>`
// 3. flatten the structure - `options: { accreditationAuthorities, educationTypes, [...etc] }`
// 4. instead `lexicon.unknown` option create a form field config option
// 5. remove old listings (search for `TODO t81 __supplement`
export function defaultCountryData (): Data {
  return {
    options: {
      records: {
        courses: {
          accreditationAuthorities () {
            return mapOptions('db.common.accreditation_authority', [
              'gov',
              'ngo',
            ]);
          },
        },
        schools: {
          educationTypes () {
            return mapOptions('db.common.education_type', [
              'formal',
              'informal',
            ]);
          },
        },
        people: {
          genders () {
            return [
              { value: 'm', textKey: 'db.common.genders.boys.p' },
              { value: 'f', textKey: 'db.common.genders.girls.p' },
            ];
          },
          disabilities () {
            return mapOptions('db.record.people.disabilities', [
              'hearing',
              'visual',
              'physical',
              'intellectual',
              'mental',
              'communication',
              'autism',
              'other',
            ]);
          },
          enrollmentReasons () {
            return mapOptions('db.record.people.enrolment_reasons', [
              'education',
              'closest_school',
              'sole_school',
              'best_school',
              'is_behind',
              'needs_pss',
              'center_help',
              'community_integration',
              'social_net',
              'safest_place',
              'needs_social',
            ]);
          },
          outsideSchoolTerms () {
            return mapOptions('db.record.people.outside_school_terms', [
              'less than one month',
              '1-2 months',
              '1-2 years',
              'More than 2 years',
              '7-12 months',
              '3-6 months',
            ]);
          },
          residencyStatuses () {
            return [
              { value: '', textKey: 'lexicon.unknown' },
              ...mapOptions('db.record.people.residency_status', [
                'resident_host',
                'idp',
                'returnee',
                'refugee',
              ]),
            ];
          },
          schoolTransports () {
            return [
              { value: '', textKey: 'lexicon.unknown' },
              ...mapOptions('db.record.people.school_transport', [
                'walk',
                'bike',
                'car',
                'motorbike',
                'public',
                'bus',
              ]),
            ];
          },
          caregiverRelations () {
            return mapOptions('db.record.people.caregivers.relation', [
              'mother',
              'father',
              'stepmother',
              'stepfather',
              'grandmother',
              'grandfather',
              'aunt',
              'uncle',
              'sister',
              'brother',
            ]);
          },
        },
      },
    },
  };
}
