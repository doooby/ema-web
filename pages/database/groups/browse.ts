import { buildDatabasePage } from '~/components';
import BrowsePage from '~/components/database/BrowsePage.vue';

export default buildDatabasePage(
  BrowsePage,
  {
    entity: 'groups',
    searchFields: [
      { name: 'name', control: 'text' },
    ],
    tableColumns: [
      { name: 'id' },
      { name: 'name' },
      { name: 'year' },
      { name: 'course', cell: { type: 'assoc', entity: 'courses' } },
      { name: 'school', cell: { type: 'assoc', entity: 'courses' } },
    ],
    recordActions: {
      show: true,
      edit: true,
    },
  },
);
