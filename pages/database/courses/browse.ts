import { buildDatabasePage } from '~/components';
import BrowsePage from '~/components/database/BrowsePage.vue';

export default buildDatabasePage(
  BrowsePage,
  {
    entity: 'courses',
    searchFields: [
      { name: 'name', controlType: 'text' },
    ],
    tableColumns: [
      { name: 'id' },
      { name: 'name' },
      { name: 'country', value: (school: any) => school.country.name },
    ],
  },
);
