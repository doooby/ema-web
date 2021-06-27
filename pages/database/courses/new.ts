import { buildDatabasePage } from '~/components';
import NewPage from '~/components/database/NewPage.vue';

export default buildDatabasePage(
  NewPage,
  {
    entity: 'courses',
    fields: [
      { name: 'name', control: 'text' },
    ],
  },
);
