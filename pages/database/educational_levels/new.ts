import { buildDatabasePage } from '~/components';
import NewPage from '~/components/database/NewPage.vue';

export default buildDatabasePage(
  NewPage,
  {
    entity: 'educational_levels',
    fields: [
      { name: 'order', control: 'text' },
      { name: 'name', control: 'text' },
      { name: 'start_age', control: 'text' },
      { name: 'years_length', control: 'text' },
    ],
  },
);
