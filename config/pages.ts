export interface Resource {
  name: string;
  pages: string[];
}


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
