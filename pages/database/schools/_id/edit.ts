import { buildDatabasePage } from '~/components';
import EditPage from '~/components/database/EditPage.vue';

export default buildDatabasePage(
  EditPage,
  {
    entity: 'schools',
    fields: [
      { name: 'name', controlType: 'text' },
      { name: 'address', controlType: 'text' },
    ],
  },
);
