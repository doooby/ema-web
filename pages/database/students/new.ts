import { buildDatabasePage } from '~/components';
import NewPage from '~/components/database/NewPage.vue';

export default buildDatabasePage(
  NewPage,
  {
    entity: 'students',
    fields: [
      { name: 'first_name_en', control: 'text' },
      { name: 'last_name_en', control: 'text' },
      { name: 'first_name', control: 'text' },
      { name: 'last_name', control: 'text' },
      { name: 'born_at', control: 'date' },
    ],
  },
);
