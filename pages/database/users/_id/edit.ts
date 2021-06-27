import { buildDatabasePage } from '~/components';
import EditPage from '~/components/database/EditPage.vue';

export default buildDatabasePage(
  EditPage,
  {
    entity: 'users',
    fields: [
      { name: 'login', control: 'text' },
      { name: 'full_name', control: 'text' },
    ],
  },
);
