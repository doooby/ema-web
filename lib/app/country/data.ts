import app from '~/lib/app';

type OptionsBuilder = () => app.Option[];

export interface Data {
  options: {
    // TODO t81 eslint ??
        accreditationAuthorities: OptionsBuilder;
        educationTypes: OptionsBuilder;
        genders: OptionsBuilder;
        disabilities: OptionsBuilder;
        enrollmentReasons: OptionsBuilder;
        outsideSchoolTerms: OptionsBuilder;
        residencyStatuses: OptionsBuilder;
        schoolTransports: OptionsBuilder;
        caregiverRelations: OptionsBuilder;
    distancesToSchool: OptionsBuilder;
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
// 4. instead `lexicon.unknown` option create a form field config option
// 5. remove old listings (search for `TODO t81 __supplement`
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
        return mapOptions('app.internal_lists.outside_school_terms', [
          '<1m',
          '1-2m',
          '1-2r',
          '>2y',
          '7-12m',
          '3-6m',
        ]);
      },
      residencyStatuses () {
        return [
          ...mapOptions('app.internal_lists.residency_status', [
            'resident_host',
            'idp',
            'returnee',
            'refugee',
          ]),
        ];
      },
      distancesToSchool () {
        return mapOptions('app.internal_lists.distance_to_school', [
          '<1km',
          '1-2km',
          '3-5km',
          '5-10km',
          '<15km',
          '<20km',
          '2km',
          '<10km',
        ]);
      },
      schoolTransports () {
        return [
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
