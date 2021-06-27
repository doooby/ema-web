import { buildDatabasePage } from '~/components';
import NewPage from '~/components/database/NewPage.vue';

export default buildDatabasePage(
  NewPage,
  {
    entity: 'users',
    fields: [
      { name: 'login', control: 'text' },
      { name: 'full_name', control: 'text' },
    ],
  },
);
