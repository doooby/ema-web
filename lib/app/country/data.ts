import app from '~/lib/app';

type OptionsBuilder = () => app.Option[];

export interface Data {
  options: {
        accreditationAuthorities: OptionsBuilder;
        educationTypes: OptionsBuilder;
        genders: OptionsBuilder;
        disabilities: OptionsBuilder;
        enrollmentReasons: OptionsBuilder;
        outsideSchoolTerms: OptionsBuilder;
        residencyStatuses: OptionsBuilder;
        schoolTransports: OptionsBuilder;
        caregiverRelations: OptionsBuilder;
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
// 4. instead `lexicon.unknown` option create a form field config option
// 5. remove old listings (search for `TODO t81 __supplement`
// 6. create
export function defaultCountryData (): Data {
  return {
    options: {
      accreditationAuthorities () {
        return mapOptions('app.internal_lists.accreditation_authority', [
          'gov',
          'ngo',
        ]);
      },
      educationTypes () {
        return mapOptions('app.internal_lists.education_type', [
          'formal',
          'informal',
        ]);
      },
      genders () {
        return [
          { value: 'm', textKey: 'app.internal_lists.genders.boys.p' },
          { value: 'f', textKey: 'app.internal_lists.genders.girls.p' },
        ];
      },
      disabilities () {
        return mapOptions('app.internal_lists.disabilities', [
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
        return mapOptions('app.internal_lists.enrolment_reasons', [
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
        return mapOptions('app.internal_lists..outside_school_terms', [
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
          ...mapOptions('app.internal_lists.residency_status', [
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
          ...mapOptions('app.internal_lists.school_transport', [
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
        return mapOptions('app.internal_lists.caregivers.relation', [
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
  };
}
