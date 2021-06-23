import { buildDatabasePage } from '~/components';
import EditPage from '~/components/database/EditPage.vue';

export default buildDatabasePage(
  EditPage,
  {
    entity: 'courses',
    fields: [
      { name: 'name', controlType: 'text' },
    ],
  },
);
