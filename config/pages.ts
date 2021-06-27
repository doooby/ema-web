export interface Resource {
  name: string;
  pages: string[];
}

export const dbPages: Resource[] = [
  { name: 'countries', pages: [ 'browse', 'new' ] },
  { name: 'users', pages: [ 'browse', 'new' ] },

  { name: 'courses', pages: [ 'browse', 'new' ] },
  { name: 'groups', pages: [ 'browse', 'new' ] },
  { name: 'schools', pages: [ 'browse', 'new' ] },
  { name: 'students', pages: [ 'browse', 'new' ] },
];

export function resourcePath (name: string, page: string): string {
  return `/database/${name}/${page}`;
}
