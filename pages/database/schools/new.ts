import { buildDatabasePage } from '~/components';
import NewPage from '~/components/database/NewPage.vue';

export default buildDatabasePage(
  NewPage,
  {
    entity: 'schools',
    fields: [
      { name: 'name', controlType: 'text' },
      { name: 'address', controlType: 'text' },
    ],
  },
);
