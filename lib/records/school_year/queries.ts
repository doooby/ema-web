import { recordsQueries } from '~/lib/api2';
import { school_year } from '~/lib/records';

const path = 'school_years';

export const search = recordsQueries.search(path, school_year.parseRecord);
export const create = recordsQueries.create(path);
export const update = recordsQueries.update(path);
