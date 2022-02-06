export interface Resource {
  name: string;
  pages: string[];
}

export const dbPages: Resource[] = [
  { name: 'countries', pages: [ '' ] },
  { name: 'users', pages: [ '', 'new' ] },
  { name: 'education_levels', pages: [ '' ] },
  { name: 'courses', pages: [ '', 'new' ] },
  { name: 'subjects', pages: [ '', 'new' ] },
  // gut up
  { name: 'schools', pages: [ '', 'new' ] },
  { name: 'term_groups', pages: [ 'browse', 'new' ] },
  { name: 'students', pages: [ 'browse', 'new' ] },
];

export function resourcePath (name: string, page: string): string {
  return `/database/${name}/${page}`;
}
