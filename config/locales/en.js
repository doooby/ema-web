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
      id: 'id',
      name: 'name',
    },
    users: {
      meta: { s: 'user', p: 'users' },
      id: 'id',
      login: 'login',
      full_name: 'full name',
      country: 'country',
    },
    schools: {
      meta: { s: 'school', p: 'schools' },
      id: 'id',
      name: 'name',
      country: 'country',
      address: 'address',
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
