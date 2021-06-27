import { buildDatabasePage } from '~/components';
import BrowsePage from '~/components/database/BrowsePage.vue';

export default buildDatabasePage(
  BrowsePage,
  {
    entity: 'users',
    searchFields: [
      { name: 'name', control: 'text' },
    ],
    tableColumns: [
      { name: 'id' },
      { name: 'login' },
      { name: 'country', value: (user: any) => user.country.name },
      { name: 'full_name' },
    ],
    recordActions: {
      edit: true,
    },
  },
);
