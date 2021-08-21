import * as mappers from '~/lib/api/mappers';

export interface Student {
  id: number;
  country: mappers.AssociatedRecord;
  first_name_en: string;
  last_name_en: string;
  first_name?: string;
  last_name?: string;
  born_on?: Date;
  gender?: string;
  language?: string;
  address?: string;
  residency?: string;
  distance_school_km?: number;
  distance_school_time?: number;
  caregivers_en?: string[];
  caregivers?: string[];
  caregivers_contact?: string;
  caregivers_cfw?: { v: 0 } | { v: 1, h: string };
  out_of_school?: number;
  enrolment_on?: Date;
  completion_on?: Date;
  dropped_out_on?: Date;
  drop_out_reason?: string;
  disability?: {
    s: string;
    d?: 0 | 1;
    n?: 1;
    p?: 1;
  };
}

export interface StudentAssociations {
  country: mappers.AssociatedRecordsIndex,
}

export const student = {
  residencyOptions: Object.freeze([
    'resident',
    'idp',
    'host',
    'resettled',
    'returnee',
  ]),

  caregivers_cfwToText ({ caregivers_cfw }: Student): string {
    if (!caregivers_cfw) return '';
    if (caregivers_cfw.v === 1) return `CFW=1, humansis_id=${caregivers_cfw.h}`;
    return 'CFW=0';
  },

  disabilityToText ({ disability }: Student): string {
    if (!disability) return '';
    const { s, d, n, p } = disability;
    const dd = d === 1 ? d : (d === 0 ? 0 : 'n/a');
    const nn = n === 1 ? n : 0;
    const pp = p === 1 ? p : 0;
    return `status=${s}, diagnosis=${dd}, assistance needed=${nn}, provided=${pp}`;
  },
};
