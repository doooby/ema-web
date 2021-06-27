import { buildDatabasePage } from '~/components';
import NewPage from '~/components/database/NewPage.vue';

export default buildDatabasePage(
  NewPage,
  {
    entity: 'groups',
    fields: [
      { name: 'name', control: 'text' },
      { name: 'year', control: 'text' },
      { name: 'course', control: { type: 'assoc', entity: 'courses' } },
      { name: 'school', control: { type: 'assoc', entity: 'schools' } },
    ],
  },
);
