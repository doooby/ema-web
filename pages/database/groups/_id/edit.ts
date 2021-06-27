import { buildDatabasePage } from '~/components';
import EditPage from '~/components/database/EditPage.vue';

export default buildDatabasePage(
  EditPage,
  {
    entity: 'groups',
    fields: [
      { name: 'name', control: 'text' },
      { name: 'year', control: 'text' },
      { name: 'course', control: { type: 'assoc', entity: 'courses' } },
    ],
  },
);
