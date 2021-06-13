import { buildDatabasePage } from '~/components';
import EditPage from '~/components/database/EditPage.vue';

export default buildDatabasePage(
  EditPage,
  {
    entity: 'users',
    fields: [
      { name: 'login', controlType: 'text' },
      { name: 'full_name', controlType: 'text' },
    ],
  },
);
