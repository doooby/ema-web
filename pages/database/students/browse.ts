import { buildDatabasePage } from '~/components';
import BrowsePage from '~/components/database/BrowsePage.vue';

export default buildDatabasePage(
  BrowsePage,
  {
    entity: 'students',
    searchFields: [
      { name: 'name', controlType: 'text' },
    ],
    tableColumns: [
      { name: 'id' },
      { name: 'full_name' },
      { name: 'country', value: (school: any) => school.country.name },
    ],
  },
);
