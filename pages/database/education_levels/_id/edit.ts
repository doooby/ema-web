import { buildDatabasePage } from '~/components';
import EditPage from '~/components/database/EditPage.vue';

export default buildDatabasePage(
  EditPage,
  {
    entity: 'education_levels',
    fields: [
      { name: 'order', control: 'text' },
      { name: 'name', control: 'text' },
      { name: 'start_age', control: 'text' },
      { name: 'years_length', control: 'text' },
    ],
  },
);
