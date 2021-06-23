const shared = {
  record: {
    id: 'id',
    name: 'name',
    country: 'country',
  },
};

export default {
  form: {
    field: {
      name: 'name',
    },
    actions: {

    },
  },
  record: {
    countries: {
      meta: { s: 'country', p: 'countries' },
      id: shared.record.id,
      name: shared.record.name,
    },
    users: {
      meta: { s: 'user', p: 'users' },
      id: shared.record.id,
      login: 'login',
      full_name: shared.record.name,
      country: shared.record.country,
    },
    schools: {
      meta: { s: 'school', p: 'schools' },
      id: shared.record.id,
      name: shared.record.name,
      country: shared.record.country,
      address: 'address',
    },
    courses: {
      meta: { s: 'course', p: 'courses' },
      id: shared.record.id,
      name: shared.record.name,
      country: shared.record.country,
    },
    students: {
      meta: { s: 'student', p: 'students' },
      id: shared.record.id,
      full_name: shared.record.name,
      country: shared.record.country,
    },
  },
  db: {
    meta: {
      loading: '...loading the record',
      record_not_found: 'Record not found.',
      processing: '...processing',
      save: 'Save',
    },
    menu: {
      index_link: 'Index Page',
      search_placeholder: 'search resource',
    },
    pages: {
      browse: 'Browse',
      new: 'Add New Record',
    },
    browse: {
      search: 'search',
    },
    new: {
      title: 'new {entity}',
    },
  },
};
