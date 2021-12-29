export interface EducationLevel {
  id: number;
  name: string;
  level: number;
  terms_per_year?: number;
  years_length?: number;
  start_age?: number;
  mandatory?: boolean;
}
