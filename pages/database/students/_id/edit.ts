import { buildDatabasePage } from '~/components';
import EditPage from '~/components/database/EditPage.vue';

export default buildDatabasePage(
  EditPage,
  {
    entity: 'students',
    fields: [
      { name: 'full_name', control: 'text' },
    ],
  },
);
