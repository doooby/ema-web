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
      { name: 'name', cell: { type: 'link', entity: 'groups' } },
      { name: 'year' },
      { name: 'course', cell: { type: 'assoc', entity: 'courses' } },
      { name: 'school', cell: { type: 'assoc', entity: 'schools' } },
    ],
    recordActions: {
      edit: true,
    },
  },
);
