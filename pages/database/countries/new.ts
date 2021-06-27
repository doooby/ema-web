import { buildDatabasePage } from '~/components';
import NewPage from '~/components/database/NewPage.vue';

export default buildDatabasePage(
  NewPage,
  {
    entity: 'countries',
    fields: [
      { name: 'name', control: 'text' },
    ],
  },
);
