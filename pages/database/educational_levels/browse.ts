import { buildDatabasePage } from '~/components';
import BrowsePage from '~/components/database/BrowsePage.vue';

export default buildDatabasePage(
  BrowsePage,
  {
    entity: 'educational_levels',
    searchFields: [],
    tableColumns: [
      { name: 'id' },
      { name: 'order' },
      { name: 'name' },
      { name: 'start_age' },
      { name: 'years_length' },
    ],
    recordActions: {
      edit: true,
      show: true,
    },
  },
);
