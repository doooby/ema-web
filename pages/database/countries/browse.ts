import { buildDatabasePage } from '~/components';
import BrowsePage from '~/components/database/BrowsePage.vue';

export default buildDatabasePage(
  BrowsePage,
  {
    entity: 'countries',
    searchFields: [
      { name: 'name', controlType: 'text' },
    ],
    tableColumns: [
      { name: 'id' },
      { name: 'name' },
    ],
  },
);
