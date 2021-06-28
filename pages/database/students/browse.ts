import { buildDatabasePage } from '~/components';
import BrowsePage from '~/components/database/BrowsePage.vue';

export default buildDatabasePage(
  BrowsePage,
  {
    entity: 'students',
    searchFields: [
      { name: 'name', control: 'text' },
    ],
    tableColumns: [
      { name: 'id' },
      { name: 'full_name' },
    ],
    recordActions: {
      edit: true,
      show: true,
    },
  },
);
