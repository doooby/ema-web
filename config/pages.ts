export interface Resource {
  name: string;
  pages: string[];
}

export const dbPages: Resource[] = [
  { name: 'donors', pages: [ '', 'new' ] },
  { name: 'material_kits', pages: [ '', 'new' ] },
  { name: 'users', pages: [ '', 'new' ] },
  { name: 'projects', pages: [ '', 'new' ] },
  { name: 'education_levels', pages: [ '', 'new' ] },
  { name: 'courses', pages: [ '', 'new' ] },
  { name: 'standardized_courses', pages: [ '', 'new' ] },
  { name: 'subjects', pages: [ '', 'new' ] },
  { name: 'subject_categories', pages: [ '', 'new' ] },
  { name: 'schools', pages: [ '', 'new' ] },
  { name: 'school_years', pages: [ '', 'new' ] },
  { name: 'groups', pages: [ '', 'new' ] },
  { name: 'people', pages: [ '', 'new' ] },
  { name: 'work_agreements', pages: [ '', 'new' ] },
];

export function resourcePath (name: string, page: string): string {
  return `/database/${name}/${page}`;
}

export const entitiesWithShowPage = [
  'courses',
  'groups',
  'people',
  'projects',
  'schools',
  'standardized_courses',
  'users',
];
