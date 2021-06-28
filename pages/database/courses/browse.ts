import { buildDatabasePage } from '~/components';
import BrowsePage from '~/components/database/BrowsePage.vue';

export default buildDatabasePage(
  BrowsePage,
  {
    entity: 'courses',
    searchFields: [
      { name: 'name', control: 'text' },
    ],
    tableColumns: [
      { name: 'id' },
      { name: 'name' },
    ],
    recordActions: {
      edit: true,
      show: true,
    },
  },
);
