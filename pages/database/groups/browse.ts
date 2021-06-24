import { buildDatabasePage } from '~/components';
import BrowsePage from '~/components/database/BrowsePage.vue';

export default buildDatabasePage(
  BrowsePage,
  {
    entity: 'groups',
    searchFields: [
      { name: 'name', controlType: 'text' },
    ],
    tableColumns: [
      { name: 'id' },
      { name: 'name' },
      { name: 'year' },
      { name: 'course', value: (group: any) => group.course.name },
      { name: 'school', value: (group: any) => group.school.name },
    ],
    recordActions: {
      show: true,
    },
  },
);
