import { buildDatabasePage } from '~/components';
import EditPage from '~/components/database/EditPage.vue';

export default buildDatabasePage(
  EditPage,
  {
    entity: 'schools',
    fields: [
      { name: 'name', control: 'text' },
      { name: 'address', control: 'text' },
    ],
  },
);
