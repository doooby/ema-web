import { buildDatabasePage } from '~/components';
import NewPage from '~/components/database/NewPage.vue';

export default buildDatabasePage(
  NewPage,
  {
    entity: 'students',
    fields: [
      { name: 'full_name', controlType: 'text' },
    ],
  },
);
