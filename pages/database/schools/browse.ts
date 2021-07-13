import { buildDatabasePage } from '~/components';
import BrowsePage from '~/components/database/BrowsePage.vue';

export default buildDatabasePage(
  BrowsePage,
  {
    entity: 'schools',
    searchFields: [
      { name: 'name', control: 'text' },
    ],
    tableColumns: [
      { name: 'id' },
      { name: 'name', cell: { type: 'link', entity: 'schools' } },
      { name: 'country', getText: (school: any) => school.country.name },
      { name: 'address' },
    ],
    recordActions: {
      edit: true,
    },
  },
);
